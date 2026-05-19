export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-4">
          <span className="font-display text-base font-extrabold uppercase tracking-tighter">
            <span>Card</span><span className="text-violet">ium</span>
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            © 2026 · Genesis Protocol · Built on Base
          </span>
        </div>
        <div className="flex gap-8">
          {["Twitter", "Discord", "Docs", "Terms"].map((l) => (
            <a
              key={l}
              href="#"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
