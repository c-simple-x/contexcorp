"use client";

import { House } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/prepayment", label: "입금확인전" },
  { href: "/admin/inprogress", label: "진행중" },
  { href: "/admin/onhold", label: "보류" },
  { href: "/admin/completed", label: "종료됨" },
  { href: "/admin/contracts", label: "전체 계약" },
  { href: "/admin/products", label: "상품·금액" },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(!!sessionStorage.getItem("admin_secret"));

    function sync() {
      setAuthed(!!sessionStorage.getItem("admin_secret"));
    }
    window.addEventListener("adminAuthChange", sync);
    return () => window.removeEventListener("adminAuthChange", sync);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-slate-900 text-white">
      <div className="container h-14 flex items-center gap-6">
        <a href="/admin" className="font-extrabold tracking-tight text-white shrink-0">
          CONTEX <span className="font-semibold opacity-50">Admin</span>
        </a>
        {authed && (
          <nav className="flex items-center gap-1 flex-1 overflow-x-auto">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-slate-700 text-white font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        )}
        <a
          href="/"
          className="ml-auto text-slate-400 hover:text-white transition-colors shrink-0"
          title="홈으로"
        >
          <House className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
