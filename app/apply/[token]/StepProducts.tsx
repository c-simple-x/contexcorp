"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export type SelectedProducts = {
  keys: string[];
  total: number;
  items: { key: string; label: string; price: number }[];
  locationType: "annual" | "daily";
  locationDays?: number;
};

type LocationType = "annual" | "daily";

const LOCATION_DAILY_PRICE = 150000;

const CONTENT_PRODUCTS = {
  design_change: { label: "디자인 단순 변경", price: 20000, group: "design" },
  design_create: { label: "디자인 제작", price: 150000, group: "design" },
  banner_3d_replace: { label: "3D 모션 배너 교체", price: 60000, group: null },
  banner_3d_5s: { label: "3D 모션 배너 제작 (5초)", price: 550000, group: "banner_3d" },
  banner_3d_10s: { label: "3D 모션 배너 제작 (10초)", price: 1067000, group: "banner_3d" },
  banner_3d_15s: { label: "3D 모션 배너 제작 (15초)", price: 1567500, group: "banner_3d" },
} as const;

type ContentKey = keyof typeof CONTENT_PRODUCTS;

function fmt(n: number) {
  return "₩" + n.toLocaleString("ko-KR");
}

type Props = {
  onNext: (products: SelectedProducts) => void;
  onBack: () => void;
};

export default function StepProducts({ onNext, onBack }: Props) {
  const [locationType, setLocationType] = useState<LocationType>("annual");
  const [locationDays, setLocationDays] = useState(1);
  const [selected, setSelected] = useState<Set<ContentKey>>(new Set());

  function toggle(key: ContentKey) {
    const next = new Set(selected);
    const group = CONTENT_PRODUCTS[key].group;

    if (next.has(key)) {
      next.delete(key);
    } else {
      if (group) {
        (Object.keys(CONTENT_PRODUCTS) as ContentKey[]).forEach((k) => {
          if (CONTENT_PRODUCTS[k].group === group && k !== key) next.delete(k);
        });
      }
      next.add(key);
    }
    setSelected(next);
  }

  const locationItem = locationType === "annual"
    ? { key: "location", label: "위치 사용권 (연간)", price: 200000 }
    : { key: "location_daily", label: `대중집합공간 위치 사용권 (${locationDays}일)`, price: locationDays * LOCATION_DAILY_PRICE };

  const contentItems = (Object.keys(CONTENT_PRODUCTS) as ContentKey[])
    .filter((k) => selected.has(k))
    .map((k) => ({ key: k, label: CONTENT_PRODUCTS[k].label, price: CONTENT_PRODUCTS[k].price }));

  const allItems = [locationItem, ...contentItems];
  const total = allItems.reduce((s, i) => s + i.price, 0);

  const contentGroups = [
    {
      title: "기본 배너",
      keys: ["design_change", "design_create"] as ContentKey[],
      note: "중복 선택 불가",
    },
    {
      title: "3D 모션 배너",
      keys: ["banner_3d_replace", "banner_3d_5s", "banner_3d_10s", "banner_3d_15s"] as ContentKey[],
      note: "제작 옵션은 중복 선택 불가",
    },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const keys = [locationItem.key, ...Array.from(selected)];
    onNext({ keys, total, items: allItems, locationType, locationDays: locationType === "daily" ? locationDays : undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">

      {/* 위치 유형 선택 */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">위치 유형 선택 <span className="text-red-500">*</span></h3>
        <div className="grid gap-2">
          {/* Branch A */}
          <label
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
                <span className="text-sm font-medium">일반 GPS 위치 사용권</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">연간</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">원하는 GPS 좌표에 연간 독점 AR 노출권을 확보합니다.</p>
            </div>
            <span className="text-sm font-semibold tabular-nums shrink-0">{fmt(200000)}/년</span>
          </label>

          {/* Branch B */}
          <label
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
                <span className="text-sm font-medium">대중집합공간 위치 사용권</span>
                <span className="text-xs bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">일 단위</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">CONTEX가 보유한 대중집합공간에 AR 광고를 집행합니다. 콘텐츠는 별도 선택.</p>
            </div>
            <span className="text-sm font-semibold tabular-nums shrink-0">{fmt(LOCATION_DAILY_PRICE)}/일</span>
          </label>
        </div>

        {/* 일수 입력 (daily 선택 시) */}
        {locationType === "daily" && (
          <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <label className="text-sm font-semibold text-slate-700 mb-2 block">운영 일수</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={365}
                value={locationDays}
                onChange={(e) => setLocationDays(Math.max(1, Math.min(365, Number(e.target.value))))}
                className="input w-24 text-center"
                required
              />
              <span className="text-sm text-slate-600">일 × {fmt(LOCATION_DAILY_PRICE)} =</span>
              <span className="text-sm font-extrabold text-orange-700">{fmt(locationDays * LOCATION_DAILY_PRICE)}</span>
            </div>
          </div>
        )}
      </div>

      {/* 콘텐츠 옵션 (공통) */}
      {contentGroups.map((g) => (
        <div key={g.title}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-slate-700">{g.title}</h3>
            {g.note && <span className="text-xs text-slate-400">({g.note})</span>}
          </div>
          <div className="grid gap-2">
            {g.keys.map((key) => {
              const prod = CONTENT_PRODUCTS[key];
              const isSelected = selected.has(key);
              const isBest = key === "banner_3d_10s";
              const isDiscounted = key === "banner_3d_10s" || key === "banner_3d_15s";

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
                      {isBest && (
                        <span className="text-xs bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">Best</span>
                      )}
                    </div>
                    {isDiscounted && (
                      <p className="text-xs text-blue-600 mt-0.5">
                        {key === "banner_3d_10s" ? "3% 할인 적용" : "5% 할인 적용"}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{fmt(prod.price)}</span>
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
          <span className="text-xl font-extrabold text-blue-700">{fmt(total)}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">부가세 별도</p>
        {allItems.map((i) => (
          <div key={i.key} className="flex justify-between text-xs text-slate-600 mt-1">
            <span>· {i.label}</span>
            <span>{fmt(i.price)}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button type="button" className="btn flex-1" onClick={onBack}>← 이전</button>
        <button type="submit" className="btn flex-1">다음 단계 →</button>
      </div>
    </form>
  );
}
