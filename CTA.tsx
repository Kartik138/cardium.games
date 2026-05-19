export function CTA() {
  return (
    <section className="relative overflow-hidden px-6 py-40">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/20 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-balance md:text-7xl">
          The archive awaits
          <br />
          <span className="bg-gradient-to-b from-violet to-cyan bg-clip-text text-transparent">
            your arrival.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-pretty text-base text-muted-foreground">
          Join 40,000+ collectors building the most valuable card economy on Base.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <button className="rounded-sm bg-violet px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-widest shadow-glow-violet transition-transform hover:scale-[1.02]">
            Enter the Vault
          </button>
          <button className="rounded-sm border border-border bg-surface/40 px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-surface">
            Read Whitepaper
          </button>
        </div>
      </div>
    </section>
  );
}
