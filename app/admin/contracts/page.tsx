"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useAdminContracts } from "@/app/admin/_hooks";
import { Download } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  signed: "서명완료",
  on_hold: "보류",
  completed: "종료",
  cancelled: "취소",
};

const STATUS_COLOR: Record<string, string> = {
  signed: "border-blue-300 text-blue-700 bg-blue-50",
  on_hold: "border-yellow-300 text-yellow-700 bg-yellow-50",
  completed: "border-slate-300 text-slate-600 bg-slate-50",
  cancelled: "border-red-200 text-red-600 bg-red-50",
};

export default function AdminContractsPage() {
  const [authed, setAuthed] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { contracts, load } = useAdminContracts();

  useEffect(() => {
    const s = sessionStorage.getItem("admin_secret");
    if (s) {
      load(s);
      setAuthed(true);
    } else {
      window.location.href = "/admin";
    }
  }, [load]);

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        c.title?.toLowerCase().includes(q) ||
        c.client?.name?.toLowerCase().includes(q) ||
        c.client?.company?.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "all" || c.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [contracts, query, statusFilter]);

  const downloadCsv = useCallback(() => {
    const header = ["고객명", "상호", "이메일", "금액(원)", "위치할인(%)", "프로모션(%)", "상태", "입금확인", "생성일", "메모"];
    const rows = filtered.map((c) => [
      c.client?.name ?? "",
      c.client?.company ?? "",
      c.client?.email ?? "",
      String(c.price ?? 0),
      String(c.discount_percent ?? 0),
      String(c.promo_percent ?? 0),
      STATUS_LABEL[c.status] ?? c.status,
      c.payment_confirmed ? "Y" : "N",
      new Date(c.created_at).toLocaleDateString("ko-KR"),
      (c.memo ?? "").replace(/[\r\n]+/g, " "),
    ]);

    const bom = "\uFEFF";
    const csv = bom + [header, ...rows].map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CONTEX_계약목록_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  if (!authed) return null;

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <a href="/admin" className="navlink text-sm">← 대시보드</a>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">전체 계약 목록</h1>
        <button
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
          onClick={downloadCsv}
        >
          <Download className="h-3.5 w-3.5" /> CSV 다운로드
        </button>
      </div>

      {/* 검색 / 필터 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          className="input flex-1"
          placeholder="고객명, 상호, 계약명 검색…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input w-full sm:w-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">전체 상태</option>
          <option value="signed">서명완료</option>
          <option value="on_hold">보류</option>
          <option value="completed">종료</option>
          <option value="cancelled">취소</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {/* ── 모바일 카드 목록 ── */}
        <div className="md:hidden divide-y">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-slate-500 text-sm">
              {query || statusFilter !== "all" ? "검색 결과가 없습니다." : "등록된 계약이 없습니다."}
            </p>
          ) : (
            filtered.map((c) => (
              <div key={c.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm truncate">
                    {c.client?.company
                      ? `${c.client.company}${c.client.name ? ` (${c.client.name})` : ""}`
                      : (c.client?.name ?? c.title)}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ₩{new Intl.NumberFormat("ko-KR").format(c.price ?? 0)}
                    &nbsp;·&nbsp;
                    {new Date(c.created_at).toLocaleDateString("ko-KR")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${STATUS_COLOR[c.status] ?? "border-slate-300 text-slate-600"}`}>
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                  <a href={`/contracts/${c.id}`} className="navlink text-xs whitespace-nowrap">
                    열기 →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── 데스크톱 테이블 ── */}
        <table className="hidden md:table w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3">고객</th>
              <th className="text-left px-4 py-3">금액</th>
              <th className="text-left px-4 py-3">상태</th>
              <th className="text-left px-4 py-3">생성일</th>
              <th className="text-left px-4 py-3">보기</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  {query || statusFilter !== "all"
                    ? "검색 결과가 없습니다."
                    : "등록된 계약이 없습니다."}
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3">
                  {c.client?.company ? `${c.client.company} ` : ""}
                  {c.client?.name ? `(${c.client.name})` : c.title}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  ₩{new Intl.NumberFormat("ko-KR").format(c.price ?? 0)}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${STATUS_COLOR[c.status] ?? "border-slate-300 text-slate-600"}`}>
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(c.created_at).toLocaleString("ko-KR")}
                </td>
                <td className="px-4 py-3">
                  <a href={`/contracts/${c.id}`} className="navlink text-xs">
                    열기 →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        * 이 페이지는 내부 관리용입니다.
      </p>
    </div>
  );
}
