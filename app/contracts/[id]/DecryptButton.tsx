"use client";

import { useState } from "react";

export default function DecryptButton({ contractId, clientType }: { contractId: string; clientType?: string }) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  async function load() {
    if (value !== null) { setVisible((v) => !v); return; }
    setLoading(true);
    const s = sessionStorage.getItem("admin_secret") ?? "";
    const res = await fetch(`/api/admin/contracts/${contractId}/decrypt`, {
      headers: { "x-admin-secret": s },
    });
    const data = await res.json();
    setValue(data.ok ? (data.id_number ?? "(없음)") : "(조회 실패)");
    setVisible(true);
    setLoading(false);
  }

  const label = clientType === "individual" ? "주민등록번호" : "사업자등록번호";

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-500">{label}</span>
      {visible && value ? (
        <span className="font-mono font-semibold text-slate-800">{value}</span>
      ) : (
        <span className="font-mono text-slate-300">●●●●●●-●●●●●●●</span>
      )}
      <button
        onClick={load}
        disabled={loading}
        className="text-xs px-2 py-0.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
      >
        {loading ? "…" : visible ? "숨기기" : "확인"}
      </button>
    </div>
  );
}
