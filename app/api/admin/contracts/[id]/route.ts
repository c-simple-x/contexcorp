export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Params = { params: { id: string } };

function checkAuth(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  return !secret || req.headers.get("x-admin-secret") === secret;
}

/** PATCH /api/admin/contracts/[id] — 입금 확인 토글 / 상태 변경 */
export async function PATCH(req: Request, { params }: Params) {
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const update: Record<string, unknown> = {};
    if (body.payment_confirmed !== undefined) update.payment_confirmed = body.payment_confirmed;
    if (body.status !== undefined) update.status = body.status;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ ok: false, error: "no fields to update" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("contracts")
      .update(update)
      .eq("id", params.id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}
