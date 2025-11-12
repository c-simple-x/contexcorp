import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;
const mailTo = process.env.ALERT_EMAIL_TO;
const mailFrom = process.env.ALERT_EMAIL_FROM;

export async function POST(req: Request, ctx: { params: { id: string } }) {
  try {
    const contractId = ctx.params?.id;
    if (!contractId) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

    const { signer_name, signer_email } = await req.json().catch(() => ({}));
    if (!signer_name || !signer_email) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    // 계약 존재 확인
    const { data: contract, error: cErr } = await supabaseAdmin
      .from("contracts")
      .select("id, title, status")
      .eq("id", contractId)
      .single();

    if (cErr || !contract) {
      return NextResponse.json({ ok: false, error: "contract_not_found" }, { status: 404 });
    }

    // 서명 저장
    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0] || "";
    const ua = req.headers.get("user-agent") || "";

    const { error: sErr } = await supabaseAdmin.from("signatures").insert({
      contract_id: contractId,
      signer_name,
      signer_email,
      ip,
      user_agent: ua,
    });

    if (sErr) {
      return NextResponse.json({ ok: false, error: "sign_insert_failed" }, { status: 500 });
    }

    // 상태 signed 업데이트
    await supabaseAdmin.from("contracts").update({ status: "signed" }).eq("id", contractId);

    // 이메일 알림(선택)
    if (resendKey && mailTo && mailFrom) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: mailFrom,
        to: mailTo,
        subject: `계약서 서명 완료: ${signer_name}`,
        html: `
          <h2>서명 완료 알림</h2>
          <p><b>${signer_name}</b> (${signer_email}) 님이 계약서에 서명했습니다.</p>
          <p>계약 ID: ${contractId}</p>
        `,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "sign_exception" }, { status: 500 });
  }
}
