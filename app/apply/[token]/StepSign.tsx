"use client";

import { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";

type Props = {
  token: string;
  contractId: string;
  signerName: string;
  signerEmail: string;
  onComplete: () => void;
  onBack: () => void;
};

export default function StepSign({ token, contractId, signerName, signerEmail, onComplete, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // HiDPI 대응
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(ratio, ratio);

    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
      penColor: "rgb(30, 41, 59)",
      minWidth: 1.5,
      maxWidth: 3,
    });

    pad.addEventListener("endStroke", () => setIsEmpty(pad.isEmpty()));
    padRef.current = pad;

    return () => pad.off();
  }, []);

  function clearPad() {
    padRef.current?.clear();
    setIsEmpty(true);
  }

  async function handleSubmit() {
    if (!padRef.current || padRef.current.isEmpty()) {
      setError("서명을 해주세요.");
      return;
    }
    setSubmitting(true);
    setError("");

    const signatureImage = padRef.current.toDataURL("image/png");

    const res = await fetch(`/api/apply/${token}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contract_id: contractId,
        signer_name: signerName,
        signer_email: signerEmail,
        signature_image: signatureImage,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      setError(data.error || "서명 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setSubmitting(false);
      return;
    }

    onComplete();
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm text-slate-600 mb-1">
          아래 서명란에 <b>{signerName}</b> 님의 서명을 해주세요.
        </p>
        <p className="text-xs text-slate-400">마우스 또는 터치로 서명할 수 있습니다.</p>
      </div>

      {/* 서명 캔버스 */}
      <div className="rounded-xl border border-slate-300 overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: 200, touchAction: "none" }}
        />
      </div>

      <div className="flex gap-3">
        <button type="button" className="btn" onClick={clearPad}>
          지우기
        </button>
        <p className="text-xs text-slate-500 self-center flex-1">
          서명 버튼을 누르면 계약 내용에 동의한 것으로 간주됩니다.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button type="button" className="btn flex-1" onClick={onBack} disabled={submitting}>
          ← 이전
        </button>
        <button
          type="button"
          className="btn flex-1"
          disabled={isEmpty || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "처리 중…" : "서명 완료"}
        </button>
      </div>
    </div>
  );
}
