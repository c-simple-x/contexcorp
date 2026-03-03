export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-slate-900 text-white">
      <div className="container h-14 flex items-center justify-between">
        <a href="/admin" className="font-extrabold tracking-tight text-white">
          CONTEX <span className="font-semibold opacity-50">Admin</span>
        </a>
        <a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
          ← 홈페이지
        </a>
      </div>
    </header>
  );
}
