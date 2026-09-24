export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/** GET /api/cron/keep-alive
 *  Supabase 무료 플랜 자동 일시정지 방지용 (Vercel Cron + GitHub Actions에서 매일 호출)
 *  조회 실패 시 관리자에게 경고 메일 발송
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("contract_tokens")
    .select("id", { count: "exact", head: true });

  if (!error) return NextResponse.json({ ok: true, at: new Date().toISOString() });

  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || process.env.ALERT_EMAIL_FROM;
  const to = process.env.ALERT_EMAIL_TO;
  if (key && from && to) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "[경고] Supabase 연결 실패 — 일시정지 여부 확인 필요",
        html: `
          <p>keep-alive 점검에서 Supabase 조회가 실패했습니다.</p>
          <p><b>오류:</b> ${error.message}</p>
          <p>Supabase 대시보드에서 프로젝트가 일시정지(Paused) 상태인지 확인하고, 그렇다면 Restore 해주세요.</p>
          <p><a href="https://supabase.com/dashboard/projects">https://supabase.com/dashboard/projects</a></p>
        `,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
}
