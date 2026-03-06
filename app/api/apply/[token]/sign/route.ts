export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateContractPdf } from "@/lib/contract-pdf";
import { escapeHtml } from "@/lib/sanitize";

type Params = { params: { token: string } };

async function sendEmailWithPdf(opts: {
  to: string;
  subject: string;
  html: string;
  pdfBuffer: Buffer;
  pdfFilename: string;
}): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  // Resend requires a verified domain as sender.
  // Set RESEND_FROM_EMAIL in env to e.g. "CONTEX Corp. <hello@contexcorp.com>"
  const from = process.env.RESEND_FROM_EMAIL || process.env.ALERT_EMAIL_FROM;
  if (!key || !from) return { ok: false, error: "resend_env_missing" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        html: opts.html,
        attachments: [{ filename: opts.pdfFilename, content: opts.pdfBuffer.toString("base64") }],
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[sign] Resend error:", JSON.stringify(json));
      return { ok: false, error: json?.message || `resend_${res.status}` };
    }
    return { ok: true };
  } catch (e: any) {
    console.error("[sign] sendEmail exception:", e?.message);
    return { ok: false, error: e?.message };
  }
}

/** POST /api/apply/[token]/sign */
export async function POST(req: Request, { params }: Params) {
  try {
    const { token } = params;
    const { contract_id, signer_name, signer_email, signature_image } = await req.json();

    if (!contract_id || !signer_name || !signer_email) {
      return NextResponse.json({ ok: false, error: "missing_required" }, { status: 400 });
    }

    // 1) 토큰 확인
    const { data: tokenRow, error: tErr } = await supabaseAdmin
      .from("contract_tokens")
      .select("id,used_at,contract_id")
      .eq("token", token)
      .single();

    if (tErr || !tokenRow) return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 404 });
    if (tokenRow.used_at) return NextResponse.json({ ok: false, error: "already_used" }, { status: 410 });

    // 2) 계약 + 고객 정보 조회
    const { data: contract, error: cErr } = await supabaseAdmin
      .from("contracts")
      .select("id,title,terms,price,selected_items,client_id,created_at,discount_percent,promo_percent")
      .eq("id", contract_id)
      .single();

    if (cErr || !contract) return NextResponse.json({ ok: false, error: "contract_not_found" }, { status: 404 });

    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("client_type,company,name,email,phone,address")
      .eq("id", contract.client_id)
      .single();

    // 3) 서명 저장
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0] || undefined;
    const ua = req.headers.get("user-agent") ?? undefined;
    const signedAt = new Date().toISOString();

    await supabaseAdmin.from("signatures").insert([{
      contract_id,
      signer_name,
      signer_email,
      signature_image: signature_image || null,
      signed_at: signedAt,
      ip,
      user_agent: ua,
    }]);

    // 4) 계약 상태 갱신 + 토큰 소모
    await supabaseAdmin.from("contracts").update({ status: "signed" }).eq("id", contract_id);
    await supabaseAdmin.from("contract_tokens").update({ used_at: signedAt }).eq("id", tokenRow.id);

    // 5) PDF 생성 (실패해도 계약은 완료 처리)
    let pdfBuffer: Buffer | null = null;
    let pdfError: string | undefined;
    try {
      const selectedItems: { label: string; price: number; original_price?: number }[] = Array.isArray(contract.selected_items)
        ? contract.selected_items
        : [];
      pdfBuffer = await generateContractPdf({
        contractId: contract_id,
        title: contract.title,
        terms: contract.terms,
        price: contract.price,
        discountPercent: contract.discount_percent ?? 0,
        promoPercent: contract.promo_percent ?? 0,
        selectedItems,
        client: {
          client_type: client?.client_type ?? "business",
          company: client?.company,
          name: client?.name ?? signer_name,
          email: client?.email ?? signer_email,
          phone: client?.phone,
          address: client?.address,
        },
        signerName: signer_name,
        signerEmail: signer_email,
        signatureImage: signature_image,
        signedAt,
        createdAt: contract.created_at,
      });
    } catch (e: any) {
      pdfError = e?.message;
      console.error("[sign] PDF generation failed:", e?.message);
    }

    const filename = `CONTEX_계약서_${new Date(signedAt).toISOString().slice(0, 10)}.pdf`;

    let emailResult: { ok: boolean; error?: string } = { ok: false, error: "pdf_not_generated" };

    if (pdfBuffer) {
      // 6) 고객 이메일
      emailResult = await sendEmailWithPdf({
        to: signer_email,
        subject: "[CONTEX Corp.] 계약 완료 및 입금 안내",
        html: `
          <h2>계약이 완료되었습니다.</h2>
          <p>안녕하세요, <b>${escapeHtml(signer_name)}</b> 님.</p>
          <p>CONTEX Corp.와의 계약이 정상적으로 체결되었습니다.</p>
          <p>첨부된 PDF 계약서를 보관해 주세요.</p>
          <hr/>
          <h3>입금 안내</h3>
          <p><b>금액:</b> ₩${contract.price.toLocaleString("ko-KR")} (부가세 별도)</p>
          <p>입금 안내는 담당자가 별도로 연락드립니다.</p>
          <p>📞 +82-10-3653-1987 | ✉️ contact@contexcorp.com</p>
        `,
        pdfBuffer,
        pdfFilename: filename,
      });

      // 7) 관리자 알림
      const adminTo = process.env.ALERT_EMAIL_TO;
      if (adminTo) {
        await sendEmailWithPdf({
          to: adminTo,
          subject: `[CONTEX] 계약 서명 완료: ${signer_name}`,
          html: `
            <h2>서명 완료 알림</h2>
            <p><b>${escapeHtml(signer_name)}</b> (${escapeHtml(signer_email)}) 님이 서명했습니다.</p>
            <p>계약 ID: ${contract_id}</p>
            <p>금액: ₩${contract.price.toLocaleString("ko-KR")}</p>
          `,
          pdfBuffer,
          pdfFilename: filename,
        });
      }
    }

    // 계약 자체는 성공. 이메일 상태는 별도 반환
    return NextResponse.json({
      ok: true,
      pdf_ok: !!pdfBuffer,
      email_ok: emailResult.ok,
      ...(pdfError ? { pdf_error: pdfError } : {}),
      ...(emailResult.error ? { email_error: emailResult.error } : {}),
    });
  } catch (e: any) {
    console.error("[sign] route_exception:", e?.message);
    return NextResponse.json({ ok: false, error: "route_exception", detail: e?.message }, { status: 500 });
  }
}
