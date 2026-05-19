import { motion } from "framer-motion";
import packArt from "@/assets/pack-sealed.jpg";

interface Props {
  total: number;
  openedFlags: boolean[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

/**
 * The 12 booster packs arranged in two staggered rows inside the open box.
 * Opened packs dim and slide aside; the next pack pulses to invite interaction.
 */
export function PackTray({ total, openedFlags, currentIndex, onSelect }: Props) {
  // Deterministic micro-jitter so the row doesn't look CGI-perfect.
  const jitter = (i: number) => ({
    x: ((i * 41) % 7) - 3,
    y: ((i * 29) % 5) - 2,
    rotate: ((i * 17) % 4) - 2,
  });

  return (
    <div className="relative w-full max-w-5xl">
      <div className="mb-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>Genesis Box · 12 Packs</span>
        <span className="text-cyan">
          {openedFlags.filter(Boolean).length} / {total} opened
        </span>
      </div>

      <div className="relative rounded-lg border border-border bg-surface/30 px-6 py-10 backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />

        <div className="relative grid grid-cols-6 gap-3 md:gap-4">
          {Array.from({ length: total }).map((_, i) => {
            const opened = openedFlags[i];
            const isNext = i === currentIndex && !opened;
            const j = jitter(i);
            return (
              <motion.button
                key={i}
                type="button"
                disabled={opened || !isNext}
                onClick={() => onSelect(i)}
                initial={{ opacity: 0, y: 20 + i * 2 }}
                animate={{
                  opacity: opened ? 0.25 : 1,
                  x: opened ? j.x - 12 : j.x,
                  y: opened ? j.y + 18 : j.y,
                  rotate: opened ? j.rotate - 6 : j.rotate,
                  filter: opened ? "grayscale(0.8) brightness(0.5)" : "none",
                }}
                transition={{ delay: i * 0.05, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                className={`relative aspect-[5/9] overflow-hidden rounded-md ring-1 transition-shadow ${
                  isNext
                    ? "cursor-pointer ring-cyan/70 shadow-[0_20px_60px_-20px_oklch(0.78_0.15_220/0.7)] hover:ring-cyan"
                    : "ring-white/10"
                }`}
              >
                <img
                  src={packArt}
                  alt={`Genesis booster pack ${i + 1}`}
                  loading="lazy"
                  width={260}
                  height={460}
                  className="size-full object-cover"
                />
                {!opened && <div className="absolute inset-0 holo-foil opacity-50" />}
                {isNext && (
                  <>
                    <motion.div
                      animate={{ opacity: [0.3, 0.9, 0.3] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 bg-gradient-to-t from-cyan/30 via-transparent to-transparent"
                    />
                    <div className="absolute inset-x-0 bottom-1 text-center font-mono text-[8px] uppercase tracking-[0.25em] text-cyan">
                      Open
                    </div>
                  </>
                )}
                <div className="absolute left-1 top-1 rounded-sm bg-background/70 px-1 py-px font-mono text-[8px] text-white/70 backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
