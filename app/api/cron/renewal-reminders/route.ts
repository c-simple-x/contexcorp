export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/** GET /api/cron/renewal-reminders
 *  Vercel Cron 또는 수동 호출 (매일 오전 9시 KST)
 *  만료 30일 전 고객에게 갱신 안내 이메일 발송
 */
export async function GET(req: Request) {
  // Vercel Cron 또는 CRON_SECRET 검증
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || process.env.ALERT_EMAIL_FROM;
  if (!key || !from) {
    return NextResponse.json({ ok: false, error: "resend_env_missing" }, { status: 500 });
  }

  const now = new Date();
  const target = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const targetDate = target.toISOString().slice(0, 10);

  // 만료일이 정확히 30일 후인 연간 GPS 계약 조회
  const { data: contracts } = await supabaseAdmin
    .from("contracts")
    .select("id, title, price, client_id, expires_at")
    .eq("status", "signed")
    .eq("payment_confirmed", true)
    .gte("expires_at", `${targetDate}T00:00:00.000Z`)
    .lte("expires_at", `${targetDate}T23:59:59.999Z`);

  if (!contracts || contracts.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;
  for (const contract of contracts) {
    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("name, email, company")
      .eq("id", contract.client_id)
      .single();
    if (!client?.email) continue;

    const toName = client.company ? `${client.company} ${client.name}` : client.name;
    const expDate = new Date(contract.expires_at).toLocaleDateString("ko-KR");

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [client.email],
        subject: "[CONTEX Corp.] AR 위치 사용권 만료 30일 전 안내",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
            <div style="background:#1e293b;color:#fff;padding:24px;border-radius:8px 8px 0 0">
              <p style="margin:0;font-size:12px;color:#94a3b8">CONTEX Corp. · 계약 갱신 안내</p>
              <h2 style="margin:8px 0 0;font-size:20px">위치 사용권 만료 예정</h2>
            </div>
            <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
              <p>안녕하세요, <strong>${toName}</strong> 님.</p>
              <p>보유하신 AR 위치 사용권이 <strong>${expDate}</strong>에 만료 예정입니다.</p>
              <p>갱신하시면 기존 AR 배너 위치를 계속 유지하실 수 있습니다.</p>
              <p style="font-size:13px;color:#64748b">갱신 문의: hello@contexcorp.com · +82-10-3653-1987</p>
            </div>
          </div>
        `,
      }),
    }).catch(() => {});

    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
