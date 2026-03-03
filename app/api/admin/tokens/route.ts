export const runtime = "nodejs";

import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

function checkAdmin(req: Request) {
  const auth = req.headers.get("x-admin-secret");
  return auth === process.env.ADMIN_SECRET;
}

/** GET /api/admin/tokens — 토큰 목록 */
export async function GET(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("contract_tokens")
    .select("id,token,label,used_at,expires_at,created_at,contract_id")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, tokens: data });
}

/** POST /api/admin/tokens — 토큰 생성 */
export async function POST(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const label = String(body.label || "").trim() || null;
  const token = crypto.randomUUID();

  const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1시간 후

  const { error } = await supabaseAdmin
    .from("contract_tokens")
    .insert([{ token, label, expires_at }]);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return NextResponse.json({ ok: true, token, url: `${base}/apply/${token}` });
}
