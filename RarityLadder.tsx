import { motion } from "framer-motion";

const tiers = [
  { name: "Common", code: "C", tone: "bg-surface ring-border" },
  { name: "Rare", code: "R", tone: "bg-surface ring-white/20" },
  { name: "Art Rare", code: "AR", tone: "bg-surface ring-cyan/30", shimmer: true },
  { name: "Special Art", code: "SAR", tone: "bg-surface-2 ring-cyan/40", shimmer: true },
  { name: "Super Rare", code: "SR", tone: "bg-surface-2 ring-violet/40", shimmer: true },
  { name: "Ultra Rare", code: "UR", tone: "bg-violet/10 ring-violet/60 shadow-glow-violet", shimmer: true },
  { name: "ACE", code: "ACE", tone: "bg-violet/15 ring-violet shadow-glow-violet", shimmer: true, elite: true },
  { name: "PROMO", code: "P", tone: "bg-cyan/10 ring-cyan shadow-glow-cyan", shimmer: true, elite: true },
];

export function RarityLadder() {
  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-end justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
              Visual Tiering
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Rarity Ascension
            </h2>
          </div>
          <p className="hidden max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground md:block">
            Each tier introduces unique foils, frame mechanics, and reveal cinematics. ACE and
            PROMO carry prestige presentation reserved for the elite.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`group space-y-3 ${t.elite ? "md:-translate-y-2" : ""}`}
            >
              <div
                className={`relative aspect-[5/7] overflow-hidden rounded-lg ring-1 ${t.tone} transition-transform duration-500 group-hover:-translate-y-1`}
              >
                {t.shimmer && <div className="absolute inset-0 holo-foil" />}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-foreground/70">
                    {t.code}
                  </span>
                </div>
              </div>
              <p
                className={`text-center font-mono text-[10px] uppercase tracking-widest ${
                  t.elite ? "text-violet" : "text-muted-foreground"
                }`}
              >
                {t.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
