"use client";

import { useState } from "react";

export default function SignForm({ id }: { id: string }) {
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!signerName.trim()) throw new Error("성함을 입력해 주세요.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signerEmail)) throw new Error("이메일 형식을 확인해 주세요.");

      const res = await fetch(`/api/contracts/${id}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signer_name: signerName.trim(),
          signer_email: signerEmail.trim(),
        }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j?.ok) throw new Error(j?.error || "서명 처리 실패");

      setDone(true);
    } catch (e: any) {
      setError(e?.message || "서명 처리 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="text-lg font-semibold">서명 진행</div>
      {done ? (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
          ✅ 서명이 완료되었습니다. 담당자가 확인 후 메일로 회신드릴게요.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 grid gap-3 max-w-md">
          <input
            className="input"
            placeholder="성함"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            required
          />
          <input
            className="input"
            type="email"
            placeholder="이메일"
            value={signerEmail}
            onChange={(e) => setSignerEmail(e.target.value)}
            required
          />
          <button className="btn" disabled={submitting}>
            {submitting ? "서명 처리 중…" : "서명하기"}
          </button>
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <p className="text-xs text-slate-500">서명 버튼을 누르면 본 계약 내용에 동의한 것으로 간주됩니다.</p>
        </form>
      )}
    </div>
  );
}
