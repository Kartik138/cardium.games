import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { liveFeed } from "./tournamentData";

const typeStyle: Record<string, { dot: string; label: string }> = {
  win: { dot: "bg-cyan shadow-glow-cyan", label: "Match" },
  promo: { dot: "bg-violet shadow-glow-violet", label: "Promotion" },
  streak: { dot: "bg-cyan", label: "Streak" },
  qualify: { dot: "bg-violet", label: "Cut-off" },
  match: { dot: "bg-destructive animate-pulse", label: "Live" },
  drop: { dot: "bg-destructive", label: "Demotion" },
};

export function LiveFeed() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setIndex((n) => (n + 1) % liveFeed.length), 3500);
    return () => clearInterval(i);
  }, []);

  const window = [0, 1, 2, 3].map((o) => liveFeed[(index + o) % liveFeed.length]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/30 p-7">
      <div className="absolute -left-10 -bottom-10 size-48 rounded-full bg-cyan/15 blur-3xl" />

      <div className="relative flex items-end justify-between">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
            <span className="size-1.5 animate-pulse rounded-full bg-cyan shadow-glow-cyan" />
            Live activity
          </p>
          <h3 className="mt-2 font-display text-xl font-extrabold tracking-tight">
            League pulse
          </h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {liveFeed.length} events / min
        </span>
      </div>

      <div className="relative mt-6 space-y-2">
        <AnimatePresence initial={false}>
          {window.map((evt, i) => {
            const style = typeStyle[evt.type] ?? typeStyle.win;
            return (
              <motion.div
                key={`${index}-${i}-${evt.text}`}
                layout
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{
                  opacity: i === 0 ? 1 : 0.92 - i * 0.18,
                  y: 0,
                  scale: 1,
                }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                className="flex items-center gap-3 rounded-md border border-white/[0.04] bg-background/40 px-4 py-3 backdrop-blur"
              >
                <span className={`size-1.5 shrink-0 rounded-full ${style.dot}`} />
                <span className="hidden w-20 shrink-0 font-mono text-[9px] uppercase tracking-widest text-muted-foreground md:inline">
                  {style.label}
                </span>
                <span className="flex-1 truncate text-sm text-foreground">{evt.text}</span>
                <span className="hidden font-mono text-[9px] uppercase tracking-widest text-muted-foreground md:inline">
                  {i === 0 ? "now" : `${i * 4}s`}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
