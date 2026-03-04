// app/contracts/[id]/page.tsx
import { getBaseUrl } from "@/lib/get-base-url";
import ContractActions from "./ContractActions";
import PrintButton from "./PrintButton";
import DecryptButton from "./DecryptButton";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  try { return new Intl.NumberFormat("ko-KR").format(n); } catch { return String(n); }
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  signed:    { label: "서명 완료 (입금 대기)", color: "bg-orange-100 text-orange-700 border-orange-200" },
  on_hold:   { label: "보류",                 color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  completed: { label: "완료",                 color: "bg-green-100 text-green-700 border-green-200" },
  cancelled: { label: "취소",                 color: "bg-red-100 text-red-600 border-red-200" },
};

export default async function ContractPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/contracts/${id}`, { cache: "no-store" }).catch(() => null);

  if (!res || !res.ok) {
    return (
      <div className="container py-16">
        <h1 className="text-2xl font-bold">계약서를 찾을 수 없습니다.</h1>
        <p className="mt-2 text-slate-600">유효한 계약 ID인지 확인해 주세요.</p>
        <a href="/admin/contracts" className="navlink mt-4 inline-block">← 목록으로</a>
      </div>
    );
  }

  const json = await res.json();
  return <ContractView id={id} data={json.contract} />;
}

function ContractView({ id, data }: { id: string; data: any }) {
  const {
    title, terms, price, status, payment_confirmed,
    selected_items, created_at, client, signature, expires_at,
  } = data ?? {};

  const statusInfo = payment_confirmed && status === "signed"
    ? { label: "진행중", color: "bg-blue-100 text-blue-700 border-blue-200" }
    : STATUS_MAP[status] ?? { label: status, color: "bg-slate-100 text-slate-600 border-slate-200" };

  const items: { label: string; price: number }[] = Array.isArray(selected_items) ? selected_items : [];
  const basePrice = price ?? 0;
  const vat = Math.round(basePrice * 0.1);
  const totalWithVat = basePrice + vat;
  const signedAt = signature?.signed_at ? new Date(signature.signed_at) : null;
  const createdAt = created_at ? new Date(created_at) : null;

  // KST (UTC+9) 날짜 계산
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const signedAtKst = signedAt ? new Date(signedAt.getTime() + KST_OFFSET) : null;
  const createdAtKst = createdAt ? new Date(createdAt.getTime() + KST_OFFSET) : null;

  // 서명 검증 ID: 계약 UUID 앞 8자 + KST 서명 날짜
  const verifyId = `CTX-${id.slice(0, 8).toUpperCase()}${signedAtKst ? `-${signedAtKst.toISOString().slice(0, 10).replace(/-/g, "")}` : ""}`;

  return (
    <div className="min-h-screen bg-slate-100 py-10 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto px-4">

        {/* 어드민 액션 바 (인쇄 시 숨김) */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <a href="/admin/contracts" className="navlink text-sm">← 목록으로</a>
          <div className="flex items-center gap-2">
            <PrintButton contractId={id} />
            <ContractActions contractId={id} status={status} clientEmail={client?.email} />
          </div>
        </div>

        {/* 계약서 본문 */}
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden print:shadow-none print:rounded-none">

          {/* 헤더 */}
          <div className="bg-slate-800 text-white px-4 py-5 sm:px-8 sm:py-6 print:bg-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-1">
                  CONTEX Corp. · 전자계약서
                </p>
                <h1 className="text-xl font-extrabold leading-snug">{title ?? "계약서"}</h1>
              </div>
              <span className={`mt-1 shrink-0 text-xs font-semibold px-3 py-1 rounded-full border ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-8 sm:py-6 space-y-8">

            {/* 계약 기본 정보 */}
            <section>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">계약 정보</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-8 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">계약 번호</span>
                  <span className="font-mono font-medium text-xs">{id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">계약 체결일</span>
                  <span className="font-medium">
                    {signedAtKst
                      ? signedAtKst.toLocaleDateString("ko-KR", { timeZone: "UTC" })
                      : createdAtKst?.toLocaleDateString("ko-KR", { timeZone: "UTC" }) ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">공급가액 (VAT 별도)</span>
                  <span className="font-medium">₩{fmt(basePrice)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">입금 상태</span>
                  <span className={`font-semibold ${payment_confirmed ? "text-green-600" : "text-orange-600"}`}>
                    {payment_confirmed ? "입금 확인" : "입금 대기"}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">부가세 (10%)</span>
                  <span className="font-medium">₩{fmt(vat)}</span>
                </div>
                <div className="flex justify-between border-b pb-2 sm:col-span-2">
                  <span className="text-slate-700 font-semibold">실 입금액 (VAT 포함)</span>
                  <span className="font-extrabold text-blue-700 text-base">₩{fmt(totalWithVat)}</span>
                </div>
              </div>
            </section>

            {/* 계약 당사자 */}
            <section>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">계약 당사자</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {/* 공급자 */}
                <div className="rounded-xl border bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">공급자 (갑)</p>
                  <p className="font-bold text-sm">CONTEX Corp. (콘텍스)</p>
                  <p className="text-sm text-slate-600 mt-1">사업자등록번호: 181-48-00499</p>
                  <p className="text-sm text-slate-600">대표: 홍정민</p>
                  <p className="text-sm text-slate-600">이메일: hello@contexcorp.com</p>
                </div>
                {/* 고객 */}
                <div className="rounded-xl border bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase mb-2">계약자 (을)</p>
                  {client ? (
                    <>
                      {client.company && <p className="font-bold text-sm">{client.company}</p>}
                      <p className={`text-sm ${client.company ? "text-slate-600" : "font-bold"}`}>
                        {client.name}
                      </p>
                      {client.email && <p className="text-sm text-slate-600 mt-1">{client.email}</p>}
                      {client.phone && <p className="text-sm text-slate-600">{client.phone}</p>}
                      {client.address && <p className="text-sm text-slate-600">{client.address}</p>}
                      <div className="mt-2 pt-2 border-t border-slate-200">
                        <DecryptButton contractId={id} clientType={client.client_type} />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-400">-</p>
                  )}
                </div>
              </div>
            </section>

            {/* 선택 서비스 */}
            {items.length > 0 && (
              <section>
                <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">선택 서비스</h2>
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs">
                      <tr>
                        <th className="text-left px-4 py-2 font-semibold text-slate-500">서비스 항목</th>
                        <th className="text-right px-4 py-2 font-semibold text-slate-500">금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-4 py-2.5">{item.label}</td>
                          <td className="px-4 py-2.5 text-right tabular-nums">₩{fmt(item.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                      <tr>
                        <td className="px-4 py-2 text-sm text-slate-500">공급가액 (VAT 별도)</td>
                        <td className="px-4 py-2 text-right text-slate-500 tabular-nums">₩{fmt(basePrice)}</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-4 py-2 text-sm text-slate-500">부가세 (10%)</td>
                        <td className="px-4 py-2 text-right text-slate-500 tabular-nums">₩{fmt(vat)}</td>
                      </tr>
                      <tr className="border-t-2 border-slate-300">
                        <td className="px-4 py-2.5 font-extrabold text-sm">실 입금액 (VAT 포함)</td>
                        <td className="px-4 py-2.5 text-right font-extrabold text-blue-700 tabular-nums text-base">
                          ₩{fmt(totalWithVat)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>
            )}

            {/* 계약 조항 */}
            <section>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">계약 조항</h2>
              <div className="rounded-xl border bg-slate-50 p-4 sm:p-5 text-sm leading-7 whitespace-pre-wrap break-words text-slate-700 max-h-96 overflow-y-auto overflow-x-hidden">
                {terms}
              </div>
            </section>

            {/* 입금 계좌 안내 */}
            <section>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">입금 계좌 안내</h2>
              <div className="rounded-xl border bg-blue-50 border-blue-200 px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 grid place-items-center shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-blue-500 font-semibold mb-0.5">계약금 입금 계좌</p>
                  <p className="text-sm font-bold text-blue-900">기업은행 458-060294-04019</p>
                  <p className="text-sm text-blue-700">예금주: 홍정민</p>
                  <p className="text-sm font-extrabold text-blue-900 mt-1">
                    입금액: ₩{fmt(totalWithVat)} <span className="text-xs font-normal text-blue-600">(VAT 10% 포함 · 공급가 ₩{fmt(basePrice)})</span>
                  </p>
                </div>
              </div>
            </section>

            {/* 전자서명 */}
            <section>
              <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-3">전자서명</h2>
              {signature ? (
                <div className="rounded-xl border p-5">
                  <div className="grid md:grid-cols-2 gap-6 items-start">
                    {/* 공급자(갑) 서명 */}
                    <div className="border rounded-lg p-4 bg-slate-50">
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-3">공급자 (갑) 서명</p>
                      <div className="flex flex-col items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/ingam.png" alt="대표 도장" className="h-24 object-contain" />
                        <div className="text-center text-xs text-slate-500 space-y-0.5">
                          <p className="font-semibold text-slate-700">CONTEX Corp. 대표 홍정민</p>
                          <p>hello@contexcorp.com</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t space-y-1.5 text-sm">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-slate-500 shrink-0">서명 일시</span>
                          <span className="font-medium text-xs text-right">
                            {createdAtKst
                              ? createdAtKst.toLocaleString("ko-KR", { timeZone: "UTC" })
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* 계약자(을) 서명 */}
                    <div className="border rounded-lg p-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase mb-3">계약자 (을) 서명</p>
                      {signature.signature_image ? (
                        <div className="rounded-lg border-2 border-dashed border-slate-200 bg-white p-3 mb-3 flex justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={signature.signature_image}
                            alt="전자서명"
                            className="h-20 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="rounded-lg border-2 border-dashed border-slate-200 h-20 mb-3 grid place-items-center text-xs text-slate-400">
                          서명 이미지 없음
                        </div>
                      )}
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-slate-500">서명자</span>
                          <span className="font-semibold">{signature.signer_name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-slate-500">이메일</span>
                          <span className="font-medium text-xs break-all text-right">{signature.signer_email}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-slate-500 shrink-0">서명 일시</span>
                          <span className="font-medium text-xs text-right">
                            {signedAtKst
                              ? signedAtKst.toLocaleString("ko-KR", { timeZone: "UTC" })
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 검증 ID */}
                  <div className="mt-4 pt-4 border-t flex items-center gap-3">
                    <div className="rounded-lg bg-slate-50 border px-3 py-2 flex-1">
                      <p className="text-xs text-slate-400 mb-0.5">전자서명 검증 ID</p>
                      <p className="font-mono text-xs font-semibold text-slate-700 break-all">{verifyId}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-green-400 grid place-items-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-xs text-green-600 font-semibold mt-1">서명 완료</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-6 text-center text-slate-400 text-sm">
                  아직 서명이 완료되지 않았습니다.
                </div>
              )}
            </section>

          </div>

          {/* 계약서 하단 */}
          <div className="border-t bg-slate-50 px-4 sm:px-8 py-3 sm:py-4 text-xs text-slate-400 flex items-center justify-between gap-2">
            <span>본 계약서는 전자서명법에 따라 유효한 전자계약입니다.</span>
            <span className="font-mono hidden sm:block shrink-0">{id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
