"use client";

import { useEffect, useState } from "react";
import ContractTable from "@/app/components/admin/ContractTable";
import { useAdminContracts } from "@/app/admin/_hooks";

export default function CompletedPage() {
  const [authed, setAuthed] = useState(false);

  const { load, completed, reactivate } = useAdminContracts();

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
        <a href="/admin" className="navlink text-sm">
          ← 대시보드
        </a>
      </div>
      <h1 className="text-2xl font-extrabold mb-8">종료됨</h1>

      <ContractTable
        title="종료됨"
        dotColor="bg-slate-400"
        contracts={completed}
        emptyText="종료된 계약이 없습니다."
        action={(c) => (
          <button
            className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 whitespace-nowrap"
            onClick={() => reactivate(c.id)}
          >
            재확인
          </button>
        )}
      />
    </div>
  );
}
