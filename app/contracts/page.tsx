"use client";

import { useEffect, useState } from "react";

type ContractRow = {
  id: string;
  title: string;
  price: number;
  status: string;
  created_at: string;
  client?: { company?: string | null; name?: string | null };
};

export default function ContractsListPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [list, setList] = useState<ContractRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_secret");
    if (saved) {
      setSecret(saved);
      loadContracts(saved);
    }
  }, []);

  async function loadContracts(s: string) {
    setLoading(true);
    const res = await fetch("/api/contracts", {
      headers: { "x-admin-secret": s },
    });
    if (res.status === 401) {
      setAuthError("비밀번호가 틀렸습니다.");
      sessionStorage.removeItem("admin_secret");
      setLoading(false);
      return;
    }
    const json = await res.json().catch(() => ({}));
    setList(json?.contracts ?? []);
    setAuthed(true);
    setAuthError("");
    setLoading(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    sessionStorage.setItem("admin_secret", secret);
    loadContracts(secret);
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="card w-full max-w-sm">
          <div className="p-5 border-b text-lg font-semibold">관리자 로그인</div>
          <div className="p-5">
            <form onSubmit={handleLogin} className="grid gap-3">
              <input
                type="password"
                className="input"
                placeholder="관리자 비밀번호"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                required
              />
              {authError && <p className="text-sm text-red-600">{authError}</p>}
              <button className="btn">로그인</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">계약 목록</h1>
        <div className="flex gap-4">
          <a href="/admin" className="navlink text-sm">관리자 패널</a>
          <button
            className="navlink text-sm"
            onClick={() => { sessionStorage.removeItem("admin_secret"); setAuthed(false); }}
          >
            로그아웃
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500">불러오는 중…</p>
      ) : (
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
                  <td className="px-4 py-3">
                    <span className="rounded-full border px-2 py-0.5">{c.status}</span>
                  </td>
                  <td className="px-4 py-3">{new Date(c.created_at).toLocaleString("ko-KR")}</td>
                  <td className="px-4 py-3">
                    <a className="navlink" href={`/contracts/${c.id}`}>열기 →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-500 mt-3">* 이 페이지는 내부 관리용입니다.</p>
    </div>
  );
}
