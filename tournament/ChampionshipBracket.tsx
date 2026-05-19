import { motion } from "framer-motion";
import { buildBracket, tierStyles } from "./tournamentData";

const rounds = buildBracket();

function MatchCard({ match, idx }: { match: ReturnType<typeof buildBracket>[number]["matches"][number]; idx: number }) {
  const a = match.a;
  const b = match.b;
  const aWin = a && b && a.score > b.score;
  const bWin = a && b && b.score > a.score;

  const border =
    match.status === "live"
      ? "border-cyan/50 shadow-glow-cyan"
      : match.status === "done"
        ? "border-white/[0.08]"
        : "border-white/[0.05] border-dashed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.32, 0.72, 0, 1] }}
      className={`relative overflow-hidden rounded-lg border bg-surface/40 ${border}`}
    >
      {match.status === "live" && (
        <div className="absolute right-2 top-2 flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-cyan">
          <span className="size-1 animate-pulse rounded-full bg-cyan" />
          live
        </div>
      )}
      {[
        { side: a, win: aWin },
        { side: b, win: bWin },
      ].map((row, i) => {
        const player = row.side;
        if (!player) {
          return (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40"
            >
              TBD
            </div>
          );
        }
        const s = tierStyles[player.tier];
        return (
          <div
            key={i}
            className={`flex items-center justify-between gap-2 border-white/[0.04] px-3 py-2.5 ${
              i === 0 ? "border-b" : ""
            } ${row.win ? "bg-violet/8" : ""}`}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className={`size-1.5 shrink-0 rounded-full ${row.win ? "bg-violet shadow-glow-violet" : "bg-white/15"}`} />
              <span className={`truncate font-mono text-[11px] font-semibold uppercase tracking-wider ${row.win ? "text-foreground" : "text-muted-foreground"}`}>
                {player.handle}
              </span>
              <span className={`hidden rounded-sm border px-1.5 py-0 font-mono text-[8px] uppercase tracking-widest md:inline-block ${s.border} ${s.text}`}>
                {player.tier}
              </span>
            </div>
            <span
              className={`font-display text-base font-bold tabular-nums ${
                row.win ? "text-violet" : "text-muted-foreground"
              }`}
            >
              {player.score}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}

export function ChampionshipBracket() {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/30">
      <div className="flex items-end justify-between border-b border-white/[0.06] px-6 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
            Monthly Championship · S01 M01
          </p>
          <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
            Genesis Open · Bracket
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Top 32 entrants. Best of 7. Finals broadcast inside the Arena chamber.
          </p>
        </div>
        <button className="hidden rounded-sm border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan transition-colors hover:bg-cyan hover:text-background md:inline-block">
          Watch live →
        </button>
      </div>

      <div className="relative overflow-x-auto px-6 py-8">
        <div className="grid min-w-[760px] grid-cols-3 gap-6 md:gap-10">
          {rounds.map((round) => (
            <div key={round.name} className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {round.name}
              </p>
              <div
                className={`flex flex-col gap-4 ${
                  round.name === "Semifinals" ? "justify-around pt-8" : round.name === "Finals" ? "justify-center pt-24" : ""
                } h-full`}
              >
                {round.matches.map((m, i) => (
                  <MatchCard key={m.id} match={m} idx={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
