import { NextResponse } from "next/server";

/** 한국 전화번호 보정 (숫자만 → 하이픈 포함 문자열) */
function normalizeKrPhone(raw: string) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("02")) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    if (digits.length <= 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }
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

    // 2) 이메일 영문 전용 검증
    const email = String(body.email || "");
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    // 3) Turnstile 검증
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

    // 4) 전화번호 보정
    const formattedPhone = normalizeKrPhone(body.phone);

    // 5) GAS로 전달
    const formData = new URLSearchParams({
      company: body.company || "",
      name: body.name || "",
      email,
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

    // Resend로 관리자 알림 발송 (hello@contexcorp.com 통일)
    const resendKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.RESEND_FROM_EMAIL;
    const adminTo = process.env.ALERT_EMAIL_TO;
    if (resendKey && resendFrom && adminTo) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: resendFrom,
          to: [adminTo],
          subject: `[CONTEX 문의] ${body.company || body.name}`,
          html: `
            <h2>새 문의가 접수되었습니다.</h2>
            <p><b>회사/이름:</b> ${body.company || "-"}</p>
            <p><b>담당자:</b> ${body.name || "-"}</p>
            <p><b>이메일:</b> ${email}</p>
            <p><b>연락처:</b> ${formattedPhone || "-"}</p>
            <hr/>
            <p><b>내용:</b></p>
            <p>${(body.message || "").replace(/\n/g, "<br/>")}</p>
          `,
        }),
      }).catch(() => {}); // 알림 실패해도 폼 제출은 성공 처리
    }

    return NextResponse.json({ ok: true, gasRaw: text });
  } catch {
    return NextResponse.json({ ok: false, error: "route_exception" }, { status: 500 });
  }
}
