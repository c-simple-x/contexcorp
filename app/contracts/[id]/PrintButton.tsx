"use client";

import { useState } from "react";

export default function PrintButton({ contractId }: { contractId: string }) {
  const [loading, setLoading] = useState(false);

  async function downloadPdf() {
    setLoading(true);
    const s = sessionStorage.getItem("admin_secret") ?? "";
    const res = await fetch(`/api/admin/contracts/${contractId}/pdf`, {
      headers: { "x-admin-secret": s },
    });
    if (!res.ok) {
      alert("PDF 생성 실패. 관리자 로그인 후 다시 시도해 주세요.");
      setLoading(false);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CONTEX_계약서.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    setLoading(false);
  }

  return (
    <button
      onClick={downloadPdf}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
    >
      {loading ? "PDF 생성 중…" : "PDF 저장"}
    </button>
  );
}
