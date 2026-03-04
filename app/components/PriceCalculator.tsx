"use client";

import { useState } from "react";
import { CheckCircle2, Calculator } from "lucide-react";

const PRODUCTS = {
  location_annual: { label: "일반 GPS 위치 사용권 (연간)", price: 100000 },
  design_change:   { label: "디자인 단순 변경",             price: 20000 },
  design_create:   { label: "디자인 제작",                  price: 150000 },
  banner_3d_5s:    { label: "3D 모션 배너 제작 (5초)",      price: 550000 },
  banner_3d_10s:   { label: "3D 모션 배너 제작 (10초)",     price: 1067000 },
  banner_3d_15s:   { label: "3D 모션 배너 제작 (15초)",     price: 1567500 },
} as const;

type ProductKey = keyof typeof PRODUCTS;

const GROUPS = [
  {
    title: "위치 사용권",
    keys: ["location_annual"] as ProductKey[],
    radio: false,
  },
  {
    title: "디자인",
    keys: ["design_change", "design_create"] as ProductKey[],
    radio: true,
    note: "중복 선택 불가",
  },
  {
    title: "3D 모션 배너 제작",
    keys: ["banner_3d_5s", "banner_3d_10s", "banner_3d_15s"] as ProductKey[],
    radio: true,
    note: "중복 선택 불가",
  },
];

function fmt(n: number) {
  return "₩" + n.toLocaleString("ko-KR");
}

export default function PriceCalculator() {
  const [selected, setSelected] = useState<Set<ProductKey>>(new Set());

  function toggle(key: ProductKey, isRadio: boolean, groupKeys: ProductKey[]) {
    const next = new Set(selected);
    if (next.has(key)) {
      next.delete(key);
    } else {
      if (isRadio) groupKeys.forEach((k) => next.delete(k));
      next.add(key);
    }
    setSelected(next);
  }

  const selectedItems = Array.from(selected).map((k) => ({ key: k, ...PRODUCTS[k] }));
  const subtotal = selectedItems.reduce((s, i) => s + i.price, 0);
  const vat = Math.round(subtotal * 0.1);
  const total = subtotal + vat;

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* 선택 패널 */}
      <div className="space-y-5">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-slate-700">{g.title}</span>
              {g.note && <span className="text-xs text-slate-400">({g.note})</span>}
            </div>
            <div className="space-y-2">
              {g.keys.map((key) => {
                const prod = PRODUCTS[key];
                const isSelected = selected.has(key);
                const isBest = key === "banner_3d_10s";
                return (
                  <label
                    key={key}
                    className={`flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition ${
                      isSelected ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                    onClick={() => toggle(key, !!g.radio, g.keys)}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                      isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300"
                    }`}>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <span className="flex-1 text-sm">{prod.label}</span>
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
            {selectedItems.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">원하는 항목을 선택하세요</p>
            ) : (
              <div className="space-y-2 mb-4">
                {selectedItems.map((i) => (
                  <div key={i.key} className="flex justify-between text-sm">
                    <span className="text-slate-600">{i.label}</span>
                    <span className="font-medium tabular-nums">{fmt(i.price)}</span>
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

            <a
              href="#contact"
              className="btn w-full text-center mt-5 block"
            >
              이 견적으로 문의하기 →
            </a>
            <p className="text-xs text-slate-400 text-center mt-2">
              * 실제 견적은 상담 후 확정됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
