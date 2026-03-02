export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { encrypt } from "@/lib/encrypt";
import { CONTRACT_TERMS } from "@/lib/contract-terms";

type Params = { params: { token: string } };

/** POST /api/apply/[token]/submit — 고객 정보 + 상품 저장 → contract 초안 생성 */
export async function POST(req: Request, { params }: Params) {
  try {
    const { token } = params;

    // 1) 토큰 확인
    const { data: tokenRow, error: tErr } = await supabaseAdmin
      .from("contract_tokens")
      .select("id,used_at,expires_at")
      .eq("token", token)
      .single();

    if (tErr || !tokenRow) return NextResponse.json({ ok: false, error: "invalid_token" }, { status: 404 });
    if (tokenRow.used_at) return NextResponse.json({ ok: false, error: "already_used" }, { status: 410 });
    if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
      return NextResponse.json({ ok: false, error: "expired" }, { status: 410 });
    }

    const body = await req.json();

    // 2) 필수 필드 검증
    const client_type: "individual" | "business" = body.client_type === "individual" ? "individual" : "business";
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();
    const company = String(body.company || "").trim();
    const id_number = String(body.id_number || "").trim();

    if (!name || !email) {
      return NextResponse.json({ ok: false, error: "missing_required" }, { status: 400 });
    }

    // 3) 주민번호/사업자번호 암호화
    const id_number_encrypted = id_number ? encrypt(id_number) : null;

    // 4) 상품 선택 파싱 및 금액 계산
    const PRICES: Record<string, number> = {
      location: 200000,
      design_change: 20000,
      design_create: 150000,
      banner_3d_replace: 60000,
      banner_3d_5s: 550000,
      banner_3d_10s: 1067000,
      banner_3d_15s: 1567500,
    };
    const LABELS: Record<string, string> = {
      location: "위치 사용권 (연간)",
      design_change: "디자인 단순 변경",
      design_create: "디자인 제작",
      banner_3d_replace: "3D 모션 배너 교체",
      banner_3d_5s: "3D 모션 배너 제작 (5초)",
      banner_3d_10s: "3D 모션 배너 제작 (10초)",
      banner_3d_15s: "3D 모션 배너 제작 (15초)",
    };

    const selectedKeys: string[] = Array.isArray(body.selected) ? body.selected : ["location"];
    if (!selectedKeys.includes("location")) selectedKeys.unshift("location");

    const selectedItems = selectedKeys
      .filter((k) => PRICES[k])
      .map((k) => ({ key: k, label: LABELS[k] || k, price: PRICES[k] }));

    const total = selectedItems.reduce((s, i) => s + i.price, 0);

    // 5) client 생성
    const { data: clientIns, error: cErr } = await supabaseAdmin
      .from("clients")
      .insert([{
        client_type,
        company: company || null,
        name,
        email,
        phone: phone || null,
        address: address || null,
        id_number_encrypted,
      }])
      .select("id")
      .single();

    if (cErr || !clientIns?.id) {
      return NextResponse.json({ ok: false, error: "client_insert_failed", detail: cErr?.message }, { status: 500 });
    }

    // 6) contract 생성
    const title = company
      ? `광고·콘텐츠·AR 운영 기본 계약 (${company})`
      : `광고·콘텐츠·AR 운영 기본 계약 (${name})`;

    const { data: contractIns, error: contractErr } = await supabaseAdmin
      .from("contracts")
      .insert([{
        client_id: clientIns.id,
        token_id: tokenRow.id,
        title,
        terms: CONTRACT_TERMS,
        price: total,
        status: "draft",
        selected_items: selectedItems,
      }])
      .select("id")
      .single();

    if (contractErr || !contractIns?.id) {
      return NextResponse.json({ ok: false, error: "contract_insert_failed", detail: contractErr?.message }, { status: 500 });
    }

    // 7) 토큰에 contract_id 연결
    await supabaseAdmin
      .from("contract_tokens")
      .update({ contract_id: contractIns.id })
      .eq("id", tokenRow.id);

    return NextResponse.json({
      ok: true,
      contract_id: contractIns.id,
      title,
      terms: CONTRACT_TERMS,
      price: total,
      selected_items: selectedItems,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "route_exception", detail: e?.message }, { status: 500 });
  }
}
