"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#solutions", label: "Use Cases" },
  { href: "/#showcase", label: "AR Preview" },
  { href: "/#cases", label: "Examples" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#process", label: "Process" },
  { href: "/#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="container h-16 flex items-center justify-between">
        <a href="/" className="font-extrabold tracking-tight">
          CONTEX <span className="font-semibold opacity-70">Corp.</span>
        </a>

        {/* 데스크탑 nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {NAV_LINKS.map((link) => (
            <a key={link.href} className="navlink" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="메뉴 열기"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {open && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur">
          <nav className="container py-3 flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="navlink py-3 text-sm border-b last:border-b-0"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
