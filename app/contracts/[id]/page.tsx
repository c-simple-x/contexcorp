import SignForm from "./SignForm";

function formatPrice(n: number) {
  try { return new Intl.NumberFormat("ko-KR").format(n); } catch { return String(n); }
}

export default async function ContractPage({ params }: { params: { id: string } }) {
  const id = params.id;

  // SSR에서 계약 데이터 가져오기
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // (디버그가 필요하면 아래 주석 해제)
  // console.log("📄 Fetch URL:", `${baseUrl}/api/contracts/${id}`);

  const res = await fetch(`${baseUrl}/api/contracts/${id}`, { cache: "no-store" }).catch(() => null);

  if (!res || !res.ok) {
    return (
      <div className="container py-16">
        <h1 className="text-2xl font-bold">계약서를 찾을 수 없습니다.</h1>
        <p className="mt-2 text-slate-600">유효한 계약 ID인지 확인해 주세요.</p>
      </div>
    );
  }

  const json = await res.json();
  return <ContractView id={id} data={json.contract} />;
}

function ContractView({ id, data }: { id: string; data: any }) {
  const { title, terms, price, status, client } = data ?? {};
  return (
    <div className="container py-12">
      <div className="mb-8">
        <a href="/" className="navlink text-sm">&larr; 홈으로</a>
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
              고객: {client.company ? `${client.company} / ` : ""}{client.name} ({client.email}{client.phone ? `, ${client.phone}` : ""})
            </p>
          )}
        </div>

        <div className="prose max-w-none whitespace-pre-wrap text-sm leading-7">
          {terms}
        </div>

        <SignForm id={id} />
      </div>
    </div>
  );
}
