// app/contracts/page.tsx
export const dynamic = "force-dynamic";

type ContractRow = {
  id: string;
  title: string;
  price: number;
  status: string;
  created_at: string;
  client?: { company?: string | null; name?: string | null };
};

export default async function ContractsListPage() {
  // ✅ 상대 경로로 자기 API 호출 (Vercel에서도 OK)
  const res = await fetch(`/api/contracts`, { cache: "no-store" });
  if (!res.ok) {
    return (
      <div className="container py-16">
        <h1 className="text-2xl font-bold">계약 목록을 불러올 수 없습니다.</h1>
        <p className="mt-2 text-slate-600">서버 로그를 확인해 주세요.</p>
      </div>
    );
  }
  const json = await res.json();

  const list: ContractRow[] = json?.contracts ?? [];

  return (
    <div className="container py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">계약 목록</h1>
        <a href="/" className="navlink text-sm">홈으로</a>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3">제목</th>
              <th className="text-left px-4 py-3">고객</th>
              <th className="text-left px-4 py-3">금액</th>
              <th className="text-left px-4 py-3">상태</th>
              <th className="text-left px-4 py-3">생성일</th>
              <th className="text-left px-4 py-3">보기</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  등록된 계약이 없습니다.
                </td>
              </tr>
            )}
            {list.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-3">{c.title}</td>
                <td className="px-4 py-3">
                  {c.client?.company ? `${c.client.company} ` : ""}
                  {c.client?.name ? `(${c.client.name})` : ""}
                </td>
                <td className="px-4 py-3">₩{new Intl.NumberFormat("ko-KR").format(c.price ?? 0)}</td>
                <td className="px-4 py-3"><span className="rounded-full border px-2 py-0.5">{c.status}</span></td>
                <td className="px-4 py-3">{new Date(c.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <a className="navlink" href={`/contracts/${c.id}`}>열기 →</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        * 이 페이지는 내부 관리용입니다.
      </p>
    </div>
  );
}
