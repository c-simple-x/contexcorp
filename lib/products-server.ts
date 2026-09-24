import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Catalog, DEFAULT_CATALOG, normalizeGroup, normalizeProduct } from "@/lib/products";

export const PRODUCTS_TAG = "products";

/** products 테이블이 아직 생성되지 않은 경우 (마이그레이션 전) */
export class CatalogTableMissingError extends Error {}

export function isMissingTable(message?: string) {
  return !!message && /does not exist|schema cache|Could not find the table/i.test(message);
}

/** DB에서 카탈로그를 바로 조회 (캐시 없음). 조회 실패 시 throw */
export async function loadCatalogFresh(): Promise<Catalog> {
  const [p, g] = await Promise.all([
    supabaseAdmin.from("products").select("*").order("sort_order"),
    supabaseAdmin.from("product_groups").select("*").order("sort_order"),
  ]);
  const err = p.error || g.error;
  if (err) {
    if (isMissingTable(err.message)) throw new CatalogTableMissingError(err.message);
    throw new Error(err.message);
  }
  if (!p.data?.length) return DEFAULT_CATALOG;

  return {
    products: p.data.map(normalizeProduct),
    groups: g.data?.length ? g.data.map(normalizeGroup) : DEFAULT_CATALOG.groups,
  };
}

// 조회 실패 시 throw → 캐시에 저장되지 않고, 이전에 캐시된 값이 있으면 그 값이 계속 사용됨
const getCatalogCached = unstable_cache(loadCatalogFresh, ["catalog"], {
  tags: [PRODUCTS_TAG],
  revalidate: 60,
});

/** 계약 금액 계산용 — 캐시 없이 조회, 테이블이 없으면(마이그레이션 전) 기본값 */
export async function loadCatalogForPricing(): Promise<Catalog> {
  try {
    return await loadCatalogFresh();
  } catch (e) {
    if (e instanceof CatalogTableMissingError) return DEFAULT_CATALOG;
    throw e;
  }
}

/** 화면 표시용 카탈로그 (60초 캐시, 관리자 저장 시 즉시 갱신). DB 장애 시 기본값 */
export async function getCatalog(): Promise<Catalog> {
  try {
    return await getCatalogCached();
  } catch (e: any) {
    console.error("[products] catalog load failed, using defaults:", e?.message);
    return DEFAULT_CATALOG;
  }
}
