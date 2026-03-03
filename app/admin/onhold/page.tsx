"use client";

import { useEffect, useState } from "react";
import ContractTable from "@/app/components/admin/ContractTable";
import { useAdminContracts } from "@/app/admin/_hooks";

export default function OnHoldPage() {
  const [authed, setAuthed] = useState(false);

  const { load, onHold, unhold, cancelContract } = useAdminContracts();

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
      <h1 className="text-2xl font-extrabold mb-8">보류</h1>

      <ContractTable
        title="보류"
        dotColor="bg-yellow-400"
        contracts={onHold}
        emptyText="보류 중인 계약이 없습니다."
        action={(c) => (
          <div className="flex gap-1 flex-wrap">
            <button
              className="text-xs px-2 py-1 rounded border border-yellow-300 text-yellow-700 hover:bg-yellow-50 whitespace-nowrap"
              onClick={() => unhold(c.id)}
            >
              보류 해제
            </button>
            <button
              className="text-xs px-2 py-1 rounded border border-red-400 text-red-700 hover:bg-red-50 whitespace-nowrap"
              onClick={() => cancelContract(c.id)}
            >
              계약 취소
            </button>
          </div>
        )}
      />
    </div>
  );
}
