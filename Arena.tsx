import { motion } from "framer-motion";
import arenaImg from "@/assets/arena.jpg";

export function Arena() {
  return (
    <section className="px-6 py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative order-2 md:order-1"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-border ring-glow">
            <img
              src={arenaImg}
              alt="Cardium PvP arena — two cards clashing"
              loading="lazy"
              width={1200}
              height={900}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-border bg-background/80 p-4 backdrop-blur-xl md:block">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full border border-violet/40 bg-violet/10 font-mono text-xs font-bold text-violet">
                VS
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  Live Match
                </p>
                <p className="font-display text-sm font-bold">PRODIGY vs EXARCH</p>
              </div>
              <div className="ml-6 font-mono text-xs tabular-nums text-cyan">02:14</div>
            </div>
          </div>
        </motion.div>

        <div className="order-1 space-y-8 md:order-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
            Competitive Arena
          </p>
          <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight">
            Nexus-Link tactical combat.
          </h2>
          <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
            Esports-grade prediction battles where deck synergy and read-the-meta timing decide the
            round. Stake cards. Earn cards. Climb the seasonal ladder.
          </p>
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
            {[
              { k: "Modes", v: "Ranked · Casual · Tournament" },
              { k: "Stake", v: "Card-for-Card" },
              { k: "Season", v: "S01 · 42 days left" },
            ].map((s) => (
              <div key={s.k} className="bg-background p-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  {s.k}
                </p>
                <p className="mt-1 font-display text-sm font-semibold">{s.v}</p>
              </div>
            ))}
          </div>
          <button className="rounded-sm border border-border bg-surface px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-violet hover:text-foreground">
            Explore Combat Logic
          </button>
        </div>
      </div>
    </section>
  );
}
