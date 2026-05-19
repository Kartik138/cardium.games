import { motion, useMotionValue, useTransform, useMotionValueEvent, animate, AnimatePresence } from "framer-motion";
import { useState } from "react";
import packArt from "@/assets/pack-sealed.jpg";

/**
 * A single foil pack with tactile peel mechanics.
 *
 * Two-phase interaction:
 *  1. STRETCH — initial 0-25% of the drag stretches the foil with visible
 *     tension lines, micro-crinkle wobble, and a subtle highlight that
 *     intensifies as the material strains.
 *  2. PEEL — past the tension threshold the seal "gives" and the top strip
 *     peels with a curling shadow, jagged foil edge, and a holographic
 *     light leak that grows from the cut line.
 */
export function FoilPack({ onOpened, label = "Booster" }: { onOpened: () => void; label?: string }) {
  const cutX = useMotionValue(0);
  const WIDTH = 240;
  const TENSION = WIDTH * 0.18; // material gives at 18%

  const progress = useTransform(cutX, [0, WIDTH], [0, 1]);
  // Strip motion lags slightly before the seal gives, then accelerates
  const stripLift = useTransform(cutX, [0, TENSION, WIDTH], [0, -4, -34]);
  const stripRotate = useTransform(cutX, [0, TENSION, WIDTH], [0, -1.5, -16]);
  const stripCurl = useTransform(cutX, [0, TENSION, WIDTH], [1, 0.99, 0.94]);
  // Tension visuals build then release
  const tensionGlow = useTransform(cutX, [0, TENSION, TENSION + 8, WIDTH], [0, 0.7, 0.2, 0]);
  // Light leak grows post-tension
  const leakOpacity = useTransform(cutX, [TENSION, WIDTH], [0, 1]);
  const leakHeight = useTransform(cutX, [TENSION, WIDTH], [0.2, 1]);
  // Subtle crinkle wobble — driven by drag delta
  const crinkle = useMotionValue(0);
  useMotionValueEvent(cutX, "change", (latest) => {
    if (latest > 4 && latest < WIDTH - 4) {
      crinkle.set((Math.sin(latest * 0.6) * 0.6));
    } else {
      crinkle.set(0);
    }
  });

  const [cut, setCut] = useState(false);
  const [tensioned, setTensioned] = useState(false);

  useMotionValueEvent(cutX, "change", (v) => {
    if (!tensioned && v >= TENSION) setTensioned(true);
  });

  const onDragEnd = () => {
    const v = cutX.get();
    if (v >= WIDTH * 0.7) {
      animate(cutX, WIDTH, { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] });
      setCut(true);
      setTimeout(onOpened, 1000);
    } else if (v >= TENSION) {
      // Past tension but not committed — slow retraction with material memory
      animate(cutX, TENSION * 0.6, { type: "spring", stiffness: 140, damping: 22 });
    } else {
      // Foil snaps back fully
      animate(cutX, 0, { type: "spring", stiffness: 220, damping: 24 });
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {!cut && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute -top-12 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
          >
            {tensioned ? "Keep going —" : "Drag to peel the seal"}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: [0, -5, 0], rotate: [-0.25, 0.25, -0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="relative h-[420px] w-[260px]" style={{ perspective: 1400 }}>
          <div className="absolute -inset-10 rounded-full bg-violet/30 blur-[100px]" />

          {/* Pack body */}
          <motion.div
            style={{ rotate: crinkle }}
            className="absolute inset-0 overflow-hidden rounded-[14px] ring-1 ring-white/15 ring-glow"
          >
            <img
              src={packArt}
              alt=""
              draggable={false}
              width={520}
              height={920}
              className="size-full select-none object-cover"
            />
            <div className="absolute inset-0 holo-foil opacity-60" />

            {/* Tension highlight — pulses just before seal gives */}
            <motion.div
              style={{ opacity: tensionGlow }}
              className="pointer-events-none absolute inset-x-0 top-[54px] h-3 bg-gradient-to-b from-white/40 via-cyan/30 to-transparent blur-sm"
            />

            {/* Light leak through the cut */}
            <motion.div
              style={{ opacity: leakOpacity }}
              className="absolute inset-x-0 top-[58px] h-[2px] bg-cyan shadow-[0_0_28px_8px_oklch(0.78_0.15_220/0.9)]"
            />
            <motion.div
              style={{ opacity: leakOpacity, scaleY: leakHeight }}
              className="absolute inset-x-0 top-[58px] h-32 origin-top bg-gradient-to-b from-cyan/50 via-violet/25 to-transparent blur-md"
            />
            <motion.div
              style={{ opacity: leakOpacity }}
              className="absolute inset-x-0 top-[58px] h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[1px]"
            />

            {/* Pack label */}
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-widest text-white/60">Genesis</p>
                <p className="font-display text-sm font-bold tracking-tight">{label}</p>
              </div>
              <p className="font-mono text-[9px] text-cyan">5 cards</p>
            </div>
          </motion.div>

          {/* Tension lines stretching across the seal before it gives */}
          <motion.svg
            viewBox="0 0 260 8"
            preserveAspectRatio="none"
            style={{ opacity: tensionGlow }}
            className="pointer-events-none absolute inset-x-2 top-[52px] z-10 h-2 w-[calc(100%-16px)]"
          >
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={i * 65}
                y1="4"
                x2={i * 65 + 50}
                y2="4"
                stroke="white"
                strokeWidth="0.4"
                strokeDasharray="2 3"
                opacity="0.5"
              />
            ))}
          </motion.svg>

          {/* The top strip that peels back as the cut progresses */}
          <motion.div
            style={{ y: stripLift, rotate: stripRotate, scaleY: stripCurl, transformOrigin: "0% 100%" }}
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[60px] overflow-hidden rounded-t-[14px]"
          >
            <img
              src={packArt}
              alt=""
              draggable={false}
              width={520}
              height={920}
              className="h-[420px] w-full select-none object-cover"
            />
            <div className="absolute inset-0 holo-foil opacity-80" />
            {/* Inner shadow once peel begins — fakes the underside */}
            <motion.div
              style={{ opacity: leakOpacity }}
              className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-b from-transparent via-black/40 to-black/80"
            />
            {/* Cut edge — jagged foil */}
            <svg
              viewBox="0 0 260 4"
              preserveAspectRatio="none"
              className="absolute inset-x-0 bottom-0 h-1 w-full"
            >
              <polyline
                points="0,2 8,1 16,3 24,0 32,2 40,1 48,3 56,1 64,2 72,0 80,3 88,1 96,2 104,0 112,3 120,1 128,2 136,0 144,3 152,1 160,2 168,0 176,3 184,1 192,2 200,0 208,3 216,1 224,2 232,0 240,3 248,1 260,2"
                fill="none"
                stroke="oklch(0.78 0.15 220)"
                strokeWidth="0.6"
              />
            </svg>
          </motion.div>

          {/* The blade — user drags this horizontally across the seal */}
          <motion.div
            style={{ x: cutX }}
            drag="x"
            dragConstraints={{ left: 0, right: WIDTH }}
            dragElastic={0.02}
            dragMomentum={false}
            onDragEnd={onDragEnd}
            className="absolute left-0 top-[44px] z-30 flex h-7 w-7 cursor-grab items-center justify-center rounded-full border border-cyan/80 bg-background/80 shadow-[0_0_22px_6px_oklch(0.78_0.15_220/0.7)] backdrop-blur active:cursor-grabbing"
          >
            <div className="h-3 w-px bg-cyan shadow-[0_0_8px_oklch(0.78_0.15_220)]" />
          </motion.div>

          {/* Track hint line */}
          <div className="pointer-events-none absolute inset-x-3 top-[57px] z-10 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </motion.div>

      <div className="mt-8 w-44 space-y-2">
        <div className="relative h-px w-full overflow-hidden bg-border">
          <motion.div
            style={{ scaleX: progress, transformOrigin: "0% 50%" }}
            className="h-full bg-cyan shadow-glow-cyan"
          />
          {/* Tension threshold tick */}
          <div
            className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/40"
            style={{ left: `${(TENSION / WIDTH) * 100}%` }}
          />
        </div>
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          {tensioned ? "Seal compromised" : "Foil tension"}
        </p>
      </div>
    </div>
  );
}
