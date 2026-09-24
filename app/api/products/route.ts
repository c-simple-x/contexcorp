export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/products-server";

/** GET /api/products — 노출 중인 상품·금액 목록 (계약 신청 화면용) */
export async function GET() {
  const catalog = await getCatalog();
  return NextResponse.json({
    ok: true,
    catalog: { groups: catalog.groups, products: catalog.products.filter((p) => p.active) },
  });
}
