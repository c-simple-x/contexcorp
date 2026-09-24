"use client";

import { useEffect, useState } from "react";
import StepInfo, { ClientInfo } from "./StepInfo";
import StepProducts, { SelectedProducts } from "./StepProducts";
import StepPreview from "./StepPreview";
import StepSign from "./StepSign";
import StepComplete from "./StepComplete";
import { Catalog } from "@/lib/products";

const SUBMIT_ERRORS: Record<string, string> = {
  catalog_unavailable: "상품 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
  location_unavailable: "선택한 위치 사용권은 현재 신청할 수 없습니다. 다시 선택해 주세요.",
  no_items: "서비스를 하나 이상 선택해 주세요.",
};

const STEPS = ["기본 정보", "서비스 선택", "계약서 확인", "서명", "완료"];

type State =
  | { step: 1 }
  | { step: 2; info: ClientInfo }
  | { step: 3; info: ClientInfo; products: SelectedProducts; contractId: string }
  | { step: 4; info: ClientInfo; products: SelectedProducts; contractId: string }
  | { step: 5; info: ClientInfo; price: number };

export default function ApplyPage({ params }: { params: { token: string } }) {
  const { token } = params;
  const [tokenStatus, setTokenStatus] = useState<"loading" | "ok" | "invalid" | "used" | "expired">("loading");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoPercent, setPromoPercent] = useState(0);
  const [state, setState] = useState<State>({ step: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [catalogError, setCatalogError] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => (d.ok ? setCatalog(d.catalog) : setCatalogError(true)))
      .catch(() => setCatalogError(true));
  }, []);

  useEffect(() => {
    fetch(`/api/apply/${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setTokenStatus("ok");
          setDiscountPercent(d.discount_percent ?? 0);
          setPromoPercent(d.promo_percent ?? 0);
        }
        else if (d.error === "already_used") setTokenStatus("used");
        else if (d.error === "expired") setTokenStatus("expired");
        else setTokenStatus("invalid");
      })
      .catch(() => setTokenStatus("invalid"));
  }, [token]);

  async function handleInfoNext(info: ClientInfo) {
    setState({ step: 2, info });
  }

  async function handleProductsNext(products: SelectedProducts) {
    if (state.step !== 2) return;
    setSubmitting(true);
    setSubmitError("");

    const res = await fetch(`/api/apply/${token}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_type: state.info.client_type,
        name: state.info.name,
        company: state.info.company,
        id_number: state.info.id_number,
        email: state.info.email,
        phone: state.info.phone,
        address: state.info.address,
        selected: products.keys,
        purchase_type: products.purchaseType,
        location_type: products.locationType,
        location_days: products.locationDays,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSubmitting(false);

    if (!res.ok || !data.ok) {
      setSubmitError(SUBMIT_ERRORS[data.error] || data.error || "처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    // 미리보기·완료 화면은 서버가 확정한 금액을 사용 (계약서에 저장된 금액과 항상 일치)
    const confirmed: SelectedProducts = {
      ...products,
      items: data.selected_items.map((i: any) => ({ key: i.key, label: i.label, price: i.price, originalPrice: i.original_price })),
      keys: data.selected_items.map((i: any) => i.key),
      total: data.price,
    };
    setState({ step: 3, info: state.info, products: confirmed, contractId: data.contract_id });
  }

  function handlePreviewNext() {
    if (state.step !== 3) return;
    setState({ step: 4, info: state.info, products: state.products, contractId: state.contractId });
  }

  function handleSignComplete() {
    if (state.step !== 4) return;
    setState({ step: 5, info: state.info, price: state.products.total });
  }

  // 토큰 상태 처리
  if (tokenStatus === "loading") {
    return <LoadingScreen />;
  }
  if (tokenStatus !== "ok" && state.step === 1) {
    return <ErrorScreen status={tokenStatus} />;
  }

  const currentStep = state.step;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="container h-14 flex items-center">
          <a href="/" className="font-extrabold tracking-tight">CONTEX <span className="font-semibold opacity-70">Corp.</span></a>
        </div>
      </header>

      <div className="container py-10 max-w-xl">
        {/* 스텝 인디케이터 */}
        {currentStep < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {STEPS.slice(0, 4).map((label, i) => {
                const stepNum = i + 1;
                const active = stepNum === currentStep;
                const done = stepNum < currentStep;
                return (
                  <div key={label} className="flex flex-col items-center gap-1 flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition ${
                      done ? "bg-blue-500 border-blue-500 text-white" :
                      active ? "border-blue-500 text-blue-600" :
                      "border-slate-300 text-slate-400"
                    }`}>
                      {done ? "✓" : stepNum}
                    </div>
                    <span className={`text-xs hidden sm:block ${active ? "text-blue-600 font-semibold" : "text-slate-400"}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* 카드 */}
        <div className="card">
          {currentStep < 5 && (
            <div className="p-5 border-b">
              <h2 className="text-lg font-extrabold">{STEPS[currentStep - 1]}</h2>
              {currentStep === 1 && <p className="text-sm text-slate-500 mt-0.5">계약을 위한 기본 정보를 입력해주세요.</p>}
              {currentStep === 2 && <p className="text-sm text-slate-500 mt-0.5">원하시는 서비스를 선택해주세요.</p>}
              {currentStep === 3 && <p className="text-sm text-slate-500 mt-0.5">계약 내용을 확인하고 동의해주세요.</p>}
              {currentStep === 4 && <p className="text-sm text-slate-500 mt-0.5">서명으로 계약을 체결합니다.</p>}
            </div>
          )}

          <div className="p-5">
            {submitting && (
              <div className="text-center py-8 text-slate-500 text-sm">처리 중…</div>
            )}
            {submitError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            {!submitting && currentStep === 1 && (
              <StepInfo onNext={handleInfoNext} />
            )}
            {!submitting && currentStep === 2 && state.step === 2 && !catalog && (
              catalogError
                ? <p className="text-sm text-red-600 text-center py-8">상품 정보를 불러오지 못했습니다. 새로고침해 주세요.</p>
                : <p className="text-sm text-slate-500 text-center py-8">상품 정보를 불러오는 중…</p>
            )}
            {!submitting && currentStep === 2 && state.step === 2 && catalog && (
              <StepProducts
                catalog={catalog}
                discountPercent={discountPercent}
                promoPercent={promoPercent}
                onNext={handleProductsNext}
                onBack={() => setState({ step: 1 })}
              />
            )}
            {!submitting && currentStep === 3 && state.step === 3 && (
              <StepPreview
                info={state.info}
                products={state.products}
                contractId={state.contractId}
                onNext={handlePreviewNext}
                onBack={() => state.step === 3 && setState({ step: 2, info: state.info })}
              />
            )}
            {currentStep === 4 && state.step === 4 && (
              <StepSign
                token={token}
                contractId={state.contractId}
                signerName={state.info.name}
                signerEmail={state.info.email}
                onComplete={handleSignComplete}
                onBack={() => state.step === 4 && setState({ step: 3, info: state.info, products: state.products, contractId: state.contractId })}
              />
            )}
            {currentStep === 5 && state.step === 5 && (
              <StepComplete email={state.info.email} name={state.info.name} price={state.price} />
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center mt-4">
          © {new Date().getFullYear()} CONTEX Corp. · 개인정보는 암호화되어 안전하게 보관됩니다.
        </p>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-500">계약 정보를 불러오는 중…</p>
    </div>
  );
}

function ErrorScreen({ status }: { status: string }) {
  const messages: Record<string, string> = {
    used: "이미 사용된 계약 링크입니다.",
    expired: "만료된 계약 링크입니다.",
    invalid: "유효하지 않은 계약 링크입니다.",
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="card p-8 max-w-sm text-center">
        <p className="text-xl font-bold text-slate-800 mb-2">링크 오류</p>
        <p className="text-slate-600 text-sm">{messages[status] || "알 수 없는 오류입니다."}</p>
        <p className="text-xs text-slate-400 mt-4">담당자에게 새 링크를 요청해주세요.</p>
        <a href="/" className="btn mt-4">홈으로</a>
      </div>
    </div>
  );
}
