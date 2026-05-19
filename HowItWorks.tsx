import { motion } from "framer-motion";

const steps = [
  {
    n: "01",
    title: "Acquire Packs",
    body: "Purchase limited-run Genesis boosters. Every pull is a verifiable on-chain reveal with cinematic suspense.",
  },
  {
    n: "02",
    title: "Forge Decks",
    body: "Synthesize factions and rarities into a competitive roster. Scarcity drives the seasonal meta.",
  },
  {
    n: "03",
    title: "Redeem Value",
    body: "Burn complete sets for treasury rewards or list legendary ACE pulls in the luxury auction house.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border px-6 py-28">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-violet">{s.n}</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <h3 className="font-display text-2xl font-bold tracking-tight">{s.title}</h3>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
