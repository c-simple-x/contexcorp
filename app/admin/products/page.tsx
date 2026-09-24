"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import {
  Catalog, CATEGORIES, LOCATION_KEYS, Product, ProductCategory, ProductGroup, fmtWon,
} from "@/lib/products";

const CATEGORY_HINT: Record<ProductCategory, string> = {
  location: "계산 방식이 고정된 상품이라 추가·삭제는 안 되고 내용만 수정할 수 있습니다. (연간 정액 / 일 단위 × 일수)",
  design: "고객은 이 그룹에서 하나만 선택할 수 있습니다.",
  banner_3d: "고객은 이 그룹에서 하나만 선택할 수 있습니다.",
};

function newProduct(category: ProductCategory, sort_order: number): Product {
  return {
    key: `${category}_${Date.now().toString(36)}`,
    category, label: "", price: 0, unit: "회", description: "", badge: "", note: "",
    features: [], sort_order, active: true,
  };
}

export default function AdminProductsPage() {
  const [secret, setSecret] = useState("");
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [saved, setSaved] = useState<string>("");
  const [tableMissing, setTableMissing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const load = useCallback(async (s: string) => {
    const res = await fetch("/api/admin/products", { headers: { "x-admin-secret": s } });
    if (res.status === 401) {
      sessionStorage.removeItem("admin_secret");
      window.location.href = "/admin";
      return;
    }
    const data = await res.json().catch(() => null);
    if (!data?.ok) {
      setLoadError(data?.error || `상품 정보를 불러오지 못했습니다. (${res.status})`);
      return;
    }
    setCatalog(data.catalog);
    setSaved(JSON.stringify(data.catalog));
    setTableMissing(!!data.table_missing);
  }, []);

  useEffect(() => {
    const s = sessionStorage.getItem("admin_secret");
    if (!s) {
      window.location.href = "/admin";
      return;
    }
    setSecret(s);
    load(s);
  }, [load]);

  const dirty = !!catalog && JSON.stringify(catalog) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const byCategory = useMemo(() => {
    const map = {} as Record<ProductCategory, Product[]>;
    for (const c of CATEGORIES) map[c] = [];
    catalog?.products.forEach((p) => map[p.category]?.push(p));
    for (const c of CATEGORIES) map[c].sort((a, b) => a.sort_order - b.sort_order);
    return map;
  }, [catalog]);

  function updateProduct(key: string, patch: Partial<Product>) {
    setCatalog((c) => c && { ...c, products: c.products.map((p) => (p.key === key ? { ...p, ...patch } : p)) });
    setMessage(null);
  }

  function updateGroup(key: ProductCategory, patch: Partial<ProductGroup>) {
    setCatalog((c) => c && { ...c, groups: c.groups.map((g) => (g.key === key ? { ...g, ...patch } : g)) });
    setMessage(null);
  }

  function move(category: ProductCategory, index: number, dir: -1 | 1) {
    const list = [...byCategory[category]];
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    const order = new Map(list.map((p, i) => [p.key, i]));
    setCatalog((c) => c && {
      ...c,
      products: c.products.map((p) => (order.has(p.key) ? { ...p, sort_order: order.get(p.key)! } : p)),
    });
    setMessage(null);
  }

  function addProduct(category: ProductCategory) {
    setCatalog((c) => c && { ...c, products: [...c.products, newProduct(category, byCategory[category].length)] });
    setMessage(null);
  }

  function removeProduct(p: Product) {
    if (!confirm(`'${p.label || "새 상품"}'을(를) 삭제할까요?\n저장 버튼을 눌러야 실제로 삭제됩니다. 이미 체결된 계약에는 영향이 없습니다.`)) return;
    setCatalog((c) => c && { ...c, products: c.products.filter((x) => x.key !== p.key) });
    setMessage(null);
  }

  async function save() {
    if (!catalog) return;
    setSaving(true);
    setMessage(null);
    // 분류 순서대로 정렬해서 전송 (서버가 분류별 순서를 다시 매김)
    const products = CATEGORIES.flatMap((c) => byCategory[c]);
    const res = await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ products, groups: catalog.groups }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setSaving(false);

    if (!res || !data?.ok) {
      setMessage({
        type: "error",
        text: data?.table_missing
          ? "DB에 상품 테이블이 아직 없습니다. Supabase에서 테이블 생성 SQL을 먼저 실행해 주세요."
          : data?.error || `저장에 실패했습니다. (${res?.status ?? "네트워크 오류"})`,
      });
      return;
    }
    setCatalog(data.catalog);
    setSaved(JSON.stringify(data.catalog));
    setTableMissing(false);
    setMessage({ type: "ok", text: "저장했습니다. 사이트에 바로 반영됩니다." });
  }

  if (loadError) {
    return <div className="container py-12"><p className="text-red-600">{loadError}</p></div>;
  }
  if (!catalog) {
    return <div className="container py-12"><p className="text-slate-500">불러오는 중…</p></div>;
  }

  return (
    <div className="container py-12 pb-32 max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">상품·금액 관리</h1>
          <p className="text-sm text-slate-500 mt-1">
            메인 금액표, 견적 계산기, 계약 신청 화면에 모두 반영됩니다. 이미 체결된 계약의 금액은 바뀌지 않습니다.
          </p>
        </div>
        <a href="/#pricing" target="_blank" className="shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50">
          사이트에서 보기 <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {tableMissing && (
        <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
          DB에 상품 테이블이 아직 없어 기본 금액을 보여주고 있습니다. Supabase에서 테이블 생성 SQL을 실행한 뒤 저장해 주세요.
        </div>
      )}

      <div className="space-y-10">
        {CATEGORIES.map((category) => {
          const group = catalog.groups.find((g) => g.key === category);
          const list = byCategory[category];
          const isLocation = category === "location";
          return (
            <section key={category} className="card">
              <div className="p-5 border-b bg-slate-50 rounded-t-2xl grid gap-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="그룹 이름">
                    <input className="input" value={group?.title ?? ""} onChange={(e) => updateGroup(category, { title: e.target.value })} />
                  </Field>
                  <Field label="그룹 부제 (선택)">
                    <input className="input" value={group?.subtitle ?? ""} placeholder="예: 제작 기준: 초당 ₩110,000 (부가세 별도)" onChange={(e) => updateGroup(category, { subtitle: e.target.value })} />
                  </Field>
                </div>
                <p className="text-xs text-slate-500">{CATEGORY_HINT[category]}</p>
              </div>

              <div className="divide-y">
                {list.map((p, i) => (
                  <div key={p.key} className={`p-5 grid gap-3 ${p.active ? "" : "bg-slate-50 opacity-70"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                        <input type="checkbox" checked={p.active} onChange={(e) => updateProduct(p.key, { active: e.target.checked })} />
                        {p.active ? "사이트에 노출" : "숨김"}
                      </label>
                      <div className="flex items-center gap-1">
                        <IconButton title="위로" disabled={i === 0} onClick={() => move(category, i, -1)}><ArrowUp className="h-4 w-4" /></IconButton>
                        <IconButton title="아래로" disabled={i === list.length - 1} onClick={() => move(category, i, 1)}><ArrowDown className="h-4 w-4" /></IconButton>
                        {!LOCATION_KEYS.includes(p.key) && (
                          <IconButton title="삭제" danger onClick={() => removeProduct(p)}><Trash2 className="h-4 w-4" /></IconButton>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-[1fr_180px_90px] gap-3">
                      <Field label="상품명 (계약서에도 이 이름으로 표시)">
                        <input className="input" value={p.label} maxLength={60} onChange={(e) => updateProduct(p.key, { label: e.target.value })} />
                      </Field>
                      <Field label={isLocation && p.key !== LOCATION_KEYS[0] ? "1일 금액 (원, VAT 별도)" : "금액 (원, VAT 별도)"}>
                        <input
                          className="input text-right tabular-nums"
                          inputMode="numeric"
                          value={p.price.toLocaleString("ko-KR")}
                          onChange={(e) => updateProduct(p.key, { price: Number(e.target.value.replace(/[^0-9]/g, "")) || 0 })}
                        />
                      </Field>
                      <Field label="단위">
                        <input className="input" value={p.unit} maxLength={10} placeholder="회" onChange={(e) => updateProduct(p.key, { unit: e.target.value })} />
                      </Field>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="배지 (선택, 예: Best · 기본)">
                        <input className="input" value={p.badge} maxLength={20} onChange={(e) => updateProduct(p.key, { badge: e.target.value })} />
                      </Field>
                      <Field label="금액 아래 문구 (선택, 예: 3% 할인 적용)">
                        <input className="input" value={p.note} maxLength={40} onChange={(e) => updateProduct(p.key, { note: e.target.value })} />
                      </Field>
                    </div>

                    <Field label="설명">
                      <textarea className="input min-h-[64px]" value={p.description} maxLength={300} onChange={(e) => updateProduct(p.key, { description: e.target.value })} />
                    </Field>

                    <Field label="특징 목록 (선택, 한 줄에 하나, 최대 6개)">
                      <textarea
                        className="input min-h-[64px]"
                        value={p.features.join("\n")}
                        onChange={(e) => updateProduct(p.key, { features: e.target.value.split("\n").slice(0, 6) })}
                      />
                    </Field>

                    <p className="text-xs text-slate-400">
                      사이트 표시: {p.label || "(상품명 없음)"} · {fmtWon(p.price)}{p.unit && ` / ${p.unit}`}
                    </p>
                  </div>
                ))}
              </div>

              {!isLocation && (
                <div className="p-4 border-t">
                  <button type="button" onClick={() => addProduct(category)} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800">
                    <Plus className="h-4 w-4" /> 상품 추가
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* 저장 바 */}
      <div className="fixed bottom-0 inset-x-0 border-t bg-white/95 backdrop-blur z-30">
        <div className="container max-w-4xl py-3 flex items-center justify-between gap-4">
          <p className={`text-sm ${message?.type === "error" ? "text-red-600" : message?.type === "ok" ? "text-green-700" : "text-slate-500"}`}>
            {message?.text ?? (dirty ? "저장하지 않은 변경사항이 있습니다." : "변경사항 없음")}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {dirty && (
              <button type="button" className="text-sm text-slate-500 hover:text-slate-800 px-3" onClick={() => { setCatalog(JSON.parse(saved)); setMessage(null); }}>
                되돌리기
              </button>
            )}
            <button type="button" className="btn disabled:opacity-40" disabled={!dirty || saving} onClick={save}>
              {saving ? "저장 중…" : "저장"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function IconButton({ title, disabled, danger, onClick, children }: {
  title: string; disabled?: boolean; danger?: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`p-1.5 rounded border border-slate-200 disabled:opacity-30 ${danger ? "text-red-500 hover:bg-red-50" : "text-slate-500 hover:bg-slate-50"}`}
    >
      {children}
    </button>
  );
}
