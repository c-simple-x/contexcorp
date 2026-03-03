"use client";

import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Plus, ExternalLink } from "lucide-react";
import ContractTable from "@/app/components/admin/ContractTable";
import { useAdminContracts, TokenRow } from "@/app/admin/_hooks";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authError, setAuthError] = useState("");
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    contracts,
    load,
    prePayment,
    inProgress,
    onHold,
    completed,
    confirmPayment,
    revokePayment,
    markOnHold,
    unhold,
    markCompleted,
    reactivate,
  } = useAdminContracts();

  async function loadTokens(s: string) {
    const res = await fetch("/api/admin/tokens", {
      headers: { "x-admin-secret": s },
    });
    if (res.status === 401) {
      setAuthError("비밀번호가 틀렸습니다.");
      sessionStorage.removeItem("admin_secret");
      setChecking(false);
      return;
    }
    const data = await res.json();
    if (data.ok) {
      setTokens(data.tokens);
      setAuthed(true);
      setAuthError("");
      load(s);
    }
    setChecking(false);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("admin_secret", secret);
    loadTokens(secret);
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_secret");
    if (saved) {
      setSecret(saved);
      loadTokens(saved); // setChecking(false) called inside
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createToken(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setNewUrl("");
    const s = sessionStorage.getItem("admin_secret") || secret;
    const res = await fetch("/api/admin/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": s },
      body: JSON.stringify({ label }),
    });
    const data = await res.json();
    if (data.ok) {
      setNewUrl(data.url);
      setLabel("");
      loadTokens(s);
    }
    setCreating(false);
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (checking) return null;

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

  const now = new Date();
  const unusedTokens = tokens.filter((t) => !t.used_at);
  const activeTokens = unusedTokens.filter(
    (t) => !t.expires_at || new Date(t.expires_at) > now
  );
  const expiredTokens = unusedTokens.filter(
    (t) => t.expires_at && new Date(t.expires_at) <= now
  );

  function timeLeft(expiresAt: string | null): string {
    if (!expiresAt) return "";
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return "만료됨";
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}분 남음`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}시간 ${m}분 남음` : `${h}시간 남음`;
  }

  async function deleteToken(id: string) {
    const s = sessionStorage.getItem("admin_secret") || secret;
    const res = await fetch(`/api/admin/tokens/${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": s },
    });
    if (res.ok) setTokens((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">대시보드</h1>
        <button
          className="navlink text-sm"
          onClick={() => {
            sessionStorage.removeItem("admin_secret");
            setAuthed(false);
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 신규 계약 URL 생성 */}
      <div className="card mb-8">
        <div className="p-5 border-b text-lg font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> 신규 계약 URL 생성
        </div>
        <div className="p-5">
          <form onSubmit={createToken} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="text-sm text-slate-600 mb-1 block">
                라벨 (메모용, 선택)
              </label>
              <input
                className="input"
                placeholder="예: 홍길동 - 강남 매장 AR"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <button className="btn" disabled={creating}>
              {creating ? "생성 중…" : "URL 생성"}
            </button>
          </form>

          {newUrl && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                생성된 계약 URL:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm break-all text-blue-700">
                  {newUrl}
                </code>
                <button className="btn shrink-0" onClick={() => copyUrl(newUrl)}>
                  {copied ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <a
                  href={newUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                이 URL을 고객에게 발송하세요. 1회만 사용 가능합니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 입금확인전 */}
      <ContractTable
        title="입금확인전"
        dotColor="bg-orange-400"
        contracts={prePayment}
        emptyText="입금 대기 중인 계약이 없습니다."
        maxItems={3}
        viewAllHref="/admin/prepayment"
        action={(c) => (
          <button
            className="text-xs px-2 py-1 rounded border border-orange-300 text-orange-700 hover:bg-orange-50 whitespace-nowrap"
            onClick={() => confirmPayment(c.id)}
          >
            입금 확인
          </button>
        )}
      />

      {/* 진행중 */}
      <ContractTable
        title="진행중"
        dotColor="bg-blue-500"
        contracts={inProgress}
        emptyText="진행 중인 계약이 없습니다."
        maxItems={3}
        viewAllHref="/admin/inprogress"
        action={(c) => (
          <div className="flex gap-1 flex-wrap">
            <button
              className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 whitespace-nowrap"
              onClick={() => markCompleted(c.id)}
            >
              완료 처리
            </button>
            <button
              className="text-xs px-2 py-1 rounded border border-yellow-300 text-yellow-700 hover:bg-yellow-50 whitespace-nowrap"
              onClick={() => markOnHold(c.id)}
            >
              보류
            </button>
            <button
              className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 whitespace-nowrap"
              onClick={() => revokePayment(c.id)}
            >
              입금 취소
            </button>
          </div>
        )}
      />

      {/* 보류 */}
      <ContractTable
        title="보류"
        dotColor="bg-yellow-400"
        contracts={onHold}
        emptyText="보류 중인 계약이 없습니다."
        maxItems={3}
        viewAllHref="/admin/onhold"
        action={(c) => (
          <button
            className="text-xs px-2 py-1 rounded border border-yellow-300 text-yellow-700 hover:bg-yellow-50 whitespace-nowrap"
            onClick={() => unhold(c.id)}
          >
            보류 해제
          </button>
        )}
      />

      {/* 종료됨 */}
      <ContractTable
        title="종료됨"
        dotColor="bg-slate-400"
        contracts={completed}
        emptyText="종료된 계약이 없습니다."
        maxItems={3}
        viewAllHref="/admin/completed"
        action={(c) => (
          <button
            className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 whitespace-nowrap"
            onClick={() => reactivate(c.id)}
          >
            재확인
          </button>
        )}
      />

      {/* 미사용 계약 URL */}
      <div className="card overflow-hidden mb-4">
        <div className="p-5 border-b text-lg font-semibold flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-300" />
          미사용 계약 URL
          <span className="text-sm font-normal text-slate-500">
            (유효 {activeTokens.length}건{expiredTokens.length > 0 ? ` / 만료 ${expiredTokens.length}건` : ""})
          </span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3">라벨</th>
              <th className="text-left px-4 py-3">생성일</th>
              <th className="text-left px-4 py-3">남은 시간</th>
              <th className="text-left px-4 py-3">액션</th>
            </tr>
          </thead>
          <tbody>
            {unusedTokens.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  미사용 URL이 없습니다.
                </td>
              </tr>
            )}
            {activeTokens.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-3">
                  {t.label || <span className="text-slate-400">-</span>}
                </td>
                <td className="px-4 py-3">
                  {new Date(t.created_at).toLocaleString("ko-KR")}
                </td>
                <td className="px-4 py-3">
                  <span className="text-green-600 font-medium">
                    {timeLeft(t.expires_at)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      className="navlink text-xs"
                      onClick={() =>
                        copyUrl(`${window.location.origin}/apply/${t.token}`)
                      }
                    >
                      복사
                    </button>
                    <button
                      className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 whitespace-nowrap"
                      onClick={() => deleteToken(t.id)}
                    >
                      폐기
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {expiredTokens.map((t) => (
              <tr key={t.id} className="border-t bg-slate-50 opacity-60">
                <td className="px-4 py-3 text-slate-400">
                  {t.label || "-"}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {new Date(t.created_at).toLocaleString("ko-KR")}
                </td>
                <td className="px-4 py-3">
                  <span className="text-slate-400">만료됨</span>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-500 hover:bg-slate-100 whitespace-nowrap"
                    onClick={() => deleteToken(t.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 mt-3">
        * 이 페이지는 내부 관리용입니다. 공유하지 마세요.
      </p>
    </div>
  );
}
