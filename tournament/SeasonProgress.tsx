import { motion } from "framer-motion";

const milestones = [
  { day: 1, label: "S01 launch", done: true },
  { day: 12, label: "Diamond unlock", done: true },
  { day: 24, label: "You · Top 32 entry", done: true, you: true },
  { day: 31, label: "Weekly W04 lock", done: false, soon: true },
  { day: 38, label: "Master cut-off", done: false },
  { day: 56, label: "Championship Finals", done: false, peak: true },
];

const dayCurrent = 28;
const dayMax = 60;
const pct = (dayCurrent / dayMax) * 100;

export function SeasonProgress() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/30 p-7">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
      <div className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
            Season 01 · Genesis Origin
          </p>
          <h3 className="mt-2 font-display text-xl font-extrabold tracking-tight">
            Day {dayCurrent} of {dayMax}
          </h3>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {dayMax - dayCurrent} days remain
        </p>
      </div>

      {/* Timeline */}
      <div className="relative mt-10 pb-12">
        <div className="absolute inset-x-0 top-2 h-px bg-white/[0.08]" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: [0.32, 0.72, 0, 1] }}
          className="absolute left-0 top-2 h-px bg-gradient-to-r from-violet to-cyan"
        />

        <div className="relative">
          {milestones.map((m) => {
            const x = (m.day / dayMax) * 100;
            return (
              <div
                key={m.day}
                className="absolute -translate-x-1/2"
                style={{ left: `${x}%`, top: 0 }}
              >
                <div
                  className={`mx-auto size-4 rounded-full border-2 ${
                    m.peak
                      ? "border-violet bg-violet shadow-glow-violet"
                      : m.done
                        ? "border-cyan bg-cyan/60"
                        : m.soon
                          ? "border-violet/60 bg-background"
                          : "border-white/15 bg-background"
                  } ${m.you ? "ring-2 ring-violet/40 ring-offset-2 ring-offset-background" : ""}`}
                />
                <p
                  className={`mt-3 w-24 -translate-x-1/2 text-center font-mono text-[9px] uppercase tracking-widest ${
                    m.peak ? "text-violet" : m.you ? "text-cyan" : m.done ? "text-foreground" : "text-muted-foreground"
                  }`}
                  style={{ marginLeft: "50%" }}
                >
                  {m.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
