export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateContractPdf } from "@/lib/contract-pdf";

type Params = { params: { token: string } };

async function sendEmailWithPdf(opts: {
  to: string;
  toName: string;
  subject: string;
  html: string;
  pdfBuffer: Buffer;
  pdfFilename: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ALERT_EMAIL_FROM;
  if (!key || !from) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      attachments: [
        {
          filename: opts.pdfFilename,
          content: opts.pdfBuffer.toString("base64"),
        },
      ],
    }),
  }).catch(() => {});
}

/** POST /api/apply/[token]/sign — 서명 저장 + PDF 생성 + 이메일 발송 */
export async function POST(req: Request, { params }: Params) {
  try {
    const { token } = params;
    const { contract_id, signer_name, signer_email, signature_image } = await req.json();

    if (!contract_id || !signer_name || !signer_email) {
      return NextResponse.json({ ok: false, error: "missing_required" }, { status: 400 });
    }

    // 1) 토큰 + 계약 확인
    const { data: tokenRow, error: tErr } = await supabaseAdmin
      .from("contract_tokens")
      .select("id,used_at,contract_id")
      .eq("token", token)
      .single();

    if (tErr || !tokenRow) return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 404 });
    if (tokenRow.used_at) return NextResponse.json({ ok: false, error: "already_used" }, { status: 410 });

    // 2) 계약 + 고객 정보 조회
    const { data: contract, error: cErr } = await supabaseAdmin
      .from("contracts")
      .select("id,title,terms,price,selected_items,client_id")
      .eq("id", contract_id)
      .single();

    if (cErr || !contract) return NextResponse.json({ ok: false, error: "contract_not_found" }, { status: 404 });

    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("client_type,company,name,email,phone,address")
      .eq("id", contract.client_id)
      .single();

    // 3) 서명 저장
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0] || undefined;
    const ua = req.headers.get("user-agent") ?? undefined;
    const signedAt = new Date().toISOString();

    await supabaseAdmin.from("signatures").insert([{
      contract_id,
      signer_name,
      signer_email,
      signature_image: signature_image || null,
      ip,
      user_agent: ua,
    }]);

    // 4) 계약 상태 갱신 + 토큰 소모
    await supabaseAdmin.from("contracts").update({ status: "signed" }).eq("id", contract_id);
    await supabaseAdmin.from("contract_tokens").update({ used_at: signedAt }).eq("id", tokenRow.id);

    // 5) PDF 생성
    const selectedItems: { label: string; price: number }[] = Array.isArray(contract.selected_items)
      ? contract.selected_items
      : [];

    const pdfBuffer = await generateContractPdf({
      contractId: contract_id,
      title: contract.title,
      terms: contract.terms,
      price: contract.price,
      selectedItems,
      client: {
        client_type: client?.client_type ?? "business",
        company: client?.company,
        name: client?.name ?? signer_name,
        email: client?.email ?? signer_email,
        phone: client?.phone,
        address: client?.address,
      },
      signerName: signer_name,
      signerEmail: signer_email,
      signatureImage: signature_image,
      signedAt,
    });

    const filename = `CONTEX_계약서_${new Date(signedAt).toISOString().slice(0, 10)}.pdf`;

    // 6) 고객에게 이메일 발송
    await sendEmailWithPdf({
      to: signer_email,
      toName: signer_name,
      subject: `[CONTEX Corp.] 계약 완료 및 입금 안내`,
      html: `
        <h2>계약이 완료되었습니다.</h2>
        <p>안녕하세요, <b>${signer_name}</b> 님.</p>
        <p>CONTEX Corp.와의 계약이 정상적으로 체결되었습니다.</p>
        <p>첨부된 PDF 계약서를 보관해 주세요.</p>
        <hr/>
        <h3>입금 안내</h3>
        <p><b>은행:</b> (담당자 확인 후 안내 예정)</p>
        <p><b>금액:</b> ₩${contract.price.toLocaleString("ko-KR")} (부가세 별도)</p>
        <p>입금 확인 후 작업을 시작하며, 문의사항은 아래로 연락주세요.</p>
        <p>📞 +82-10-3653-1987 | ✉️ contexcorp@gmail.com</p>
      `,
      pdfBuffer,
      pdfFilename: filename,
    });

    // 7) 관리자 알림
    const adminTo = process.env.ALERT_EMAIL_TO;
    if (adminTo) {
      await sendEmailWithPdf({
        to: adminTo,
        toName: "Admin",
        subject: `[CONTEX] 계약 서명 완료: ${signer_name}`,
        html: `
          <h2>서명 완료 알림</h2>
          <p><b>${signer_name}</b> (${signer_email}) 님이 서명했습니다.</p>
          <p>계약 ID: ${contract_id}</p>
          <p>금액: ₩${contract.price.toLocaleString("ko-KR")}</p>
        `,
        pdfBuffer,
        pdfFilename: filename,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "route_exception", detail: e?.message }, { status: 500 });
  }
}
