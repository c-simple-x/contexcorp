import { NextResponse } from "next/server";

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

    // 3) GAS로 전달 (x-www-form-urlencoded)
    const formData = new URLSearchParams({
      company: body.company || "",
      name: body.name || "",
      email: body.email || "",
      phone: body.phone || "",
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
    // GAS가 {ok:true}를 주지 않아도 일단 성공 처리
    return NextResponse.json({ ok: true, gasRaw: text });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "route_exception" }, { status: 500 });
  }
}
