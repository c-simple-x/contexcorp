"use client";

import { useEffect, useState } from "react";
import ContractTable from "@/app/components/admin/ContractTable";
import { useAdminContracts } from "@/app/admin/_hooks";

export default function InProgressPage() {
  const [authed, setAuthed] = useState(false);

  const { load, inProgress, markCompleted, markOnHold, revokePayment } =
    useAdminContracts();

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
      <h1 className="text-2xl font-extrabold mb-8">진행중</h1>

      <ContractTable
        title="진행중"
        dotColor="bg-blue-500"
        contracts={inProgress}
        emptyText="진행 중인 계약이 없습니다."
        action={(c) => (
          <div className="flex gap-1 flex-wrap">
            <button
              className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 whitespace-nowrap"
              onClick={() => markCompleted(c.id)}
            >
              완료 처리
            </button>
            <button
              className="text-xs px-2 py-1 rounded border border-yellow-300 text-yellow-700 hover:bg-yellow-50 whitespace-nowrap"
              onClick={() => markOnHold(c.id)}
            >
              보류
            </button>
            <button
              className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 whitespace-nowrap"
              onClick={() => revokePayment(c.id)}
            >
              입금 취소
            </button>
          </div>
        )}
      />
    </div>
  );
}
