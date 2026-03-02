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
    <div className="flex gap-2 text-sm">
      <span className="w-28 text-slate-500 shrink-0">{label}</span>
      <span className="text-slate-800">{value}</span>
    </div>
  );
}

export default function StepPreview({ info, products, contractId, onNext, onBack }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="grid gap-6">
      {/* 계약 당사자 */}
      <div className="card">
        <div className="p-4 border-b text-sm font-semibold bg-slate-50">계약 당사자</div>
        <div className="p-4 space-y-2">
          <Row label="공급자" value="CONTEX Corp. (대표 홍정민)" />
          {info.client_type === "business" && <Row label="상호" value={info.company} />}
          <Row label={info.client_type === "business" ? "대표자" : "성명"} value={info.name} />
          <Row label="이메일" value={info.email} />
          <Row label="전화" value={info.phone} />
          <Row label="주소" value={info.address} />
        </div>
      </div>

      {/* 계약 항목 */}
      <div className="card">
        <div className="p-4 border-b text-sm font-semibold bg-slate-50">계약 항목 및 금액</div>
        <div className="p-4 space-y-2">
          {products.items.map((item) => (
            <div key={item.key} className="flex justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-semibold tabular-nums">₩{item.price.toLocaleString("ko-KR")}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-extrabold">
            <span>합계</span>
            <span className="text-blue-700">₩{products.total.toLocaleString("ko-KR")}</span>
          </div>
          <p className="text-xs text-slate-500">부가세 별도</p>
        </div>
      </div>

      {/* 계약 조항 */}
      <div className="card">
        <div className="p-4 border-b text-sm font-semibold bg-slate-50">계약 조항</div>
        <div className="p-4 h-64 overflow-y-auto text-sm text-slate-700 leading-7 whitespace-pre-line">
          {TERMS}
        </div>
      </div>

      {/* 확인 체크박스 */}
      <label className="flex items-start gap-2 cursor-pointer text-sm text-slate-700">
        <input
          type="checkbox"
          className="mt-0.5"
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
