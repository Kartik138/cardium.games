import { motion } from "framer-motion";
import { seasonRewards } from "./tournamentData";
import aceCard from "@/assets/ace-card.jpg";

export function RewardShowcase() {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/30">
      <div className="flex items-end justify-between border-b border-white/[0.06] px-6 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
            Championship Vault
          </p>
          <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight">
            Season rewards
          </h3>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Distributed on S01 close
        </p>
      </div>

      <div className="grid gap-px bg-white/[0.04] md:grid-cols-2">
        {/* Headline 1-of-1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="relative row-span-2 overflow-hidden bg-surface/60 p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.66_0.23_295/0.35),transparent_60%)]" />
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-violet/30 blur-3xl" />
          <div className="relative flex flex-col items-center text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
              Apex · 1st place
            </p>
            <h4 className="mt-3 font-display text-3xl font-extrabold tracking-tight">
              1-of-1 Championship ACE
            </h4>
            <motion.div
              animate={{ y: [0, -8, 0], rotateZ: [-1, 1, -1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="relative mt-8 [perspective:1500px]"
            >
              <div className="absolute -inset-8 rounded-[2rem] bg-violet/30 blur-3xl" />
              <div className="relative aspect-[5/7] w-[220px] overflow-hidden rounded-xl border border-violet/40 ring-glow">
                <img src={aceCard} alt="Championship ACE reward" className="size-full object-cover" />
                <div className="absolute inset-0 holo-foil" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-3">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-violet">
                    Champion · S01
                  </p>
                  <p className="font-display text-sm font-extrabold">UNIQUE · 001/001</p>
                </div>
                <div className="absolute right-2 top-2 rounded-sm border border-white/20 bg-background/60 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-foreground backdrop-blur">
                  Apex
                </div>
              </div>
            </motion.div>
            <p className="mt-6 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Custom holographic art. Permanent etching on the Cardium leaderboard wall. Non-tradeable
              prestige.
            </p>
          </div>
        </motion.div>

        {/* Tier rewards */}
        {seasonRewards.slice(1).map((r, i) => (
          <motion.div
            key={r.tier}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
            className="relative overflow-hidden bg-surface/60 p-7"
          >
            <div className="flex items-start justify-between">
              <p
                className={`font-mono text-[10px] uppercase tracking-[0.3em] ${
                  r.glow === "violet" ? "text-violet" : r.glow === "cyan" ? "text-cyan" : "text-muted-foreground"
                }`}
              >
                {r.tier}
              </p>
              <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Top {i === 0 ? "4" : i === 1 ? "12" : "32"}
              </span>
            </div>
            <h4 className="mt-3 font-display text-lg font-extrabold tracking-tight">{r.reward}</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
