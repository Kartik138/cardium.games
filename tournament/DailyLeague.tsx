import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlayerRow } from "./PlayerRow";
import { buildLeaderboard, type Player } from "./tournamentData";

function shuffleMovement(prev: Player[]): Player[] {
  // Subtle re-rank: swap two adjacent players occasionally
  const next = [...prev];
  const i = 3 + Math.floor(Math.random() * 6);
  const j = i + (Math.random() > 0.5 ? 1 : -1);
  if (next[i] && next[j]) {
    const a = { ...next[i], rank: next[j].rank, movement: next[j].rank - next[i].rank };
    const b = { ...next[j], rank: next[i].rank, movement: next[i].rank - next[j].rank };
    next[i] = b;
    next[j] = a;
    next.sort((p, q) => p.rank - q.rank);
  }
  return next;
}

export function DailyLeague() {
  const initial = useMemo(() => buildLeaderboard(1), []);
  const [players, setPlayers] = useState<Player[]>(initial);
  const [resetSecs, setResetSecs] = useState(8 * 3600 + 24 * 60 + 12);

  useEffect(() => {
    const tick = setInterval(() => setResetSecs((s) => Math.max(0, s - 1)), 1000);
    const churn = setInterval(() => setPlayers((p) => shuffleMovement(p)), 4500);
    return () => {
      clearInterval(tick);
      clearInterval(churn);
    };
  }, []);

  const h = Math.floor(resetSecs / 3600);
  const m = Math.floor((resetSecs % 3600) / 60);
  const s = resetSecs % 60;

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/30">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-white/[0.06] px-6 py-5">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
            <span className="size-1.5 animate-pulse rounded-full bg-cyan shadow-glow-cyan" />
            Daily League · Live
          </p>
          <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight">Today's Ladder</h3>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Resets in</p>
          <p className="mt-1 font-display text-xl font-bold tabular-nums text-foreground">
            {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
          </p>
        </div>
      </div>

      {/* Column header */}
      <div className="hidden grid-cols-[44px_1fr_72px_80px_72px_60px] gap-4 border-b border-white/[0.04] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground md:grid">
        <span>#</span>
        <span>Operator</span>
        <span>Tier</span>
        <span className="text-right">ELO</span>
        <span className="text-right">W / L</span>
        <span className="text-right">Streak</span>
      </div>

      {/* Rows */}
      <div className="max-h-[600px] divide-y divide-white/[0.04] overflow-y-auto">
        <AnimatePresence initial={false}>
          {players.slice(0, 14).map((p, i) => (
            <PlayerRow key={p.handle} player={p} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
