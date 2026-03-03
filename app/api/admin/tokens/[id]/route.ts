export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Params = { params: { id: string } };

function checkAdmin(req: Request) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

/** PATCH /api/admin/tokens/[id] — 만료 시간 1시간 연장 */
export async function PATCH(req: Request, { params }: Params) {
  if (!checkAdmin(req))
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const { data } = await supabaseAdmin
    .from("contract_tokens")
    .select("used_at, expires_at")
    .eq("id", params.id)
    .single();

  if (data?.used_at)
    return NextResponse.json({ ok: false, error: "already_used" }, { status: 409 });

  // 현재 만료 시각 또는 지금 중 더 늦은 시간 기준으로 1시간 연장
  const base = data?.expires_at
    ? Math.max(new Date(data.expires_at).getTime(), Date.now())
    : Date.now();
  const expires_at = new Date(base + 60 * 60 * 1000).toISOString();

  const { error } = await supabaseAdmin
    .from("contract_tokens")
    .update({ expires_at })
    .eq("id", params.id);

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, expires_at });
}

/** DELETE /api/admin/tokens/[id] — 미사용 토큰 강제 폐기 */
export async function DELETE(req: Request, { params }: Params) {
  if (!checkAdmin(req))
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  // 사용된 토큰은 삭제 불가 (계약과 연결됨)
  const { data } = await supabaseAdmin
    .from("contract_tokens")
    .select("used_at")
    .eq("id", params.id)
    .single();

  if (data?.used_at)
    return NextResponse.json({ ok: false, error: "already_used" }, { status: 409 });

  const { error } = await supabaseAdmin
    .from("contract_tokens")
    .delete()
    .eq("id", params.id);

  if (error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
