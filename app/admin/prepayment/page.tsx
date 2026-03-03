"use client";

import { useEffect, useState } from "react";
import ContractTable from "@/app/components/admin/ContractTable";
import { useAdminContracts } from "@/app/admin/_hooks";

export default function PrepaymentPage() {
  const [authed, setAuthed] = useState(false);

  const { load, prePayment, confirmPayment } = useAdminContracts();

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
      <h1 className="text-2xl font-extrabold mb-8">입금확인전</h1>

      <ContractTable
        title="입금확인전"
        dotColor="bg-orange-400"
        contracts={prePayment}
        emptyText="입금 대기 중인 계약이 없습니다."
        action={(c) => (
          <button
            className="text-xs px-2 py-1 rounded border border-orange-300 text-orange-700 hover:bg-orange-50 whitespace-nowrap"
            onClick={() => confirmPayment(c.id)}
          >
            입금 확인
          </button>
        )}
      />
    </div>
  );
}
