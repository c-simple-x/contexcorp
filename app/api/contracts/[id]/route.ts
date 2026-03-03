// app/api/contracts/[id]/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  try {
    const id = params.id;

    const { data: contract, error } = await supabaseAdmin
      .from("contracts")
      .select("id,title,terms,price,status,payment_confirmed,selected_items,created_at,client_id")
      .eq("id", id)
      .single();
    if (error) throw error;

    const { data: client, error: cErr } = await supabaseAdmin
      .from("clients")
      .select("id,company,name,email,phone,address")
      .eq("id", contract.client_id)
      .single();
    if (cErr) throw cErr;

    const { data: signature } = await supabaseAdmin
      .from("signatures")
      .select("signer_name,signer_email,signature_image,created_at")
      .eq("contract_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({ ok: true, contract: { ...contract, client, signature } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? "not found" }, { status: 404 });
  }
}
