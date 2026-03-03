"use client";

import { useState } from "react";

type Props = {
  contractId: string;
  status: string;
  clientEmail?: string;
};

export default function ContractActions({ contractId, status, clientEmail }: Props) {
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

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

  return (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      {status === "signed" && clientEmail && (
        <button
          className="text-xs px-3 py-1.5 rounded border border-blue-300 text-blue-700 hover:bg-blue-50 whitespace-nowrap"
          onClick={resendEmail}
          disabled={resending}
        >
          {resending ? "발송 중…" : "이메일 재발송"}
        </button>
      )}
      {resendMsg && (
        <span className={`text-xs ${resendMsg.startsWith("발송") ? "text-green-600" : "text-red-600"}`}>
          {resendMsg}
        </span>
      )}
    </div>
  );
}
