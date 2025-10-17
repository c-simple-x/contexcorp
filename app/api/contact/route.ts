import { NextResponse } from "next/server";

/** 한국 전화번호 보정: 숫자만 → 02/3자리 국번 규칙에 따라 하이픈 삽입 */
function normalizeKrPhone(raw: string) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  // 02(서울)
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }
  // 그 외(010/011/070 등 3자리 국번)
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1) 환경변수 확인
    const scriptUrl = process.env.NEXT_PUBLIC_CONTEX_APPSCRIPT_URL!;
    const gasToken = process.env.NEXT_PUBLIC_CONTEX_FORM_TOKEN!;
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY!;
    if (!scriptUrl || !gasToken || !turnstileSecret) {
      return NextResponse.json({ ok: false, error: "env_missing" }, { status: 500 });
    }

    // 2) Turnstile 검증
    const captcha = String(body.captcha || "");
    if (!captcha) return NextResponse.json({ ok: false, error: "captcha_missing" }, { status: 400 });

    const vRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: turnstileSecret,
        response: captcha,
      }),
    });

    const vJson = await vRes.json();
    if (!vJson?.success) {
      return NextResponse.json({ ok: false, error: "captcha_failed" }, { status: 400 });
    }

    // 3) 전화번호 보정 (하이픈 넣어서 시트에 문자열로 저장되게)
    const formattedPhone = normalizeKrPhone(body.phone);

    // 4) GAS로 전달 (x-www-form-urlencoded)
    const formData = new URLSearchParams({
      company: body.company || "",
      name: body.name || "",
      email: body.email || "",
      phone: formattedPhone || "",
      message: body.message || "",
      source: body.source || "web",
      token: gasToken,
      origin: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.contexcorp.com",
    });

    const gasRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!gasRes.ok) {
      const t = await gasRes.text();
      return NextResponse.json({ ok: false, error: "gas_request_failed", gasRaw: t }, { status: 500 });
    }

    const text = await gasRes.text();
    return NextResponse.json({ ok: true, gasRaw: text });
  } catch {
    return NextResponse.json({ ok: false, error: "route_exception" }, { status: 500 });
  }
}
