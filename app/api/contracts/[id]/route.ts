import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  const id = ctx.params?.id;
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  // 계약 + 클라이언트 조인해서 반환
  const { data: contract, error } = await supabaseAdmin
    .from("contracts")
    .select(
      `
      id, title, terms, price, status, created_at, client_id,
      client:clients(id, company, name, email, phone)
      `
    )
    .eq("id", id)
    .single();

  if (error || !contract) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, contract });
}
