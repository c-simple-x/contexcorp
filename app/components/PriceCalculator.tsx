"use client";

import { useState } from "react";
import { CheckCircle2, Calculator } from "lucide-react";

const LOCATION_ANNUAL_PRICE = 100000;
const LOCATION_DAILY_PRICE = 100000;

const CONTENT_PRODUCTS = {
  design_change:     { label: "배너 파일 교체",             price: 20000,   group: "design" },
  design_create:     { label: "배너 디자인 제작",            price: 150000,  group: "design" },
  banner_3d_replace: { label: "3D 모션 배너 파일 교체",      price: 60000,   group: "banner_3d" },
  banner_3d_5s:      { label: "3D 모션 배너 제작 (5초)",    price: 550000,  group: "banner_3d" },
  banner_3d_10s:     { label: "3D 모션 배너 제작 (10초)",   price: 1067000, group: "banner_3d" },
  banner_3d_15s:     { label: "3D 모션 배너 제작 (15초)",   price: 1567500, group: "banner_3d" },
} as const;

type ContentKey = keyof typeof CONTENT_PRODUCTS;
type LocationType = "none" | "annual" | "daily";

const CONTENT_GROUPS = [
  { title: "기본 배너", keys: ["design_change", "design_create"] as ContentKey[], note: "중복 선택 불가", radio: true },
  { title: "3D 모션 배너", keys: ["banner_3d_replace", "banner_3d_5s", "banner_3d_10s", "banner_3d_15s"] as ContentKey[], note: "중복 선택 불가", radio: true },
];

function fmt(n: number) {
  return "₩" + n.toLocaleString("ko-KR");
}

export default function PriceCalculator() {
  const [locationType, setLocationType] = useState<LocationType>("none");
  const [locationDays, setLocationDays] = useState(1);
  const [selected, setSelected] = useState<Set<ContentKey>>(new Set());

  function toggle(key: ContentKey, isRadio: boolean, groupKeys: ContentKey[]) {
    const next = new Set(selected);
    if (next.has(key)) {
      next.delete(key);
    } else {
      if (isRadio) groupKeys.forEach((k) => next.delete(k));
      next.add(key);
    }
    setSelected(next);
  }

  const locationItem = locationType === "annual"
    ? { label: "일반 GPS 위치 사용권 (연간)", price: LOCATION_ANNUAL_PRICE }
    : locationType === "daily"
    ? { label: `대중집합공간 위치 사용권 (${locationDays}일)`, price: locationDays * LOCATION_DAILY_PRICE }
    : null;

  const contentItems = (Object.keys(CONTENT_PRODUCTS) as ContentKey[])
    .filter((k) => selected.has(k))
    .map((k) => ({ key: k, ...CONTENT_PRODUCTS[k] }));

  const allItems: { label: string; price: number }[] = [
    ...(locationItem ? [locationItem] : []),
    ...contentItems,
  ];
  const subtotal = allItems.reduce((s, i) => s + i.price, 0);
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + vat;

  function handleQuoteContact() {
    if (allItems.length === 0) return;
    const lines = allItems.map((i) => `- ${i.label}: ${fmt(i.price)}`).join("\n");
    const message = `[견적 계산기 문의]\n\n선택 항목:\n${lines}\n\n공급가액: ${fmt(subtotal)}\n부가세 (10%): ${fmt(vat)}\n총 입금액: ${fmt(total)}\n\n추가 문의 내용을 아래에 작성해 주세요.`;
    window.dispatchEvent(new CustomEvent("prefill-contact", { detail: { message } }));
    setTimeout(() => {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* 선택 패널 */}
      <div className="space-y-6">

        {/* 위치 사용권 */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-slate-700">위치 사용권</span>
            <span className="text-xs text-slate-400">(중복 선택 불가)</span>
          </div>
          <div className="space-y-2">
            <label
              className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition ${
                locationType === "none" ? "border-slate-300 bg-slate-50" : "border-slate-200 bg-white hover:border-blue-200"
              }`}
              onClick={() => setLocationType("none")}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                locationType === "none" ? "border-slate-400 bg-slate-400" : "border-slate-300"
              }`}>
                {locationType === "none" && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
              </div>
              <span className="flex-1 text-sm text-slate-500">선택 안 함 (변경/재구매만)</span>
            </label>

            <label
              className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition ${
                locationType === "annual" ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200"
              }`}
              onClick={() => setLocationType("annual")}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                locationType === "annual" ? "border-blue-500 bg-blue-500" : "border-slate-300"
              }`}>
                {locationType === "annual" && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
              </div>
              <div className="flex-1">
                <p className="text-sm">일반 GPS 위치 사용권</p>
                <p className="text-xs text-slate-400 mt-0.5">GPS 좌표 연간 독점 AR 노출권</p>
              </div>
              <span className="text-sm font-semibold tabular-nums text-slate-700 shrink-0">{fmt(LOCATION_ANNUAL_PRICE)}/년</span>
            </label>

            <label
              className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition ${
                locationType === "daily" ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-white hover:border-orange-200"
              }`}
              onClick={() => setLocationType("daily")}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition ${
                locationType === "daily" ? "border-orange-500 bg-orange-500" : "border-slate-300"
              }`}>
                {locationType === "daily" && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm">대중집합공간 위치 사용권</p>
                  <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 px-1.5 py-0.5 rounded-full">일 단위</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">CONTEX 보유 대중집합공간 AR 집행</p>
              </div>
              <span className="text-sm font-semibold tabular-nums text-slate-700 shrink-0">{fmt(LOCATION_DAILY_PRICE)}/일</span>
            </label>

            {locationType === "daily" && (
              <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">운영 일수</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={locationDays}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setLocationDays(Math.max(1, Math.min(365, Number(e.target.value))))}
                    className="input w-24 text-center"
                  />
                  <span className="text-sm text-slate-600">일 × {fmt(LOCATION_DAILY_PRICE)} =</span>
                  <span className="text-sm font-extrabold text-orange-700">{fmt(locationDays * LOCATION_DAILY_PRICE)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 콘텐츠 옵션 */}
        {CONTENT_GROUPS.map((g) => (
          <div key={g.title}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-slate-700">{g.title}</span>
              <span className="text-xs text-slate-400">({g.note})</span>
            </div>
            <div className="space-y-2">
              {g.keys.map((key) => {
                const prod = CONTENT_PRODUCTS[key];
                const isSelected = selected.has(key);
                const isBest = key === "banner_3d_10s";
                return (
                  <label
                    key={key}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition ${
                      isSelected ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                    onClick={() => toggle(key, g.radio, g.keys)}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                      isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300"
                    }`}>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <span className="flex-1 flex items-center gap-1.5 text-sm min-w-0">
                      {prod.label}
                      {key === "design_change" && (
                        <span
                          className="group/tip relative flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300 text-slate-400 text-[10px] font-bold inline-flex items-center justify-center cursor-help hover:bg-blue-50 hover:border-blue-300 hover:text-blue-500 transition">
                            ?
                          </span>
                          <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/tip:block w-52 rounded-xl bg-slate-800 text-white text-xs px-3.5 py-3 shadow-2xl z-20">
                            <span className="block font-semibold text-slate-200 mb-2">배너 파일 규격</span>
                            <span className="flex justify-between items-center">
                              <span className="text-slate-400">비율</span>
                              <span className="font-medium">1 : 1.5</span>
                            </span>
                            <span className="flex justify-between items-center mt-1">
                              <span className="text-slate-400">용량</span>
                              <span className="font-medium">50 KB 미만</span>
                            </span>
                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800" />
                          </span>
                        </span>
                      )}
                    </span>
                    {isBest && (
                      <span className="text-xs bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">Best</span>
                    )}
                    <span className="text-sm font-semibold tabular-nums text-slate-700">{fmt(prod.price)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 견적 결과 */}
      <div className="lg:sticky lg:top-24">
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="bg-slate-800 text-white px-5 py-4 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-slate-400" />
            <span className="font-semibold">예상 견적</span>
          </div>
          <div className="p-5">
            {allItems.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">원하는 항목을 선택하세요</p>
            ) : (
              <div className="space-y-2 mb-4">
                {allItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm gap-2">
                    <span className="text-slate-600 flex-1 min-w-0">{item.label}</span>
                    <span className="font-medium tabular-nums shrink-0">{fmt(item.price)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-3 space-y-1.5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>공급가액 (VAT 별도)</span>
                <span className="tabular-nums">{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>부가세 (10%)</span>
                <span className="tabular-nums">{fmt(vat)}</span>
              </div>
              <div className="flex justify-between font-extrabold border-t pt-2 mt-1">
                <span>총 입금액 (VAT 포함)</span>
                <span className="text-blue-700 text-lg tabular-nums">{fmt(total)}</span>
              </div>
            </div>

            <button
              onClick={handleQuoteContact}
              disabled={allItems.length === 0}
              className="btn w-full text-center mt-5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              이 견적으로 문의하기 →
            </button>
            <p className="text-xs text-slate-400 text-center mt-2">
              * 실제 견적은 상담 후 확정됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
