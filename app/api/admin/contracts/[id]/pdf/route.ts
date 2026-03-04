export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateContractPdf } from "@/lib/contract-pdf";

type Params = { params: { id: string } };

function checkAdmin(req: Request) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

/** GET /api/admin/contracts/[id]/pdf — PDF 계약서 다운로드 */
export async function GET(req: Request, { params }: Params) {
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
        name: client?.name ?? sig?.signer_name ?? "고객",
        email: client?.email ?? sig?.signer_email ?? "",
        phone: client?.phone,
        address: client?.address,
      },
      signerName: sig?.signer_name ?? client?.name ?? "고객",
      signerEmail: sig?.signer_email ?? client?.email ?? "",
      signatureImage: sig?.signature_image,
      signedAt: sig?.signed_at ?? contract.created_at,
      createdAt: contract.created_at,
    });

    const filename = `CONTEX_계약서_${(sig?.signed_at ?? contract.created_at).slice(0, 10)}.pdf`;

    return new Response(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
