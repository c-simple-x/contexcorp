export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Params = { params: { id: string } };

function checkAuth(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  return !secret || req.headers.get("x-admin-secret") === secret;
}

/** PATCH /api/admin/contracts/[id] — 입금 확인 토글 */
export async function PATCH(req: Request, { params }: Params) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const { payment_confirmed } = await req.json();
    const { error } = await supabaseAdmin
      .from("contracts")
      .update({ payment_confirmed })
      .eq("id", params.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
