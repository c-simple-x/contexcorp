// app/contracts/[id]/page.tsx
import { getBaseUrl } from "@/lib/get-base-url";
import ContractActions from "./ContractActions";

export const dynamic = "force-dynamic";

function formatPrice(n: number) {
  try { return new Intl.NumberFormat("ko-KR").format(n); } catch { return String(n); }
}

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
  const { title, terms, price, status, client, signature } = data ?? {};
  return (
    <div className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <a href="/admin/contracts" className="navlink text-sm">&larr; 목록으로</a>
        <ContractActions contractId={id} status={status} clientEmail={client?.email} />
      </div>

      <div className="card p-6">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-extrabold">{title ?? "무제 계약서"}</h1>
          <p className="text-slate-600 text-sm mt-1">
            상태: <b>{status}</b>
            {typeof price === "number" && <> · 금액: <b>₩{formatPrice(price)}</b></>}
          </p>
          {client && (
            <p className="text-slate-600 text-sm mt-1">
              고객: {client.company ? `${client.company} / ` : ""}{client.name}
              {" "}({client.email}{client.phone ? `, ${client.phone}` : ""})
              {client.address && <> · {client.address}</>}
            </p>
          )}
        </div>

        <div className="prose max-w-none whitespace-pre-wrap text-sm leading-7">
          {terms}
        </div>

        {/* 서명 정보 */}
        {signature && (
          <div className="mt-6 border-t pt-4">
            <p className="text-sm font-semibold mb-3">서명 정보</p>
            <p className="text-sm text-slate-600">
              서명자: {signature.signer_name} ({signature.signer_email})
              · {new Date(signature.created_at).toLocaleString("ko-KR")}
            </p>
            {signature.signature_image && (
              <div className="mt-3 inline-block border rounded-lg p-2 bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signature.signature_image}
                  alt="서명"
                  className="h-24 object-contain"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
