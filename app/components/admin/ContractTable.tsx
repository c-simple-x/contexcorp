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
      <div className="p-5 border-b text-lg font-semibold flex items-center gap-2">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${dotColor}`} />
        {title}
        <span className="text-sm font-normal text-slate-500">
          ({contracts.length}건)
        </span>
        {viewAllHref && (
          <a
            href={viewAllHref}
            className="ml-auto text-xs text-blue-600 hover:underline font-normal"
          >
            전체 보기 →
          </a>
        )}
      </div>
      <table className="w-full text-sm">
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
          {contracts.length === 0 && (
            <tr>
              <td
                colSpan={action ? 5 : 4}
                className="px-4 py-6 text-center text-slate-500"
              >
                {emptyText}
              </td>
            </tr>
          )}
          {shown.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-3">
                {c.client?.company ? `${c.client.company} ` : ""}
                {c.client?.name ? `(${c.client.name})` : c.title}
              </td>
              <td className="px-4 py-3">₩{fmt(c.price ?? 0)}</td>
              <td className="px-4 py-3">
                {new Date(c.created_at).toLocaleString("ko-KR")}
              </td>
              <td className="px-4 py-3">
                <a href={`/contracts/${c.id}`} className="navlink text-xs">
                  열기 →
                </a>
              </td>
              {action && <td className="px-4 py-3">{action(c)}</td>}
            </tr>
          ))}
          {hasMore && viewAllHref && (
            <tr className="border-t bg-slate-50">
              <td
                colSpan={action ? 5 : 4}
                className="px-4 py-3 text-center text-xs text-slate-500"
              >
                외 {contracts.length - maxItems!}건 —{" "}
                <a href={viewAllHref} className="text-blue-600 hover:underline">
                  전체 보기
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
