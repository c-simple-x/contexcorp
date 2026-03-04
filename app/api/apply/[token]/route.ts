export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Params = { params: { token: string } };

/** GET /api/apply/[token] — 토큰 유효성 확인 */
export async function GET(_req: Request, { params }: Params) {
  const { token } = params;

  const { data, error } = await supabaseAdmin
    .from("contract_tokens")
    .select("id,token,label,used_at,expires_at,discount_percent")
    .eq("token", token)
    .single();

  if (error || !data) {
    return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 404 });
  }

  if (data.used_at) {
    return NextResponse.json({ ok: false, error: "already_used" }, { status: 410 });
  }

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ ok: false, error: "expired" }, { status: 410 });
  }

  return NextResponse.json({ ok: true, label: data.label, discount_percent: data.discount_percent ?? 0 });
}
