export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { decrypt } from "@/lib/encrypt";

type Params = { params: { id: string } };

function checkAdmin(req: Request) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

/** GET /api/admin/contracts/[id]/decrypt — 암호화된 개인정보 복호화 */
export async function GET(req: Request, { params }: Params) {
  if (!checkAdmin(req))
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const { data: contract } = await supabaseAdmin
    .from("contracts")
    .select("client_id")
    .eq("id", params.id)
    .single();
  if (!contract)
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("client_type, id_number_encrypted")
    .eq("id", contract.client_id)
    .single();
  if (!client)
    return NextResponse.json({ ok: false, error: "client_not_found" }, { status: 404 });

  let id_number: string | null = null;
  if (client.id_number_encrypted) {
    try {
      id_number = decrypt(client.id_number_encrypted);
    } catch {
      id_number = "(복호화 실패)";
    }
  }

  return NextResponse.json({
    ok: true,
    client_type: client.client_type,
    id_number,
  });
}
