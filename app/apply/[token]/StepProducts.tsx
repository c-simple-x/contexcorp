"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export type SelectedProducts = {
  keys: string[];
  total: number;
  items: { key: string; label: string; price: number }[];
};

const PRODUCTS = {
  location: { label: "위치 사용권 (연간)", price: 200000, required: true, group: null },
  design_change: { label: "디자인 단순 변경", price: 20000, required: false, group: "design" },
  design_create: { label: "디자인 제작", price: 150000, required: false, group: "design" },
  banner_3d_replace: { label: "3D 모션 배너 교체", price: 60000, required: false, group: null },
  banner_3d_5s: { label: "3D 모션 배너 제작 (5초)", price: 550000, required: false, group: "banner_3d" },
  banner_3d_10s: { label: "3D 모션 배너 제작 (10초)", price: 1067000, required: false, group: "banner_3d" },
  banner_3d_15s: { label: "3D 모션 배너 제작 (15초)", price: 1567500, required: false, group: "banner_3d" },
} as const;

type ProductKey = keyof typeof PRODUCTS;

function fmt(n: number) {
  return "₩" + n.toLocaleString("ko-KR");
}

type Props = {
  onNext: (products: SelectedProducts) => void;
  onBack: () => void;
};

export default function StepProducts({ onNext, onBack }: Props) {
  const [selected, setSelected] = useState<Set<ProductKey>>(new Set<ProductKey>(["location"]));

  function toggle(key: ProductKey) {
    if (PRODUCTS[key].required) return;
    const next = new Set(selected);
    const group = PRODUCTS[key].group;

    if (next.has(key)) {
      next.delete(key);
    } else {
      // 같은 그룹 내 다른 항목 제거 (radio behavior)
      if (group) {
        (Object.keys(PRODUCTS) as ProductKey[]).forEach((k) => {
          if (PRODUCTS[k].group === group && k !== key) next.delete(k);
        });
      }
      next.add(key);
    }
    setSelected(next);
  }

  const items = (Object.keys(PRODUCTS) as ProductKey[])
    .filter((k) => selected.has(k))
    .map((k) => ({ key: k, label: PRODUCTS[k].label, price: PRODUCTS[k].price }));

  const total = items.reduce((s, i) => s + i.price, 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext({ keys: Array.from(selected), total, items });
  }

  const groups = [
    {
      title: "기본 서비스",
      keys: ["location"] as ProductKey[],
    },
    {
      title: "기본 배너",
      keys: ["design_change", "design_create"] as ProductKey[],
      note: "중복 선택 불가",
    },
    {
      title: "3D 모션 배너",
      keys: ["banner_3d_replace", "banner_3d_5s", "banner_3d_10s", "banner_3d_15s"] as ProductKey[],
      note: "제작 옵션은 중복 선택 불가",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      {groups.map((g) => (
        <div key={g.title}>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-slate-700">{g.title}</h3>
            {g.note && <span className="text-xs text-slate-400">({g.note})</span>}
          </div>
          <div className="grid gap-2">
            {g.keys.map((key) => {
              const prod = PRODUCTS[key];
              const isSelected = selected.has(key);
              const isBest = key === "banner_3d_10s";
              const isDiscounted = key === "banner_3d_10s" || key === "banner_3d_15s";

              return (
                <label
                  key={key}
                  className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${
                    isSelected
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  } ${prod.required ? "cursor-default" : ""}`}
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
                      {prod.required && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">필수</span>
                      )}
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
        {items.map((i) => (
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
