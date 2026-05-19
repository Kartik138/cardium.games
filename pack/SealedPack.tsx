import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { useState } from "react";
import packArt from "@/assets/pack-sealed.jpg";

/**
 * Sealed booster pack. User drags the foil tab upward to tear the seal.
 * Once dragged past the threshold the pack splits and onOpened fires.
 */
export function SealedPack({ onOpened }: { onOpened: () => void }) {
  const tearY = useMotionValue(0);
  const TEAR_TARGET = 140;
  const progress = useTransform(tearY, [0, -TEAR_TARGET], [0, 1]);
  const [torn, setTorn] = useState(false);

  const onDragEnd = () => {
    if (-tearY.get() >= TEAR_TARGET * 0.7) {
      // Snap tear
      animate(tearY, -TEAR_TARGET - 20, { duration: 0.35, ease: [0.32, 0.72, 0, 1] });
      setTorn(true);
      // Let the tear animation breathe, then transition.
      setTimeout(onOpened, 750);
    } else {
      animate(tearY, 0, { type: "spring", stiffness: 220, damping: 22 });
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Idle hint */}
      <AnimatePresence>
        {!torn && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="absolute -top-16 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
          >
            Drag the seal upward
          </motion.p>
        )}
      </AnimatePresence>

      {/* Pack — floats + tilts */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-0.6, 0.6, -0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="relative h-[460px] w-[260px] [perspective:1200px]">
          {/* Glow halo */}
          <div className="absolute -inset-12 rounded-full bg-violet/30 blur-[100px]" />

          {/* The torn-off top piece — slides off when sealed broken */}
          <motion.div
            style={{ y: tearY }}
            drag="y"
            dragConstraints={{ top: -TEAR_TARGET - 20, bottom: 0 }}
            dragElastic={0.06}
            onDragEnd={onDragEnd}
            className="absolute inset-x-0 top-0 z-20 h-[90px] cursor-grab overflow-hidden rounded-t-[14px] active:cursor-grabbing"
          >
            <img src={packArt} alt="" draggable={false} width={520} height={920} className="h-[460px] w-full select-none object-cover" />
            {/* Holographic foil sweep on the tab */}
            <div className="absolute inset-0 holo-foil opacity-80" />
            {/* Tear edge */}
            <motion.div
              style={{ opacity: useTransform(tearY, [0, -20, -TEAR_TARGET], [0, 0.4, 1]) }}
              className="absolute inset-x-0 bottom-0 h-[6px]"
            >
              <svg viewBox="0 0 260 6" preserveAspectRatio="none" className="h-full w-full">
                <polyline
                  points="0,3 10,1 20,4 30,0 40,3 50,1 60,4 70,2 80,5 90,1 100,3 110,0 120,4 130,2 140,5 150,1 160,3 170,0 180,4 190,2 200,5 210,1 220,3 230,0 240,4 250,2 260,3"
                  fill="none"
                  stroke="oklch(0.78 0.15 220)"
                  strokeWidth="0.6"
                />
              </svg>
            </motion.div>
            {/* Grab handle nub */}
            <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
          </motion.div>

          {/* Body of the pack */}
          <div className="absolute inset-0 overflow-hidden rounded-[14px] ring-1 ring-white/15 ring-glow">
            <img src={packArt} alt="Sealed Cardium booster pack" draggable={false} width={520} height={920} className="size-full select-none object-cover" />
            <div className="absolute inset-0 holo-foil opacity-60" />
            {/* Light leak from the broken seam — grows as user drags */}
            <motion.div
              style={{ opacity: useTransform(tearY, [0, -TEAR_TARGET], [0, 1]) }}
              className="absolute inset-x-0 top-[80px] h-[2px] bg-cyan shadow-[0_0_30px_8px_oklch(0.78_0.15_220/0.8)]"
            />
            <motion.div
              style={{
                opacity: useTransform(tearY, [0, -40, -TEAR_TARGET], [0, 0.2, 0.9]),
                scaleY: useTransform(tearY, [0, -TEAR_TARGET], [0.3, 1]),
              }}
              className="absolute inset-x-0 top-[80px] h-32 origin-top bg-gradient-to-b from-cyan/40 via-violet/20 to-transparent blur-md"
            />
            {/* Pack label */}
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-widest text-white/60">Genesis</p>
                <p className="font-display text-sm font-bold tracking-tight">Booster · S01</p>
              </div>
              <p className="font-mono text-[9px] text-cyan">8 cards</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tear progress meter */}
      <div className="mt-10 w-48 space-y-2">
        <div className="h-px w-full overflow-hidden bg-border">
          <motion.div style={{ scaleX: progress, transformOrigin: "0% 50%" }} className="h-full origin-left bg-cyan shadow-glow-cyan" />
        </div>
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          Seal Integrity
        </p>
      </div>
    </div>
  );
}
