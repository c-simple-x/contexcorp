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
      .select("id,title,terms,price,status,created_at,client_id")
      .eq("id", id)
      .single();
    if (error) throw error;

    const { data: client, error: cErr } = await supabaseAdmin
      .from("clients")
      .select("id,company,name,email,phone")
      .eq("id", contract.client_id)
      .single();
    if (cErr) throw cErr;

    return NextResponse.json({ ok: true, contract: { ...contract, client } });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? "not found" }, { status: 404 });
  }
}
