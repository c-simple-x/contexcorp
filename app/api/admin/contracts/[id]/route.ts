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
    if (body.memo !== undefined) update.memo = body.memo;
    if (body.price !== undefined) update.price = Number(body.price);

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ ok: false, error: "no fields to update" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("contracts")
      .update(update)
      .eq("id", params.id);

    if (error) throw error;

    // 입금 확인 시 → 고객에게 자동 이메일 발송
    if (body.payment_confirmed === true) {
      await sendPaymentConfirmedEmail(params.id).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message }, { status: 500 });
  }
}

async function sendPaymentConfirmedEmail(contractId: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || process.env.ALERT_EMAIL_FROM;
  if (!key || !from) return;

  const { data: contract } = await supabaseAdmin
    .from("contracts")
    .select("title, price, selected_items, client_id")
    .eq("id", contractId)
    .single();
  if (!contract) return;

  const { data: client } = await supabaseAdmin
    .from("clients")
    .select("name, email, company")
    .eq("id", contract.client_id)
    .single();
  if (!client?.email) return;

  const toName = client.company ? `${client.company} ${client.name}` : client.name;
  const basePrice = contract.price ?? 0;
  const vat = Math.round(basePrice * 0.1);
  const totalWithVat = basePrice + vat;
  const fmt = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

  const items: { label: string; price: number }[] = Array.isArray(contract.selected_items)
    ? contract.selected_items : [];
  const itemsHtml = items.map(
    (i) => `<tr><td style="padding:4px 0;font-size:14px">${i.label}</td><td style="padding:4px 0;text-align:right;font-size:14px">₩${fmt(i.price)}</td></tr>`
  ).join("");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [client.email],
      subject: "[CONTEX Corp.] 입금이 확인되었습니다 — 작업을 시작합니다",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#1e293b;color:#fff;padding:24px;border-radius:8px 8px 0 0">
            <p style="margin:0;font-size:12px;color:#94a3b8;letter-spacing:0.1em">CONTEX Corp. · 전자계약</p>
            <h2 style="margin:8px 0 0;font-size:20px">입금 확인 완료</h2>
          </div>
          <div style="background:#fff;border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px">
            <p>안녕하세요, <strong>${toName}</strong> 님.</p>
            <p><strong>${contract.title}</strong>의 입금이 확인되어 <strong>작업을 시작</strong>합니다.</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              ${itemsHtml}
              <tr style="border-top:1px solid #e2e8f0">
                <td style="padding:8px 0;color:#64748b;font-size:13px">공급가액 (VAT 별도)</td>
                <td style="padding:8px 0;text-align:right;color:#64748b;font-size:13px">₩${fmt(basePrice)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#64748b;font-size:13px">부가세 (10%)</td>
                <td style="padding:4px 0;text-align:right;color:#64748b;font-size:13px">₩${fmt(vat)}</td>
              </tr>
              <tr style="border-top:2px solid #1e293b">
                <td style="padding:8px 0;font-weight:bold">총 입금액 (VAT 포함)</td>
                <td style="padding:8px 0;text-align:right;font-weight:bold;color:#1d4ed8;font-size:16px">₩${fmt(totalWithVat)}</td>
              </tr>
            </table>
            <p style="font-size:13px;color:#64748b">진행 상황은 순차적으로 이메일로 안내드리겠습니다.<br>문의 사항이 있으시면 언제든지 연락해 주세요.</p>
            <p style="font-size:13px;color:#94a3b8;margin-top:16px">contact@contexcorp.com · +82-10-3653-1987</p>
          </div>
        </div>
      `,
    }),
  });
}
