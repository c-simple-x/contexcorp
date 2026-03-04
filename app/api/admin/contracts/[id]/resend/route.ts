export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateContractPdf } from "@/lib/contract-pdf";

type Params = { params: { id: string } };

function checkAdmin(req: Request) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

/** POST /api/admin/contracts/[id]/resend — PDF 계약서 재발송 */
export async function POST(req: Request, { params }: Params) {
  if (!checkAdmin(req))
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  try {
    const { data: contract, error: cErr } = await supabaseAdmin
      .from("contracts")
      .select("id,title,terms,price,selected_items,client_id,created_at")
      .eq("id", params.id)
      .single();
    if (cErr || !contract)
      return NextResponse.json({ ok: false, error: "contract_not_found" }, { status: 404 });

    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("client_type,company,name,email,phone,address")
      .eq("id", contract.client_id)
      .single();

    const { data: sig } = await supabaseAdmin
      .from("signatures")
      .select("signer_name,signer_email,signature_image,signed_at")
      .eq("contract_id", params.id)
      .order("signed_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!client?.email && !sig?.signer_email)
      return NextResponse.json({ ok: false, error: "no_email" }, { status: 400 });

    const toEmail = client?.email ?? sig!.signer_email;
    const toName = client?.name ?? sig?.signer_name ?? "고객";
    const signedAt = sig?.signed_at ?? contract.created_at;

    const selectedItems: { label: string; price: number }[] =
      Array.isArray(contract.selected_items) ? contract.selected_items : [];

    const pdfBuffer = await generateContractPdf({
      contractId: contract.id,
      title: contract.title,
      terms: contract.terms,
      price: contract.price,
      selectedItems,
      client: {
        client_type: client?.client_type ?? "business",
        company: client?.company,
        name: toName,
        email: toEmail,
        phone: client?.phone,
        address: client?.address,
      },
      signerName: sig?.signer_name ?? toName,
      signerEmail: sig?.signer_email ?? toEmail,
      signatureImage: sig?.signature_image,
      signedAt,
      createdAt: contract.created_at,
    });

    const key = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL || process.env.ALERT_EMAIL_FROM;
    if (!key || !from)
      return NextResponse.json({ ok: false, error: "resend_env_missing" }, { status: 500 });

    const filename = `CONTEX_계약서_${signedAt.slice(0, 10)}.pdf`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [toEmail],
        subject: "[CONTEX Corp.] 계약서 재발송",
        html: `
          <h2>계약서를 재발송드립니다.</h2>
          <p>안녕하세요, <b>${toName}</b> 님.</p>
          <p>요청하신 CONTEX Corp. 계약서를 첨부 파일로 보내드립니다.</p>
          <p>문의: contact@contexcorp.com | +82-10-3653-1987</p>
        `,
        attachments: [{ filename, content: pdfBuffer.toString("base64") }],
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return NextResponse.json({ ok: false, error: json?.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, to: toEmail });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
