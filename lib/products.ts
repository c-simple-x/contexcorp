// 상품·금액 카탈로그 (메인 금액표, 견적 계산기, 계약 신청, 서버 금액 계산이 공통으로 사용)
// 실제 값은 Supabase products / product_groups 테이블에서 관리하고, 아래 DEFAULT_CATALOG는 DB 장애 시 대체값.

export type ProductCategory = "location" | "design" | "banner_3d";

export type Product = {
  key: string;
  category: ProductCategory;
  label: string;
  price: number;
  unit: string; // 금액 뒤 표시 단위 ("년", "일", "회", 없으면 "")
  description: string;
  badge: string;
  note: string; // 금액 아래 보조 문구 (예: "3% 할인 적용")
  features: string[];
  sort_order: number;
  active: boolean;
};

export type ProductGroup = {
  key: ProductCategory;
  title: string;
  subtitle: string;
  sort_order: number;
};

export type Catalog = { products: Product[]; groups: ProductGroup[] };

export type LocationType = "none" | "annual" | "daily";

export type QuoteItem = { key: string; label: string; price: number; original_price: number };

export const CATEGORIES: ProductCategory[] = ["location", "design", "banner_3d"];
export const CONTENT_CATEGORIES: ProductCategory[] = ["design", "banner_3d"];

// 위치 사용권은 계산 방식이 고정(연간 정액 / 일 단위)이라 키가 고정되고 추가·삭제 불가
export const LOCATION_ANNUAL_KEY = "location";
export const LOCATION_DAILY_KEY = "location_daily";
export const LOCATION_KEYS = [LOCATION_ANNUAL_KEY, LOCATION_DAILY_KEY];

export const MAX_LOCATION_DAYS = 365;

export const DEFAULT_CATALOG: Catalog = {
  groups: [
    { key: "location", title: "위치 사용권", subtitle: "", sort_order: 0 },
    { key: "design", title: "기본 배너", subtitle: "", sort_order: 1 },
    { key: "banner_3d", title: "3D 모션 배너", subtitle: "제작 기준: 초당 ₩110,000 (부가세 별도)", sort_order: 2 },
  ],
  products: [
    {
      key: LOCATION_ANNUAL_KEY, category: "location", label: "일반 GPS 위치 사용권", price: 100000, unit: "년",
      description: "원하는 GPS 좌표에 연간 독점 AR 노출권을 확보합니다.",
      badge: "연간", note: "", features: ["좌표 독점 운영권", "GPS 오차 ±2m"], sort_order: 0, active: true,
    },
    {
      key: LOCATION_DAILY_KEY, category: "location", label: "대중집합공간 위치 사용권", price: 100000, unit: "일",
      description: "CONTEX가 보유한 대중집합공간에 AR 광고를 집행합니다. 원하는 일수만큼 유연하게 운영하세요.",
      badge: "일 단위", note: "", features: ["유동 인구 밀집 공간", "일 단위 자유로운 기간 설정", "콘텐츠 별도 선택 가능"],
      sort_order: 1, active: true,
    },
    {
      key: "design_create", category: "design", label: "배너 디자인 제작", price: 150000, unit: "회",
      description: "브랜드 가이드에 맞는 AR 배너를 기획·디자인·최적화까지 맞춤 제작합니다. 파일 교체 비용 포함.",
      badge: "", note: "", features: [], sort_order: 0, active: true,
    },
    {
      key: "design_change", category: "design", label: "배너 파일 교체", price: 20000, unit: "회",
      description: "완성된 배너 파일을 직접 전달 시 서버 등록 및 교체. 별도 디자인 작업 없이 빠르게 업데이트.",
      badge: "", note: "", features: [], sort_order: 1, active: true,
    },
    {
      key: "banner_3d_replace", category: "banner_3d", label: "3D 모션 배너 파일 교체", price: 60000, unit: "회",
      description: "완성된 3D 소재 파일을 전달하면 서버에 등록 후 기존 배너와 교체합니다.",
      badge: "", note: "", features: [], sort_order: 0, active: true,
    },
    {
      key: "banner_3d_5s", category: "banner_3d", label: "3D 모션 배너 제작 (5초)", price: 550000, unit: "",
      description: "자연스러운 모션과 루프가 가능한 기본 길이입니다.",
      badge: "기본", note: "", features: [], sort_order: 1, active: true,
    },
    {
      key: "banner_3d_10s", category: "banner_3d", label: "3D 모션 배너 제작 (10초)", price: 1067000, unit: "",
      description: "풍부한 연출과 스토리텔링이 가능한 가장 많이 선택하는 길이입니다.",
      badge: "Best", note: "3% 할인 적용", features: [], sort_order: 2, active: true,
    },
    {
      key: "banner_3d_15s", category: "banner_3d", label: "3D 모션 배너 제작 (15초)", price: 1567500, unit: "",
      description: "긴 스토리와 다양한 씬 전환이 가능한 프리미엄 모션 배너입니다.",
      badge: "", note: "5% 할인 적용", features: [], sort_order: 3, active: true,
    },
  ],
};

export function fmtWon(n: number) {
  return "₩" + n.toLocaleString("ko-KR");
}

/** 설명의 첫 문장만 (좁은 공간용) */
export function firstSentence(text: string) {
  const i = text.search(/[.!?](\s|$)/);
  return i >= 0 ? text.slice(0, i + 1) : text;
}

/** 배지 색상: Best는 파랑, 일 단위는 주황, 나머지는 회색 */
export function badgeClass(badge: string) {
  if (/best/i.test(badge)) return "bg-blue-100 text-blue-700 border-blue-200";
  if (badge.includes("일 단위")) return "bg-orange-50 text-orange-700 border-orange-200";
  return "bg-slate-50 text-slate-500 border-slate-300";
}

export function activeProducts(catalog: Catalog, category: ProductCategory) {
  return catalog.products
    .filter((p) => p.category === category && p.active)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function findProduct(catalog: Catalog, key: string) {
  return catalog.products.find((p) => p.key === key && p.active);
}

export function findGroup(catalog: Catalog, key: ProductCategory) {
  return catalog.groups.find((g) => g.key === key) ?? DEFAULT_CATALOG.groups.find((g) => g.key === key)!;
}

export function clampDays(days: unknown) {
  return Math.max(1, Math.min(MAX_LOCATION_DAYS, Math.floor(Number(days)) || 1));
}

function applyPercent(price: number, percent: number) {
  return percent > 0 ? Math.round(price * (100 - percent) / 100) : price;
}

/** 견적 항목 계산 — 화면과 서버가 같은 함수를 사용해 금액이 어긋나지 않도록 함
 *  위치 할인: 위치 항목에만, 프로모션 할인: 전체 항목에 적용
 *  콘텐츠는 카테고리당 하나만 선택 가능 (앞에 온 것 우선)
 */
export function buildQuote(catalog: Catalog, opts: {
  locationType: LocationType;
  locationDays?: number;
  selectedKeys: string[];
  discountPercent?: number;
  promoPercent?: number;
}): QuoteItem[] {
  const discount = Math.max(0, Math.min(50, Number(opts.discountPercent) || 0));
  const promo = Math.max(0, Math.min(50, Number(opts.promoPercent) || 0));
  const items: QuoteItem[] = [];

  if (opts.locationType === "annual") {
    const p = findProduct(catalog, LOCATION_ANNUAL_KEY);
    if (p) {
      items.push({ key: p.key, label: `${p.label} (연간)`, original_price: p.price, price: applyPercent(applyPercent(p.price, discount), promo) });
    }
  } else if (opts.locationType === "daily") {
    const p = findProduct(catalog, LOCATION_DAILY_KEY);
    if (p) {
      const days = clampDays(opts.locationDays);
      const base = p.price * days;
      items.push({ key: p.key, label: `${p.label} (${days}일)`, original_price: base, price: applyPercent(applyPercent(base, discount), promo) });
    }
  }

  const usedCategories = new Set<ProductCategory>();
  for (const key of opts.selectedKeys) {
    const p = findProduct(catalog, key);
    if (!p || p.category === "location" || usedCategories.has(p.category)) continue;
    usedCategories.add(p.category);
    items.push({ key: p.key, label: p.label, original_price: p.price, price: applyPercent(p.price, promo) });
  }

  return items;
}

/** DB 행을 안전한 Product 형태로 정리 */
export function normalizeProduct(row: any): Product {
  return {
    key: String(row.key),
    category: CATEGORIES.includes(row.category) ? row.category : "design",
    label: String(row.label ?? ""),
    price: Math.max(0, Math.round(Number(row.price) || 0)),
    unit: String(row.unit ?? ""),
    description: String(row.description ?? ""),
    badge: String(row.badge ?? ""),
    note: String(row.note ?? ""),
    features: Array.isArray(row.features) ? row.features.map(String) : [],
    sort_order: Number(row.sort_order) || 0,
    active: row.active !== false,
  };
}

export function normalizeGroup(row: any): ProductGroup {
  return {
    key: CATEGORIES.includes(row.key) ? row.key : "design",
    title: String(row.title ?? ""),
    subtitle: String(row.subtitle ?? ""),
    sort_order: Number(row.sort_order) || 0,
  };
}
