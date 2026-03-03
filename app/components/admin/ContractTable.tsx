"use client";

import { ContractRow } from "@/app/admin/_hooks";

function fmt(n: number) {
  return new Intl.NumberFormat("ko-KR").format(n);
}

type Props = {
  title: string;
  dotColor: string;
  contracts: ContractRow[];
  emptyText: string;
  maxItems?: number;
  viewAllHref?: string;
  action?: (c: ContractRow) => React.ReactNode;
};

export default function ContractTable({
  title,
  dotColor,
  contracts,
  emptyText,
  maxItems,
  viewAllHref,
  action,
}: Props) {
  const shown = maxItems ? contracts.slice(0, maxItems) : contracts;
  const hasMore = maxItems ? contracts.length > maxItems : false;

  return (
    <div className="card overflow-hidden mb-8">
      {/* 헤더 */}
      <div className="p-4 sm:p-5 border-b text-lg font-semibold flex items-center gap-2">
        <span className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${dotColor}`} />
        {title}
        <span className="text-sm font-normal text-slate-500">({contracts.length}건)</span>
        {viewAllHref && (
          <a href={viewAllHref} className="ml-auto text-xs text-blue-600 hover:underline font-normal whitespace-nowrap">
            전체 보기 →
          </a>
        )}
      </div>

      {contracts.length === 0 ? (
        <p className="px-4 py-6 text-center text-slate-500 text-sm">{emptyText}</p>
      ) : (
        <>
          {/* 모바일: 카드 목록 */}
          <ul className="md:hidden divide-y">
            {shown.map((c) => (
              <li key={c.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-sm leading-snug">
                    {c.client?.company
                      ? `${c.client.company}${c.client.name ? ` (${c.client.name})` : ""}`
                      : c.client?.name ?? c.title}
                  </span>
                  <span className="tabular-nums text-sm font-bold text-blue-700 shrink-0">
                    ₩{fmt(c.price ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs text-slate-400">
                    {new Date(c.created_at).toLocaleString("ko-KR")}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`/contracts/${c.id}`} className="navlink text-xs">
                      열기 →
                    </a>
                    {action && action(c)}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* 데스크탑: 테이블 */}
          <table className="hidden md:table w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3">고객</th>
                <th className="text-left px-4 py-3">금액</th>
                <th className="text-left px-4 py-3">생성일</th>
                <th className="text-left px-4 py-3">보기</th>
                {action && <th className="text-left px-4 py-3">액션</th>}
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3">
                    {c.client?.company ? `${c.client.company} ` : ""}
                    {c.client?.name ? `(${c.client.name})` : c.title}
                  </td>
                  <td className="px-4 py-3 tabular-nums">₩{fmt(c.price ?? 0)}</td>
                  <td className="px-4 py-3">
                    {new Date(c.created_at).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-4 py-3">
                    <a href={`/contracts/${c.id}`} className="navlink text-xs">열기 →</a>
                  </td>
                  {action && <td className="px-4 py-3">{action(c)}</td>}
                </tr>
              ))}
            </tbody>
          </table>

          {/* 더 보기 푸터 */}
          {hasMore && viewAllHref && (
            <div className="border-t bg-slate-50 px-4 py-3 text-center text-xs text-slate-500">
              외 {contracts.length - maxItems!}건 —{" "}
              <a href={viewAllHref} className="text-blue-600 hover:underline">전체 보기</a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
