import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { DailyLeague } from "@/components/tournament/DailyLeague";
import { WeeklyQualification } from "@/components/tournament/WeeklyQualification";
import { ChampionshipBracket } from "@/components/tournament/ChampionshipBracket";
import { GlobalRankings } from "@/components/tournament/GlobalRankings";
import { RewardShowcase } from "@/components/tournament/RewardShowcase";
import { LiveFeed } from "@/components/tournament/LiveFeed";
import { SeasonProgress } from "@/components/tournament/SeasonProgress";

export const Route = createFileRoute("/tournaments")({
  head: () => ({
    meta: [
      { title: "Tournaments · Diamond Circuit — Cardium" },
      {
        name: "description",
        content:
          "The Diamond Circuit — Cardium's elite competitive league. Daily ladders, weekly qualification, monthly championship finals on Base.",
      },
      { property: "og:title", content: "Tournaments · Cardium Diamond Circuit" },
      {
        property: "og:description",
        content:
          "Esports-grade card tournaments — climb tiers from Bronze to Apex, qualify for the monthly championship, win 1-of-1 prestige rewards.",
      },
    ],
  }),
  component: TournamentsRoute,
});

function TournamentsRoute() {
  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      {/* Sub-header */}
      <header className="relative z-30 mx-auto flex max-w-[1400px] items-center justify-between px-6 pt-24 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Tournament Hub · S01
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
          <span className="size-1.5 animate-pulse rounded-full bg-cyan shadow-glow-cyan" />
          League active · 28 / 60
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-[1400px] px-6 pb-32">
        {/* Hero strip */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-surface/30 p-8 md:p-12"
        >
          <div className="absolute -right-32 -top-32 size-[28rem] rounded-full bg-violet/20 blur-3xl" />
          <div className="absolute -left-32 -bottom-32 size-[24rem] rounded-full bg-cyan/15 blur-3xl" />
          <div className="absolute inset-0 grid-noise opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
                Diamond Circuit · Genesis Open
              </p>
              <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
                Compete for the
                <br />
                <span className="bg-gradient-to-r from-violet via-violet to-cyan bg-clip-text text-transparent">
                  Champion ACE.
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                A 60-day competitive league. Climb six tiers, qualify weekly, and earn your seat at
                the cinematic monthly final. Only one operator walks away with the 1-of-1.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04] md:grid-cols-4">
              {[
                { label: "Active", value: "12,155" },
                { label: "Prize pool", value: "$184K" },
                { label: "Top 32 cut", value: "2,612" },
                { label: "Final · in", value: "32d 14h" },
              ].map((s) => (
                <div key={s.label} className="bg-surface/60 px-5 py-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="mt-1.5 font-display text-lg font-extrabold tabular-nums text-foreground">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Season timeline */}
        <div className="mt-8">
          <SeasonProgress />
        </div>

        {/* Qualification + Live */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <WeeklyQualification />
          <LiveFeed />
        </div>

        {/* Bracket */}
        <div className="mt-8">
          <ChampionshipBracket />
        </div>

        {/* Daily league + global */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <DailyLeague />
          <GlobalRankings />
        </div>

        {/* Rewards */}
        <div className="mt-8">
          <RewardShowcase />
        </div>
      </main>
    </div>
  );
}
