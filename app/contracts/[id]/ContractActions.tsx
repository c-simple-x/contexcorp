"use client";

import { useState, useEffect } from "react";

type Props = {
  contractId: string;
  status: string;
  clientEmail?: string;
  initialMemo?: string;
};

export default function ContractActions({ contractId, status, clientEmail, initialMemo }: Props) {
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [memo, setMemo] = useState(initialMemo ?? "");
  const [savedMemo, setSavedMemo] = useState(initialMemo ?? "");
  const [savingMemo, setSavingMemo] = useState(false);

  useEffect(() => {
    setIsAdmin(!!sessionStorage.getItem("admin_secret"));
  }, []);

  async function resendEmail() {
    setResending(true);
    setResendMsg("");
    const s = sessionStorage.getItem("admin_secret") ?? "";
    const res = await fetch(`/api/admin/contracts/${contractId}/resend`, {
      method: "POST",
      headers: { "x-admin-secret": s },
    });
    const data = await res.json();
    setResendMsg(data.ok ? `발송 완료 (${data.to})` : `실패: ${data.error}`);
    setResending(false);
  }

  async function saveMemo() {
    setSavingMemo(true);
    const s = sessionStorage.getItem("admin_secret") ?? "";
    const res = await fetch(`/api/admin/contracts/${contractId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": s },
      body: JSON.stringify({ memo }),
    });
    if (res.ok) setSavedMemo(memo);
    setSavingMemo(false);
  }

  return (
    <div className="space-y-3">
      {clientEmail && (
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            className="text-xs px-3 py-1.5 rounded border border-blue-300 text-blue-700 hover:bg-blue-50 whitespace-nowrap"
            onClick={resendEmail}
            disabled={resending}
          >
            {resending ? "발송 중…" : "계약서 이메일 재발송"}
          </button>
          {resendMsg && (
            <span className={`text-xs ${resendMsg.startsWith("발송") ? "text-green-600" : "text-red-600"}`}>
              {resendMsg}
            </span>
          )}
        </div>
      )}
      {isAdmin && (
        <div className="rounded-xl border bg-slate-50 p-4">
          <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">관리자 메모</label>
          <textarea
            className="input w-full text-sm resize-none"
            rows={2}
            placeholder="내부 메모 (고객에게 보이지 않습니다)"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400">
              {memo !== savedMemo ? "변경사항 있음" : ""}
            </span>
            <button
              className="text-xs px-3 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              onClick={saveMemo}
              disabled={savingMemo || memo === savedMemo}
            >
              {savingMemo ? "저장 중…" : "메모 저장"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
