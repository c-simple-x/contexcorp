"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Catalog, CONTENT_CATEGORIES, LOCATION_ANNUAL_KEY, LOCATION_DAILY_KEY, LOCATION_KEYS, MAX_LOCATION_DAYS,
  activeProducts, badgeClass, buildQuote, clampDays, findGroup, findProduct, firstSentence, fmtWon as fmt,
} from "@/lib/products";

export type SelectedProducts = {
  keys: string[];
  total: number;
  items: { key: string; label: string; price: number; originalPrice?: number }[];
  purchaseType: "new" | "renewal";
  locationType?: "annual" | "daily";
  locationDays?: number;
  discountPercent?: number;
  promoPercent?: number;
};

type PurchaseType = "new" | "renewal";
type LocationType = "annual" | "daily";

type Props = {
  catalog: Catalog;
  discountPercent?: number;
  promoPercent?: number;
  onNext: (products: SelectedProducts) => void;
  onBack: () => void;
};

export default function StepProducts({ catalog, discountPercent = 0, promoPercent = 0, onNext, onBack }: Props) {
  const annual = findProduct(catalog, LOCATION_ANNUAL_KEY);
  const daily = findProduct(catalog, LOCATION_DAILY_KEY);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("new");
  const [locationType, setLocationType] = useState<LocationType>(annual || !daily ? "annual" : "daily");
  const [locationDaysStr, setLocationDaysStr] = useState("1");
  const locationDays = clampDays(locationDaysStr);
  const [selected, setSelected] = useState<string[]>([]);

  // 카테고리당 하나만 선택 (같은 카테고리의 다른 항목은 해제)
  function toggle(key: string) {
    const category = findProduct(catalog, key)?.category;
    setSelected((prev) => prev.includes(key)
      ? prev.filter((k) => k !== key)
      : [...prev.filter((k) => findProduct(catalog, k)?.category !== category), key]);
  }

  // 위치 할인: 위치 항목에만, 프로모션 할인: 전체 항목에 (서버와 같은 buildQuote로 계산)
  function applyLocationDiscount(price: number) {
    return discountPercent > 0 ? Math.round(price * (100 - discountPercent) / 100) : price;
  }
  function applyPromo(price: number) {
    return promoPercent > 0 ? Math.round(price * (100 - promoPercent) / 100) : price;
  }
  const hasAnyDiscount = discountPercent > 0 || promoPercent > 0;

  const allItems = buildQuote(catalog, {
    locationType: purchaseType === "new" ? locationType : "none",
    locationDays,
    selectedKeys: selected,
    discountPercent,
    promoPercent,
  }).map((i) => ({ key: i.key, label: i.label, price: i.price, originalPrice: i.original_price }));
  const hasLocation = allItems.some((i) => LOCATION_KEYS.includes(i.key));
  const contentCount = allItems.length - (hasLocation ? 1 : 0);
  const total = allItems.reduce((s, i) => s + i.price, 0);
  const canSubmit = purchaseType === "renewal" ? contentCount > 0 : hasLocation;

  const contentGroups = CONTENT_CATEGORIES
    .map((c) => ({ ...findGroup(catalog, c), products: activeProducts(catalog, c) }))
    .filter((g) => g.products.length > 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext({
      keys: allItems.map((i) => i.key),
      total,
      items: allItems,
      purchaseType,
      locationType: purchaseType === "new" ? locationType : undefined,
      locationDays: purchaseType === "new" && locationType === "daily" ? locationDays : undefined,
      discountPercent,
      promoPercent,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">

      {/* 할인 배너 */}
      {hasAnyDiscount && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 space-y-1">
          {discountPercent > 0 && (
            <p className="text-red-600 font-bold text-sm">📍 위치 사용권 {discountPercent}% 할인 적용</p>
          )}
          {promoPercent > 0 && (
            <p className="text-purple-600 font-bold text-sm">🎉 프로모션 {promoPercent}% 할인 적용</p>
          )}
        </div>
      )}

      {/* 구매 유형 */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">구매 유형 <span className="text-red-500">*</span></h3>
        <div className="grid gap-2">
          {([
            { value: "new", title: "신규 구매", desc: "위치 사용권 + 콘텐츠 제작을 새로 시작하는 경우" },
            { value: "renewal", title: "변경 / 재구매", desc: "기존 위치 사용권 보유 중 — 디자인 변경·제작만 추가하는 경우" },
          ] as const).map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${
                purchaseType === opt.value ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => { setPurchaseType(opt.value); setSelected([]); }}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition ${
                purchaseType === opt.value ? "border-blue-500 bg-blue-500" : "border-slate-300"
              }`}>
                {purchaseType === opt.value && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
              </div>
              <div>
                <p className="text-sm font-medium">{opt.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 위치 유형 (신규 구매 시에만) */}
      {purchaseType === "new" && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">위치 유형 <span className="text-red-500">*</span></h3>
          <div className="grid gap-2">
            {annual && <label
              className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${
                locationType === "annual" ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => setLocationType("annual")}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition ${
                locationType === "annual" ? "border-blue-500 bg-blue-500" : "border-slate-300"
              }`}>
                {locationType === "annual" && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{annual.label}</span>
                  {annual.badge && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{annual.badge}</span>}
                </div>
                {annual.description && <p className="text-xs text-slate-500 mt-1">{firstSentence(annual.description)}</p>}
              </div>
              <span className="text-sm font-semibold tabular-nums shrink-0">
                {hasAnyDiscount ? (
                  <><span className="line-through text-slate-400 font-normal">{fmt(annual.price)}</span>{" "}<span className="text-red-600">{fmt(applyPromo(applyLocationDiscount(annual.price)))}</span></>
                ) : fmt(annual.price)}{annual.unit && `/${annual.unit}`}
              </span>
            </label>}

            {daily && <label
              className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition ${
                locationType === "daily" ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => setLocationType("daily")}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition ${
                locationType === "daily" ? "border-blue-500 bg-blue-500" : "border-slate-300"
              }`}>
                {locationType === "daily" && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{daily.label}</span>
                  {daily.badge && <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">{daily.badge}</span>}
                </div>
                {daily.description && <p className="text-xs text-slate-500 mt-1">{firstSentence(daily.description)}</p>}
              </div>
              <span className="text-sm font-semibold tabular-nums shrink-0">
                {hasAnyDiscount ? (
                  <><span className="line-through text-slate-400 font-normal">{fmt(daily.price)}</span>{" "}<span className="text-red-600">{fmt(applyPromo(applyLocationDiscount(daily.price)))}</span></>
                ) : fmt(daily.price)}{daily.unit && `/${daily.unit}`}
              </span>
            </label>}
            {!annual && !daily && (
              <p className="text-sm text-red-600">현재 신청 가능한 위치 사용권이 없습니다. 문의해 주세요.</p>
            )}
          </div>

          {daily && locationType === "daily" && (
            <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
              <label className="text-sm font-semibold text-slate-700 mb-2 block">운영 일수</label>
              <div className="flex items-center gap-3">
                <input
                  type="number" min={1} max={MAX_LOCATION_DAYS} value={locationDaysStr}
                  onChange={(e) => setLocationDaysStr(e.target.value)}
                  onBlur={() => setLocationDaysStr(String(locationDays))}
                  className="input w-24 text-center" required
                />
                <span className="text-sm text-slate-600">일 × {fmt(hasAnyDiscount ? applyPromo(applyLocationDiscount(daily.price)) : daily.price)} =</span>
                <span className="text-sm font-extrabold text-orange-700">{fmt(applyPromo(applyLocationDiscount(locationDays * daily.price)))}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 콘텐츠 옵션 */}
      {contentGroups.map((g) => (
        <div key={g.key}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-slate-700">{g.title}</h3>
            <span className="text-xs text-slate-400">(중복 선택 불가)</span>
          </div>
          <div className="grid gap-2">
            {g.products.map((prod) => {
              const key = prod.key;
              const isSelected = selected.includes(key);
              return (
                <label
                  key={key}
                  className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${
                    isSelected ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => toggle(key)}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                    isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300"
                  }`}>
                    {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{prod.label}</span>
                      {prod.badge && <span className={`text-xs border px-2 py-0.5 rounded-full ${badgeClass(prod.badge)}`}>{prod.badge}</span>}
                    </div>
                    {prod.note && <p className="text-xs text-blue-600 mt-0.5">{prod.note}</p>}
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {promoPercent > 0 ? (
                      <><span className="line-through text-slate-400 font-normal">{fmt(prod.price)}</span>{" "}<span className="text-purple-600">{fmt(applyPromo(prod.price))}</span></>
                    ) : fmt(prod.price)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* 합계 */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">합계</span>
          <div className="text-right">
            {hasAnyDiscount && (
              <span className="text-sm line-through text-slate-400 mr-2">{fmt(allItems.reduce((s, i) => s + i.originalPrice, 0))}</span>
            )}
            <span className="text-xl font-extrabold text-blue-700">{fmt(total)}</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-1">부가세 별도</p>
        {discountPercent > 0 && (
          <p className="text-xs text-red-600 font-medium mt-0.5">위치 할인 {discountPercent}% 적용</p>
        )}
        {promoPercent > 0 && (
          <p className="text-xs text-purple-600 font-medium mt-0.5">프로모션 {promoPercent}% 적용</p>
        )}
        {allItems.map((i) => (
          <div key={i.key} className="flex justify-between text-xs text-slate-600 mt-1">
            <span>· {i.label}</span>
            <span>
              {hasAnyDiscount && i.originalPrice !== i.price && (
                <span className="line-through text-slate-400 mr-1">{fmt(i.originalPrice)}</span>
              )}
              {fmt(i.price)}
            </span>
          </div>
        ))}
        {purchaseType === "renewal" && contentCount === 0 && (
          <p className="text-xs text-red-500 mt-2">콘텐츠 옵션을 하나 이상 선택해 주세요.</p>
        )}
      </div>

      <div className="flex gap-3">
        <button type="button" className="btn flex-1" onClick={onBack}>← 이전</button>
        <button type="submit" className="btn flex-1" disabled={!canSubmit}>다음 단계 →</button>
      </div>
    </form>
  );
}
