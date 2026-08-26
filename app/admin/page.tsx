"use client";

import { useState, useEffect } from "react";
import { Copy, CheckCircle2, Plus, ExternalLink, Download } from "lucide-react";
import ContractTable from "@/app/components/admin/ContractTable";
import { useAdminContracts, TokenRow } from "@/app/admin/_hooks";

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [authError, setAuthError] = useState("");
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [label, setLabel] = useState("");
  const [discount, setDiscount] = useState("0");
  const [promo, setPromo] = useState("0");
  const [creating, setCreating] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [showExpired, setShowExpired] = useState(false);

  const {
    contracts,
    load,
    prePayment,
    inProgress,
    onHold,
    completed,
    cancelled,
    confirmPayment,
    revokePayment,
    markOnHold,
    unhold,
    markCompleted,
    reactivate,
    cancelContract,
    restoreContract,
  } = useAdminContracts();

  async function loadTokens(s: string) {
    try {
      const res = await fetch("/api/admin/tokens", {
        headers: { "x-admin-secret": s },
      });
      if (res.status === 401) {
        setAuthError("비밀번호가 틀렸습니다.");
        setSecret("");
        sessionStorage.removeItem("admin_secret");
        return;
      }
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setAuthError(
          `서버 오류로 로그인에 실패했습니다. (${res.status}) 잠시 후 다시 시도해 주세요.`
        );
        return;
      }
      setTokens(data.tokens);
      setAuthed(true);
      setAuthError("");
      load(s);
      window.dispatchEvent(new Event("adminAuthChange"));
    } catch {
      setAuthError("서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.");
    } finally {
      setChecking(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem("admin_secret", secret);
    loadTokens(secret);
  }

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_secret");
    if (saved) {
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
      body: JSON.stringify({ label, discount_percent: Number(discount) || 0, promo_percent: Number(promo) || 0 }),
    });
    const data = await res.json();
    if (data.ok) {
      setNewUrl(data.url);
      setLabel("");
      setDiscount("0");
      setPromo("0");
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

  async function extendToken(id: string) {
    const s = sessionStorage.getItem("admin_secret") || secret;
    const res = await fetch(`/api/admin/tokens/${id}`, {
      method: "PATCH",
      headers: { "x-admin-secret": s },
    });
    if (res.ok) {
      const data = await res.json();
      setTokens((prev) =>
        prev.map((t) => (t.id === id ? { ...t, expires_at: data.expires_at } : t))
      );
    }
  }

  // 통계 계산
  const thisMonthContracts = contracts.filter((c) => {
    const d = new Date(c.created_at);
    return c.status !== "cancelled" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalRevenue = contracts
    .filter((c) => c.payment_confirmed && c.status !== "cancelled")
    .reduce((sum, c) => sum + (c.price ?? 0), 0);
  const thisMonthRevenue = thisMonthContracts
    .filter((c) => c.payment_confirmed)
    .reduce((sum, c) => sum + (c.price ?? 0), 0);

  // 월별 매출 (최근 6개월)
  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const revenue = contracts
      .filter((c) => {
        const cd = new Date(c.created_at);
        return c.payment_confirmed && c.status !== "cancelled" && cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
      })
      .reduce((s, c) => s + (c.price ?? 0), 0);
    return {
      label: `${d.getMonth() + 1}월`,
      revenue,
    };
  });
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1);
  const fmtW = (n: number) => n >= 1000000
    ? `₩${(n / 1000000).toFixed(1)}M`
    : n >= 1000 ? `₩${Math.round(n / 1000)}K` : `₩${n}`;

  // 만료 예정 계약 (D-30 이내, signed + payment_confirmed)
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringContracts = contracts.filter((c) => {
    if (!c.expires_at || c.status !== "signed" || !c.payment_confirmed) return false;
    const exp = new Date(c.expires_at);
    return exp > now && exp <= thirtyDaysLater;
  });

  function downloadCsv() {
    const STATUS_LABEL: Record<string, string> = {
      signed: "서명완료", on_hold: "보류", completed: "종료", cancelled: "취소",
    };
    const header = ["고객명", "상호", "이메일", "금액(원)", "위치할인(%)", "프로모션(%)", "상태", "입금확인", "생성일", "메모"];
    const rows = contracts.map((c) => [
      c.client?.name ?? "",
      c.client?.company ?? "",
      c.client?.email ?? "",
      String(c.price ?? 0),
      String(c.discount_percent ?? 0),
      String(c.promo_percent ?? 0),
      STATUS_LABEL[c.status] ?? c.status,
      c.payment_confirmed ? "Y" : "N",
      new Date(c.created_at).toLocaleDateString("ko-KR"),
      (c.memo ?? "").replace(/[\r\n]+/g, " "),
    ]);
    const bom = "\uFEFF";
    const csv = bom + [header, ...rows].map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CONTEX_계약목록_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="container py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">대시보드</h1>
        <div className="flex items-center gap-3">
          <a
            href="/admin/contracts"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            전체 계약 목록 →
          </a>
          <button
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
            onClick={downloadCsv}
          >
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button
            className="navlink text-sm"
            onClick={() => {
              sessionStorage.removeItem("admin_secret");
              setAuthed(false);
              setSecret("");
              window.dispatchEvent(new Event("adminAuthChange"));
            }}
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 만료 예정 계약 알림 */}
      {expiringContracts.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 mb-6">
          <p className="text-sm font-semibold text-orange-700 mb-2">
            ⚠ 30일 이내 만료 예정 계약 ({expiringContracts.length}건)
          </p>
          <div className="space-y-1">
            {expiringContracts.map((c) => {
              const exp = new Date(c.expires_at!);
              const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-orange-800">
                    {c.client?.company || c.client?.name || c.title}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-600 font-medium">D-{daysLeft}</span>
                    <a href={`/contracts/${c.id}`} className="text-xs navlink">보기 →</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "이번달 신규", value: `${thisMonthContracts.length}건` },
          { label: "진행중", value: `${inProgress.length}건` },
          { label: "이번달 매출", value: `₩${new Intl.NumberFormat("ko-KR").format(thisMonthRevenue)}` },
          { label: "누적 매출", value: `₩${new Intl.NumberFormat("ko-KR").format(totalRevenue)}` },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className="text-xs text-slate-500">{stat.label}</p>
            <p className="text-xl font-extrabold mt-1 tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 월별 매출 차트 */}
      <div className="card p-5 mb-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">월별 매출 (최근 6개월)</h2>
        <div className="space-y-3">
          {monthlyRevenue.map((m) => (
            <div key={m.label} className="flex items-center gap-3">
              <span className="w-8 text-xs text-slate-500 shrink-0 text-right">{m.label}</span>
              <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(m.revenue / maxRevenue) * 100}%` }}
                />
              </div>
              <span className="w-20 text-xs font-semibold tabular-nums text-right text-slate-700">
                {m.revenue > 0 ? fmtW(m.revenue) : "-"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 신규 계약 URL 생성 */}
      <div className="card mb-8">
        <div className="p-5 border-b text-lg font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" /> 신규 계약 URL 생성
        </div>
        <div className="p-5">
          <form onSubmit={createToken} className="flex gap-3 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
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
            <div className="w-28">
              <label className="text-sm text-slate-600 mb-1 block">
                위치 할인 (%)
              </label>
              <input
                type="number"
                className="input text-center"
                min={0}
                max={50}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
            <div className="w-28">
              <label className="text-sm text-slate-600 mb-1 block">
                프로모션 (%)
              </label>
              <input
                type="number"
                className="input text-center"
                min={0}
                max={50}
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
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
          <div className="flex gap-1 flex-wrap">
            <button
              className="text-xs px-2 py-1 rounded border border-orange-300 text-orange-700 hover:bg-orange-50 whitespace-nowrap"
              onClick={() => confirm("입금을 확인 처리하시겠습니까?") && confirmPayment(c.id)}
            >
              입금 확인
            </button>
            <button
              className="text-xs px-2 py-1 rounded border border-red-400 text-red-700 hover:bg-red-50 whitespace-nowrap"
              onClick={() => confirm("정말 계약을 취소하시겠습니까?") && cancelContract(c.id)}
            >
              계약 취소
            </button>
          </div>
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
              onClick={() => confirm("입금 확인을 취소하시겠습니까?") && revokePayment(c.id)}
            >
              입금 취소
            </button>
            <button
              className="text-xs px-2 py-1 rounded border border-red-400 text-red-700 hover:bg-red-50 whitespace-nowrap"
              onClick={() => confirm("정말 계약을 취소하시겠습니까?") && cancelContract(c.id)}
            >
              계약 취소
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
          <div className="flex gap-1 flex-wrap">
            <button
              className="text-xs px-2 py-1 rounded border border-yellow-300 text-yellow-700 hover:bg-yellow-50 whitespace-nowrap"
              onClick={() => unhold(c.id)}
            >
              보류 해제
            </button>
            <button
              className="text-xs px-2 py-1 rounded border border-red-400 text-red-700 hover:bg-red-50 whitespace-nowrap"
              onClick={() => confirm("정말 계약을 취소하시겠습니까?") && cancelContract(c.id)}
            >
              계약 취소
            </button>
          </div>
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

      {/* 취소됨 */}
      <ContractTable
        title="취소됨"
        dotColor="bg-red-400"
        contracts={cancelled}
        emptyText="취소된 계약이 없습니다."
        maxItems={3}
        viewAllHref="/admin/cancelled"
        action={(c) => (
          <button
            className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-50 whitespace-nowrap"
            onClick={() => restoreContract(c.id)}
          >
            복원
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
        {/* 모바일 카드 뷰 */}
        <div className="md:hidden divide-y">
          {unusedTokens.length === 0 && (
            <p className="px-4 py-6 text-center text-slate-500 text-sm">미사용 URL이 없습니다.</p>
          )}
          {activeTokens.map((t) => (
            <div key={t.id} className="px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm truncate">
                  {t.label || <span className="text-slate-400">-</span>}
                  {t.discount_percent > 0 && <span className="ml-1.5 text-xs text-red-600 font-medium">위치-{t.discount_percent}%</span>}
                  {t.promo_percent > 0 && <span className="ml-1.5 text-xs text-purple-600 font-medium">프로모션-{t.promo_percent}%</span>}
                </span>
                <span className="text-green-600 font-medium text-xs">{timeLeft(t.expires_at)}</span>
              </div>
              <p className="text-xs text-slate-500">{new Date(t.created_at).toLocaleString("ko-KR")}</p>
              <div className="flex gap-2">
                <button className="navlink text-xs" onClick={() => copyUrl(`${window.location.origin}/apply/${t.token}`)}>복사</button>
                <button className="text-xs px-2 py-1 rounded border border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => extendToken(t.id)}>연장</button>
                <button className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50" onClick={() => confirm("이 URL을 삭제하시겠습니까?") && deleteToken(t.id)}>폐기</button>
              </div>
            </div>
          ))}
          {expiredTokens.length > 0 && (
            <div className="px-4 py-2">
              <button className="text-xs text-slate-400 hover:text-slate-600" onClick={() => setShowExpired(!showExpired)}>
                {showExpired ? "▾" : "▸"} 만료된 URL ({expiredTokens.length}건)
              </button>
            </div>
          )}
          {showExpired && expiredTokens.map((t) => (
            <div key={t.id} className="px-4 py-3 opacity-60 space-y-1">
              <span className="text-sm text-slate-400">{t.label || "-"}</span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{new Date(t.created_at).toLocaleString("ko-KR")}</span>
                <button className="text-xs px-2 py-1 rounded border border-slate-300 text-slate-500 hover:bg-slate-100" onClick={() => confirm("이 URL을 삭제하시겠습니까?") && deleteToken(t.id)}>삭제</button>
              </div>
            </div>
          ))}
        </div>

        {/* 데스크톱 테이블 */}
        <table className="hidden md:table w-full text-sm">
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
                  {t.discount_percent > 0 && <span className="ml-1.5 text-xs text-red-600 font-medium">위치-{t.discount_percent}%</span>}
                  {t.promo_percent > 0 && <span className="ml-1.5 text-xs text-purple-600 font-medium">프로모션-{t.promo_percent}%</span>}
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
                  <div className="flex gap-2 flex-wrap">
                    <button
                      className="navlink text-xs"
                      onClick={() =>
                        copyUrl(`${window.location.origin}/apply/${t.token}`)
                      }
                    >
                      복사
                    </button>
                    <button
                      className="text-xs px-2 py-1 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 whitespace-nowrap"
                      onClick={() => extendToken(t.id)}
                    >
                      연장
                    </button>
                    <button
                      className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 whitespace-nowrap"
                      onClick={() => confirm("이 URL을 삭제하시겠습니까?") && deleteToken(t.id)}
                    >
                      폐기
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {expiredTokens.length > 0 && (
              <tr className="border-t">
                <td colSpan={4} className="px-4 py-2">
                  <button
                    className="text-xs text-slate-400 hover:text-slate-600"
                    onClick={() => setShowExpired(!showExpired)}
                  >
                    {showExpired ? "▾" : "▸"} 만료된 URL ({expiredTokens.length}건)
                  </button>
                </td>
              </tr>
            )}
            {showExpired && expiredTokens.map((t) => (
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
                    onClick={() => confirm("이 URL을 삭제하시겠습니까?") && deleteToken(t.id)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
