import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile · Kairos VII — Cardium" },
      {
        name: "description",
        content:
          "Your Cardium operator profile. Track collection completion, ranked ELO, treasury claim, and tournament history.",
      },
    ],
  }),
  component: ProfileRoute,
});

const stats = [
  { label: "Cards owned", value: "74 / 101" },
  { label: "Genesis sets", value: "0 complete" },
  { label: "Ranked ELO", value: "2,184" },
  { label: "Win rate", value: "67.4%" },
  { label: "Cards staked", value: "12" },
  { label: "Vault claim", value: "$0.00" },
];

const history = [
  { t: "12m", evt: "Pulled ACE · Kairos VII", tag: "Pack" },
  { t: "1h", evt: "Won duel vs Orin-Δ · +24 ELO", tag: "Arena" },
  { t: "3h", evt: "Outbid on ARC-022 ($1,840)", tag: "Market" },
  { t: "Yesterday", evt: "Registered · Void Invitational", tag: "Tournament" },
];

function ProfileRoute() {
  return (
    <div className="relative min-h-screen text-foreground">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-32 pt-28">
        {/* Identity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-surface/30 p-8 md:p-10"
        >
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-violet/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-cyan/15 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-8">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full bg-violet/30 blur-2xl" />
              <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-violet via-violet to-cyan ring-glow">
                <span className="font-display text-2xl font-black text-background">K7</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
                ● Operator · Diamond III
              </p>
              <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
                Kairos VII
              </h1>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                0x4F2B…81C · Joined S01 · Void faction
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/collection"
                className="rounded-sm border border-white/10 bg-surface px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground transition-colors hover:border-violet/40"
              >
                Open Binder
              </Link>
              <Link
                to="/arena"
                className="rounded-sm bg-violet px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground shadow-glow-violet"
              >
                Queue Ranked
              </Link>
            </div>
          </div>

          <div className="relative mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04] md:grid-cols-6">
            {stats.map((s) => (
              <div key={s.label} className="bg-surface/60 p-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-2 font-display text-xl font-extrabold tracking-tight">{s.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-surface/30 p-7">
            <h2 className="font-display text-lg font-bold tracking-tight">Recent activity</h2>
            <div className="mt-6 divide-y divide-white/[0.04]">
              {history.map((h) => (
                <div key={h.evt} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {h.t}
                    </p>
                    <p className="mt-1 text-sm text-foreground">{h.evt}</p>
                  </div>
                  <span className="rounded-sm border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    {h.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-surface/30 p-7">
            <h2 className="font-display text-lg font-bold tracking-tight">Season progression</h2>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Genesis · 73% complete
            </p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/[0.05]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "73%" }}
                transition={{ duration: 1.2, ease: [0.32, 0.72, 0, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-violet to-cyan"
              />
            </div>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Complete the Genesis set to unlock vault redemption. Missing 27 cards — including 2
              Legendary and 1 ACE slot.
            </p>
            <Link
              to="/market"
              className="mt-6 inline-flex rounded-sm border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-cyan transition-colors hover:bg-cyan hover:text-background"
            >
              Hunt missing cards →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
