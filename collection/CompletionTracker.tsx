import { motion } from "framer-motion";
import { collectionRarityStyles, rarityOrder, type RaritySectionData } from "./collectionData";

interface Props {
  sections: RaritySectionData[];
  totalOwned: number;
  totalCards: number;
}

/**
 * Sticky-style hero header showing live completion percentage, per-rarity
 * counters, and escalating messaging as the user nears 100%.
 */
export function CompletionTracker({ sections, totalOwned, totalCards }: Props) {
  const pct = (totalOwned / totalCards) * 100;
  const remaining = totalCards - totalOwned;
  const headline =
    remaining === 0
      ? "Genesis Set Complete."
      : remaining <= 5
        ? `Only ${remaining} cards remaining.`
        : remaining <= 20
          ? "Genesis Set nearly complete."
          : pct >= 50
            ? "Halfway through the Genesis vault."
            : "Your Genesis archive is forming.";

  const subline =
    remaining === 0
      ? "You are among the first archivists to seal the set."
      : remaining <= 5
        ? "Every remaining card is hunted. Pull, trade, or bid."
        : "Every pack pulled brings you closer to a sealed Genesis archive.";

  const aceOwned = sections.find((s) => s.rarity === "ACE")?.owned ?? 0;
  const promoOwned = sections.find((s) => s.rarity === "PROMO")?.owned ?? 0;

  return (
    <section className="relative mb-16 overflow-hidden rounded-2xl border border-border bg-surface/30 px-6 py-10 backdrop-blur-xl md:px-10 md:py-14">
      {/* Ambient halo */}
      <div className="pointer-events-none absolute -left-40 top-1/2 size-[600px] -translate-y-1/2 rounded-full bg-violet/15 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 -top-20 size-[500px] rounded-full bg-cyan/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

      <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan">
            Genesis Archive · Season 01
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
            className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-5xl"
          >
            {headline}
          </motion.h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{subline}</p>

          {/* Big progress */}
          <div className="mt-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Completion
                </p>
                <p className="mt-1 font-display text-5xl font-extrabold tracking-tighter md:text-6xl">
                  {pct.toFixed(1)}
                  <span className="text-2xl text-muted-foreground">%</span>
                </p>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {totalOwned} / {totalCards} cards
              </p>
            </div>
            <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-border">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: pct / 100 }}
                transition={{ duration: 1.6, ease: [0.32, 0.72, 0, 1] }}
                style={{ transformOrigin: "0% 50%" }}
                className="h-full bg-gradient-to-r from-cyan via-cyan to-violet shadow-glow-violet"
              />
            </div>
          </div>
        </div>

        {/* Right column — rarity counters */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
          {rarityOrder.map((r) => {
            const s = sections.find((x) => x.rarity === r)!;
            const v = collectionRarityStyles[r];
            const done = s.owned === s.total;
            return (
              <div key={r} className="bg-surface/60 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[9px] uppercase tracking-[0.25em] ${v.textClass}`}>
                    {v.label}
                  </span>
                  {done && <span className="size-1.5 rounded-full bg-cyan shadow-glow-cyan" />}
                </div>
                <p className="mt-1 font-mono text-[11px] text-foreground/80">
                  {s.owned} <span className="text-muted-foreground">/ {s.total}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prestige row */}
      <div className="relative mt-10 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-border/50 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <span>
          <span className="text-violet">ACE</span> owned · <span className="text-foreground">{aceOwned}</span>
        </span>
        <span>
          <span className="text-cyan">PROMO</span> owned · <span className="text-foreground">{promoOwned}</span>
        </span>
        <span>
          Sections complete ·{" "}
          <span className="text-foreground">
            {sections.filter((s) => s.owned === s.total).length} / {sections.length}
          </span>
        </span>
        <span>
          Vault ID · <span className="text-foreground">VLT-0001-GEN</span>
        </span>
      </div>
    </section>
  );
}
