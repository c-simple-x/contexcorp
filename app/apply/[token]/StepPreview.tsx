"use client";

import { useState } from "react";
import { ClientInfo } from "./StepInfo";
import { SelectedProducts } from "./StepProducts";
import { CONTRACT_TERMS as TERMS } from "@/lib/contract-terms";

type Props = {
  info: ClientInfo;
  products: SelectedProducts;
  contractId: string;
  onNext: () => void;
  onBack: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm py-1 border-b border-slate-100 last:border-0">
      <span className="w-20 sm:w-28 text-slate-500 shrink-0 text-xs sm:text-sm">{label}</span>
      <span className="text-slate-800 min-w-0 break-words flex-1 text-xs sm:text-sm">{value}</span>
    </div>
  );
}

export default function StepPreview({ info, products, contractId, onNext, onBack }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  const vat = Math.round(products.total * 0.1);
  const totalWithVat = products.total + vat;

  return (
    <div className="flex flex-col gap-4">
      {/* 계약 당사자 */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b text-sm font-semibold bg-slate-50">계약 당사자</div>
        <div className="px-4 py-3 space-y-0">
          <Row label="공급자" value="CONTEX Corp. (대표 홍정민)" />
          {info.client_type === "business" && <Row label="상호" value={info.company} />}
          <Row label={info.client_type === "business" ? "대표자" : "성명"} value={info.name} />
          <Row label="이메일" value={info.email} />
          <Row label="전화" value={info.phone} />
          {info.address && <Row label="주소" value={info.address} />}
        </div>
      </div>

      {/* 계약 항목 */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b text-sm font-semibold bg-slate-50">계약 항목 및 금액</div>
        <div className="px-4 py-3">
          <div className="space-y-2 mb-3">
            {products.items.map((item) => (
              <div key={item.key} className="flex justify-between items-start gap-2 text-sm">
                <span className="min-w-0 break-words flex-1">{item.label}</span>
                <span className="font-semibold tabular-nums shrink-0">₩{item.price.toLocaleString("ko-KR")}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>공급가액 (VAT 별도)</span>
              <span>₩{products.total.toLocaleString("ko-KR")}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>부가세 (10%)</span>
              <span>₩{vat.toLocaleString("ko-KR")}</span>
            </div>
            <div className="flex justify-between font-extrabold border-t pt-2 mt-1">
              <span className="text-sm">총 입금 금액</span>
              <span className="text-blue-700 text-base">₩{totalWithVat.toLocaleString("ko-KR")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 계약 조항 */}
      <div className="rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b text-sm font-semibold bg-slate-50">계약 조항</div>
        <div className="px-4 py-3 h-56 overflow-y-auto overflow-x-hidden text-xs sm:text-sm text-slate-700 leading-6 whitespace-pre-line break-words">
          {TERMS}
        </div>
      </div>

      {/* 확인 체크박스 */}
      <label className="flex items-start gap-2 cursor-pointer text-sm text-slate-700 px-1">
        <input
          type="checkbox"
          className="mt-0.5 shrink-0"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        <span>위 계약서 내용을 충분히 읽고 확인하였습니다.</span>
      </label>

      <div className="flex gap-3">
        <button type="button" className="btn flex-1" onClick={onBack}>← 이전</button>
        <button
          type="button"
          className="btn flex-1"
          disabled={!confirmed}
          onClick={onNext}
        >
          서명하기 →
        </button>
      </div>
    </div>
  );
}
