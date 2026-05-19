import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import aceCard from "@/assets/ace-card.jpg";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-32 pb-20">
      <div className="absolute inset-0 grid-noise opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-[140px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 mb-16 text-center"
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 backdrop-blur">
          <span className="size-1.5 animate-pulse rounded-full bg-violet shadow-glow-violet" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Season 01 — Genesis Origin
          </span>
        </div>
        <h1 className="font-display text-6xl font-extrabold leading-[0.9] tracking-tight text-balance md:text-8xl">
          Collect. Battle.
          <br />
          <span className="bg-gradient-to-b from-violet via-violet to-cyan bg-clip-text text-transparent">
            Redeem.
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          A production-grade collectible card ecosystem for the competitive elite. Open cinematic
          packs, stake cards in tactical PvP, and redeem complete sets from the protocol vault.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/open-box"
            className="group inline-flex items-center gap-2 rounded-sm bg-violet px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-foreground shadow-glow-violet transition-transform hover:scale-[1.02]"
          >
            Enter Cardium
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
          <a
            href="#how"
            className="rounded-sm border border-border bg-surface/40 px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            How it works
          </a>
        </div>
      </motion.div>

      {/* Hero ACE card */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotateX: 20 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
        className="relative z-10 [perspective:1500px]"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="group relative w-[280px] md:w-[340px]"
        >
          <div className="absolute -inset-10 rounded-[2rem] bg-violet/25 blur-[80px]" />
          <div className="relative aspect-[5/7] overflow-hidden rounded-2xl ring-1 ring-white/15 ring-glow">
            <img
              src={aceCard}
              alt="ACE rarity Cardium card — legendary futuristic warrior"
              width={680}
              height={952}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 holo-foil" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-background via-background/60 to-transparent p-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-violet">
                  Void Faction
                </p>
                <h3 className="font-display text-lg font-bold tracking-tight">KAIROS VII</h3>
              </div>
              <div className="flex size-10 items-center justify-center rounded-full border border-violet/40 bg-background/60 font-mono text-xs font-semibold text-violet backdrop-blur">
                9.8
              </div>
            </div>
            <div className="absolute right-3 top-3 rounded-sm border border-white/20 bg-background/60 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-foreground backdrop-blur">
              ACE · 001
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
