export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  CATEGORIES, CONTENT_CATEGORIES, DEFAULT_CATALOG, LOCATION_KEYS,
  Product, ProductGroup, normalizeGroup, normalizeProduct,
} from "@/lib/products";
import { CatalogTableMissingError, PRODUCTS_TAG, isMissingTable, loadCatalogFresh } from "@/lib/products-server";

function checkAdmin(req: Request) {
  const auth = req.headers.get("x-admin-secret");
  return auth === process.env.ADMIN_SECRET;
}

/** GET /api/admin/products — 전체 상품 (숨김 포함) */
export async function GET(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  try {
    const catalog = await loadCatalogFresh();
    return NextResponse.json({ ok: true, catalog });
  } catch (e: any) {
    if (e instanceof CatalogTableMissingError) {
      return NextResponse.json({ ok: true, catalog: DEFAULT_CATALOG, table_missing: true });
    }
    return NextResponse.json({ ok: false, error: e?.message || "load_failed" }, { status: 500 });
  }
}

function validate(products: Product[], groups: ProductGroup[]): string | null {
  const keys = new Set<string>();
  for (const p of products) {
    if (!/^[a-z0-9_]{1,40}$/.test(p.key)) return `상품 키 형식이 올바르지 않습니다: ${p.key}`;
    if (keys.has(p.key)) return `상품 키가 중복되었습니다: ${p.key}`;
    keys.add(p.key);
    if (!p.label.trim() || p.label.length > 60) return "상품명은 1~60자로 입력해 주세요.";
    if (!Number.isInteger(p.price) || p.price < 0 || p.price > 100_000_000) return `금액이 올바르지 않습니다: ${p.label}`;
    if (p.unit.length > 10 || p.badge.length > 20 || p.note.length > 40) return `단위/배지/보조 문구가 너무 깁니다: ${p.label}`;
    if (p.description.length > 300) return `설명은 300자 이내로 입력해 주세요: ${p.label}`;
    if (p.features.length > 6 || p.features.some((f) => f.length > 60)) return `특징은 6개, 각 60자 이내로 입력해 주세요: ${p.label}`;
    const isLocationKey = LOCATION_KEYS.includes(p.key);
    if (isLocationKey && p.category !== "location") return "위치 사용권의 분류는 바꿀 수 없습니다.";
    if (!isLocationKey && !CONTENT_CATEGORIES.includes(p.category)) return `분류가 올바르지 않습니다: ${p.label}`;
  }
  for (const k of LOCATION_KEYS) if (!keys.has(k)) return "위치 사용권은 삭제할 수 없습니다.";
  for (const g of groups) {
    if (!g.title.trim() || g.title.length > 30 || g.subtitle.length > 100) return "그룹 제목은 1~30자, 부제는 100자 이내로 입력해 주세요.";
  }
  return null;
}

/** PUT /api/admin/products — 전체 상품·그룹 저장 (목록에서 빠진 상품은 삭제) */
export async function PUT(req: Request) {
  if (!checkAdmin(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.products) || !Array.isArray(body.groups)) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const products = (body.products as any[]).map(normalizeProduct).map((p, i) => ({
    ...p,
    label: p.label.trim(),
    features: p.features.map((f) => f.trim()).filter(Boolean),
    sort_order: i,
  }));
  const groups = (body.groups as any[]).map(normalizeGroup).filter((g) => CATEGORIES.includes(g.key));

  const error = validate(products, groups);
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });

  // 분류별로 순서 재정렬
  for (const c of CATEGORIES) {
    products.filter((p) => p.category === c).forEach((p, i) => { p.sort_order = i; });
  }

  const now = new Date().toISOString();
  const { error: gErr } = await supabaseAdmin
    .from("product_groups")
    .upsert(groups.map((g) => ({ ...g, updated_at: now })), { onConflict: "key" });
  if (gErr) return NextResponse.json({ ok: false, error: gErr.message, table_missing: isMissingTable(gErr.message) }, { status: 500 });

  const { error: pErr } = await supabaseAdmin
    .from("products")
    .upsert(products.map((p) => ({ ...p, updated_at: now })), { onConflict: "key" });
  if (pErr) return NextResponse.json({ ok: false, error: pErr.message, table_missing: isMissingTable(pErr.message) }, { status: 500 });

  const keep = products.map((p) => p.key);
  const { error: dErr } = await supabaseAdmin
    .from("products")
    .delete()
    .not("key", "in", `(${keep.map((k) => `"${k}"`).join(",")})`);
  if (dErr) return NextResponse.json({ ok: false, error: dErr.message }, { status: 500 });

  revalidateTag(PRODUCTS_TAG);
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true, catalog: await loadCatalogFresh() });
}
