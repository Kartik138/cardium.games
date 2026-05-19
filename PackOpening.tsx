import { motion } from "framer-motion";
import boosterPack from "@/assets/booster-pack.jpg";

export function PackOpening() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface/40 px-6 py-32">
      <div className="pointer-events-none absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-violet/15 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-20 md:grid-cols-2">
        <div className="space-y-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
            The Pack Experience
          </p>
          <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl">
            Suspense in every
            <br />
            micro-tear.
          </h2>
          <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground">
            Opening a Cardium booster is a ritual. Holographic light leaks, cinematic flips, and
            explosive celebration for legendary pulls. Designed to be witnessed and streamed.
          </p>
          <ul className="space-y-3">
            {[
              "Guaranteed Rare+ in every Genesis pack",
              "Animated reveal sequences per rarity tier",
              "1-in-12,000 chance for ACE Masterwork",
            ].map((b) => (
              <li key={b} className="flex items-center gap-3 text-sm text-foreground/80">
                <span className="size-1 rounded-full bg-violet shadow-glow-violet" />
                {b}
              </li>
            ))}
          </ul>
          <button className="group flex items-center gap-3 border-b border-violet/40 pb-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-violet">
            Preview the reveal
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
          className="relative"
        >
          <div className="relative aspect-square overflow-hidden rounded-2xl ring-1 ring-border ring-glow">
            <img
              src={boosterPack}
              alt="Sealed Genesis booster pack inside a black-glass vault"
              loading="lazy"
              width={900}
              height={900}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 holo-foil opacity-60" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  Sealed
                </p>
                <p className="font-display text-lg font-bold">Genesis Booster · S01</p>
              </div>
              <p className="font-mono text-xs text-violet">12,000 / 12,000</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
