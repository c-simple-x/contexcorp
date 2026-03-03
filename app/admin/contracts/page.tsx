"use client";

import { useEffect, useState } from "react";
import { useAdminContracts } from "@/app/admin/_hooks";

export default function AdminContractsPage() {
  const [authed, setAuthed] = useState(false);
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

  if (!authed) return null;

  return (
    <div className="container py-12">
      <div className="mb-6">
        <a href="/admin" className="navlink text-sm">← 대시보드</a>
      </div>
      <h1 className="text-2xl font-extrabold mb-8">전체 계약 목록</h1>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
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
            {contracts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  등록된 계약이 없습니다.
                </td>
              </tr>
            )}
            {contracts.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3">
                  {c.client?.company ? `${c.client.company} ` : ""}
                  {c.client?.name ? `(${c.client.name})` : c.title}
                </td>
                <td className="px-4 py-3">
                  ₩{new Intl.NumberFormat("ko-KR").format(c.price ?? 0)}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full border px-2 py-0.5 text-xs">{c.status}</span>
                </td>
                <td className="px-4 py-3">
                  {new Date(c.created_at).toLocaleString("ko-KR")}
                </td>
                <td className="px-4 py-3">
                  <a href={`/contracts/${c.id}`} className="navlink text-xs">열기 →</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 mt-3">* 이 페이지는 내부 관리용입니다.</p>
    </div>
  );
}
