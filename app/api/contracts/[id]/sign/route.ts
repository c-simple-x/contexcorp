// app/api/contracts/[id]/sign/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/** 알림 메일(옵션) */
async function sendEmail(subject: string, html: string) {
  try {
    const key = process.env.RESEND_API_KEY;
    const to = process.env.ALERT_EMAIL_TO;
    const from = process.env.ALERT_EMAIL_FROM;
    if (!key || !to || !from) return;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    }).catch(() => {});
  } catch {}
}

type Params = { params: { id: string } };

export async function POST(req: Request, { params }: Params) {
  try {
    const contractId = params.id;
    const { signer_name, signer_email } = await req.json();

    if (!signer_name || !signer_email) {
      return NextResponse.json(
        { ok: false, error: "signer_name, signer_email required" },
        { status: 400 }
      );
    }

    // 계약 존재 확인
    const { data: contract, error: cErr } = await supabaseAdmin
      .from("contracts")
      .select("id,title")
      .eq("id", contractId)
      .single();
    if (cErr) throw cErr;

    // 서명 저장
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0] || undefined;
    const ua = req.headers.get("user-agent") ?? undefined;

    const { error: sErr } = await supabaseAdmin.from("signatures").insert([
      {
        contract_id: contractId,
        signer_name,
        signer_email,
        ip,
        user_agent: ua,
      },
    ]);
    if (sErr) throw sErr;

    // 상태 갱신: signed
    await supabaseAdmin.from("contracts").update({ status: "signed" }).eq("id", contractId);

    // 알림 메일
    await sendEmail(
      `계약서 서명 완료: ${signer_name}`,
      `
        <h2>서명 완료 알림</h2>
        <p><b>${signer_name}</b> (${signer_email}) 님이 계약서에 서명했습니다.</p>
        <p>계약 ID: ${contractId}</p>
        <p>제목: ${contract?.title ?? "-"}</p>
      `
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? "sign failed" }, { status: 500 });
  }
}
