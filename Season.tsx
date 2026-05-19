import { motion } from "framer-motion";

const milestones = [
  { day: "Day 01", label: "Genesis Drop", status: "complete" },
  { day: "Day 14", label: "First Tournament", status: "complete" },
  { day: "Day 30", label: "PROMO Reveal", status: "active" },
  { day: "Day 60", label: "Set Lock", status: "upcoming" },
  { day: "Day 90", label: "Treasury Distribution", status: "upcoming" },
];

export function Season() {
  return (
    <section className="border-t border-border px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
              Seasonal Progression
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              S01 — Genesis Origin.
            </h2>
          </div>
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Ends in
            </p>
            <p className="font-display text-2xl font-bold tabular-nums text-violet">42d 11h 04m</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-3 h-px bg-border" />
          <div className="absolute left-0 top-3 h-px w-[42%] bg-violet shadow-glow-violet" />
          <div className="relative grid grid-cols-2 gap-6 md:grid-cols-5">
            {milestones.map((m, i) => (
              <motion.div
                key={m.day}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-start"
              >
                <div
                  className={`size-3 rounded-full ring-4 ring-background ${
                    m.status === "complete"
                      ? "bg-violet"
                      : m.status === "active"
                        ? "bg-cyan shadow-glow-cyan"
                        : "bg-muted"
                  }`}
                />
                <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {m.day}
                </p>
                <p className="mt-1 font-display text-sm font-semibold">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
