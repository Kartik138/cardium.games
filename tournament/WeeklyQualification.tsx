import { motion } from "framer-motion";

const userElo = 2684;
const qualifyAt = 2612;
const masterAt = 2800;
const apexAt = 3100;
const max = 3300;
const userPct = (userElo / max) * 100;
const qualifyPct = (qualifyAt / max) * 100;
const masterPct = (masterAt / max) * 100;
const apexPct = (apexAt / max) * 100;

export function WeeklyQualification() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/30 p-7">
      <div className="absolute -right-10 -top-10 size-48 rounded-full bg-violet/20 blur-3xl" />

      <div className="relative flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
            Weekly Qualification · S01 W04
          </p>
          <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
            You are <span className="text-cyan">In</span> the Top 32
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Hold position for <span className="font-mono text-foreground">2d 14h</span> to lock your
            Championship slot.
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Your ELO
          </p>
          <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-foreground">
            {userElo.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bar */}
      <div className="relative mt-10 h-12">
        {/* Track */}
        <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-white/[0.04]">
          {/* Bronze zone */}
          <div className="absolute inset-y-0 left-0 bg-[oklch(0.55_0.1_45)]/30" style={{ width: `${qualifyPct}%` }} />
          {/* Diamond qualify zone */}
          <div className="absolute inset-y-0 bg-cyan/30" style={{ left: `${qualifyPct}%`, width: `${masterPct - qualifyPct}%` }} />
          {/* Master zone */}
          <div className="absolute inset-y-0 bg-violet/40" style={{ left: `${masterPct}%`, width: `${apexPct - masterPct}%` }} />
          {/* Apex zone */}
          <div className="absolute inset-y-0 right-0 bg-gradient-to-r from-violet to-cyan" style={{ left: `${apexPct}%` }} />
        </div>

        {/* Threshold labels */}
        {[
          { x: qualifyPct, label: "Top 32", val: qualifyAt },
          { x: masterPct, label: "Master", val: masterAt },
          { x: apexPct, label: "Apex", val: apexAt },
        ].map((m) => (
          <div
            key={m.label}
            className="absolute -translate-x-1/2"
            style={{ left: `${m.x}%`, top: 0 }}
          >
            <div className="mx-auto h-3 w-px bg-white/30" />
            <p className="mt-1 whitespace-nowrap font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              {m.label}
            </p>
            <p className="text-center font-mono text-[9px] tabular-nums text-muted-foreground/60">
              {m.val}
            </p>
          </div>
        ))}

        {/* You marker */}
        <motion.div
          initial={{ left: 0, opacity: 0 }}
          animate={{ left: `${userPct}%`, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-violet/40 blur-lg" />
            <div className="relative size-5 rounded-full border-2 border-foreground bg-violet shadow-glow-violet" />
            <div className="absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap rounded-sm border border-violet/40 bg-background/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-violet backdrop-blur">
              You · #07
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04] md:grid-cols-4">
        {[
          { label: "Cut-off ELO", value: qualifyAt.toLocaleString() },
          { label: "Buffer", value: `+${userElo - qualifyAt}` },
          { label: "Matches today", value: "8 · 6W 2L" },
          { label: "Projection", value: "Top 14", accent: true },
        ].map((s) => (
          <div key={s.label} className="bg-surface/60 px-5 py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
              {s.label}
            </p>
            <p
              className={`mt-1.5 font-display text-lg font-bold tabular-nums ${
                s.accent ? "text-cyan" : "text-foreground"
              }`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
