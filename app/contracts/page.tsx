// app/contracts/page.tsx
import Link from "next/link";

type Client = {
  id: string;
  company: string | null;
  name: string;
  email: string;
  phone: string | null;
};

type Contract = {
  id: string;
  title: string;
  terms: string;
  price: number;
  status: "draft" | "sent" | "signed" | "canceled" | string;
  created_at: string;
  client?: Client | null;
};

function formatPrice(n: number) {
  try { return new Intl.NumberFormat("ko-KR").format(n); } catch { return String(n); }
}

export const dynamic = "force-dynamic"; // 목록은 항상 최신으로

export default async function ContractsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/contracts`, { cache: "no-store" });
  const json = await res.json().catch(() => null);

  const items: Contract[] = res.ok && json?.ok ? (json.contracts || []) : [];

  return (
    <div className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">계약 목록</h1>
        <Link href="/" className="navlink text-sm">홈으로</Link>
      </div>

      {(!items || items.length === 0) ? (
        <div className="card p-6 text-slate-600">
          아직 등록된 계약이 없습니다.
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((c) => (
            <Link
              key={c.id}
              href={`/contracts/${c.id}`}
              className="card p-5 hover-card block"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{c.title}</div>
                  <div className="text-sm text-slate-600 mt-1">
                    상태: <b>{c.status}</b>
                    {typeof c.price === "number" && (
                      <> · 금액: <b>₩{formatPrice(c.price)}</b></>
                    )}
                    {c.client && (
                      <> · 고객: {c.client.company ? `${c.client.company} / ` : ""}{c.client.name}</>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(c.created_at).toLocaleString("ko-KR")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
