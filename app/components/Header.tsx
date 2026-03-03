export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="container h-16 flex items-center justify-between">
        <a href="/" className="font-extrabold tracking-tight">
          CONTEX <span className="font-semibold opacity-70">Corp.</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          <a className="navlink" href="/#solutions">활용 대상</a>
          <a className="navlink" href="/#showcase">AR 미리보기</a>
          <a className="navlink" href="/#cases">실제 사례</a>
          <a className="navlink" href="/#pricing">요금</a>
          <a className="navlink" href="/#process">진행 절차</a>
          <a className="navlink" href="/#contact">문의</a>
        </nav>
      </div>
    </header>
  );
}
