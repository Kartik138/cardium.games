import { motion } from "framer-motion";

const stats = [
  { k: "Protocol Reserve", v: "$14,290,441", sub: "Backing all set redemptions" },
  { k: "Cards Burned", v: "842,910", sub: "Scarcity evolution to date" },
  { k: "Yield Distributed", v: "$2.41M", sub: "To ACE & PROMO holders" },
  { k: "Active Sets", v: "8 / 12", sub: "Completion in circulation" },
];

export function Treasury() {
  return (
    <section className="border-y border-border bg-surface/30 px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
              Protocol Vault
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              The Treasury.
            </h2>
          </div>
          <p className="hidden max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground md:block">
            Every pack mints reserve. Every burn redeems it. Transparent, on-chain, sustainable.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.k}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="bg-background p-6"
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {s.k}
              </p>
              <p className="mt-4 font-display text-3xl font-bold tabular-nums tracking-tight">
                {s.v}
              </p>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
