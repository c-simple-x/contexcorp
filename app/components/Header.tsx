export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="container h-16 flex items-center justify-between">
        <a href="/" className="font-extrabold tracking-tight">
          CONTEX <span className="font-semibold opacity-70">Corp.</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          <a className="navlink" href="/#solutions">Use Cases</a>
          <a className="navlink" href="/#showcase">AR Preview</a>
          <a className="navlink" href="/#cases">Examples</a>
          <a className="navlink" href="/#pricing">Pricing</a>
          <a className="navlink" href="/#process">Process</a>
          <a className="navlink" href="/#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
