"use client";

import { useState } from "react";
import { ClientInfo } from "./StepInfo";
import { SelectedProducts } from "./StepProducts";

const TERMS = `제1조(목적) 본 계약은 광고·AR 배너·콘텐츠·홍보물의 기획·제작·세팅·운영 및 관리 등에 관한 사항을 정함을 목적으로 한다.
제2조(범위) 광고기획, 콘텐츠 제작, AR 좌표 설정, 홍보물 제작, 운영/보고를 포함할 수 있다.
제3조(기간) 체결일로부터 검수 승인일까지. 장기 운영 항목은 명시 기간 적용.
제4조(비용) 선입금 후 착수하며, 지연 시 일정/납기 조정된다.
제5조(변경) 서면 요청을 원칙으로 하며, 범위 변경 시 비용이 별도 산정된다.
제6조(검수) 5영업일 내 승인/보완 요청, 미회신 시 자동 승인된다.
제7조(저작권) 명시 없을 경우 비독점 사용권 부여, 포트폴리오 활용 가능.
제8조(비밀유지) 종료 후 3년 유효.
제9조(법규준수) 표시·광고법, 개인정보보호법 등 관련 법규 준수.
제10조(면책) 천재지변/정책변경/네트워크/호환성 이슈에 대한 면책.
제11조(유지보수) 운영기간 내 합리적 보정, 범위 외 개선은 별도 비용.
제12조(해지) 위반·시정 미이행 시 해지 가능, 기 투입비용 정산.
제13조(재위탁) 품질·책임은 원청이 부담한다.
제14조(관할) 대한민국법 및 서울중앙지방법원을 관할로 한다.
제15조(전자서명) 전자서명/이메일 체결의 효력을 인정한다.`;

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
