import { motion } from "framer-motion";
import { tierStyles, type Tier } from "./tournamentData";

const tiers: { tier: Tier; pct: string; players: string; eloMin: number }[] = [
  { tier: "Apex", pct: "0.1%", players: "12", eloMin: 3100 },
  { tier: "Master", pct: "1.2%", players: "148", eloMin: 2800 },
  { tier: "Diamond", pct: "4.8%", players: "584", eloMin: 2600 },
  { tier: "Gold", pct: "14.2%", players: "1,724", eloMin: 2200 },
  { tier: "Silver", pct: "32.4%", players: "3,938", eloMin: 1700 },
  { tier: "Bronze", pct: "47.3%", players: "5,749", eloMin: 1000 },
];

export function GlobalRankings() {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/30">
      <div className="flex items-end justify-between border-b border-white/[0.06] px-6 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Global Rankings · S01
          </p>
          <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight">Tier distribution</h3>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
          12,155 operators
        </p>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {tiers.map((t, i) => {
          const s = tierStyles[t.tier];
          const isYou = t.tier === "Diamond";
          return (
            <motion.div
              key={t.tier}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`group relative grid grid-cols-[44px_1fr_80px_80px] items-center gap-4 px-6 py-5 transition-colors hover:bg-white/[0.02] ${
                isYou ? "bg-cyan/[0.04]" : ""
              }`}
            >
              <div
                className={`flex size-10 items-center justify-center rounded-md border ${s.border} ${s.bg} ${s.glow}`}
              >
                <span className={`font-display text-sm font-black ${s.text}`}>
                  {t.tier.charAt(0)}
                </span>
              </div>
              <div>
                <p className={`font-display text-sm font-bold uppercase tracking-wider ${s.text}`}>
                  {t.tier}
                  {isYou && <span className="ml-2 font-mono text-[10px] text-cyan">· you</span>}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  ELO ≥ {t.eloMin.toLocaleString()}
                </p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: t.pct }}
                    transition={{ duration: 1, delay: 0.2 + i * 0.06, ease: [0.32, 0.72, 0, 1] }}
                    className={`h-full ${
                      t.tier === "Apex"
                        ? "bg-gradient-to-r from-violet to-cyan"
                        : t.tier === "Master"
                          ? "bg-violet"
                          : t.tier === "Diamond"
                            ? "bg-cyan"
                            : "bg-white/30"
                    }`}
                  />
                </div>
              </div>
              <p className="text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                {t.pct}
              </p>
              <p className="text-right font-display text-sm font-bold tabular-nums text-foreground">
                {t.players}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
