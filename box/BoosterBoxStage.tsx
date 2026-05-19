import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { useState } from "react";
import boxArt from "@/assets/booster-box.jpg";
import interiorArt from "@/assets/box-interior.jpg";

/**
 * The sealed booster box. Rotates ambiently, then the user drags the lid
 * upward (foil seal cracks, lid hinges back) to reveal the interior.
 */
export function BoosterBoxStage({ onOpened }: { onOpened: () => void }) {
  const lidY = useMotionValue(0);
  const TARGET = 120;
  const progress = useTransform(lidY, [0, -TARGET], [0, 1]);
  const lidRotate = useTransform(lidY, [0, -TARGET], [0, -110]);
  const interiorOpacity = useTransform(lidY, [-TARGET * 0.4, -TARGET], [0, 1]);
  const [cracked, setCracked] = useState(false);

  const onDragEnd = () => {
    if (-lidY.get() >= TARGET * 0.65) {
      animate(lidY, -TARGET - 10, { duration: 0.7, ease: [0.32, 0.72, 0, 1] });
      setCracked(true);
      setTimeout(onOpened, 1100);
    } else {
      animate(lidY, 0, { type: "spring", stiffness: 200, damping: 22 });
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {!cracked && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -top-14 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
          >
            Lift the seal to open
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ rotateY: [-8, 8, -8], y: [0, -8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative"
      >
        <div
          className="relative h-[520px] w-[380px] md:h-[600px] md:w-[440px]"
          style={{ perspective: 1600 }}
        >
          {/* Ambient violet halo */}
          <div className="absolute -inset-16 rounded-full bg-violet/25 blur-[120px]" />
          {/* Cyan rim from right */}
          <div className="absolute -right-20 top-1/4 size-[300px] rounded-full bg-cyan/20 blur-[100px]" />

          {/* Interior — fades in as lid lifts */}
          <motion.div
            style={{ opacity: interiorOpacity }}
            className="absolute inset-x-6 top-6 z-0 h-[120px] overflow-hidden rounded-md"
          >
            <img
              src={interiorArt}
              alt=""
              loading="lazy"
              width={1024}
              height={768}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan/40 via-violet/20 to-background/90" />
          </motion.div>

          {/* Box body */}
          <div className="absolute inset-0 z-10 overflow-hidden rounded-xl ring-1 ring-white/15 ring-glow">
            <img
              src={boxArt}
              alt="Sealed Cardium Genesis booster box"
              width={896}
              height={1152}
              className="size-full object-cover"
            />
            <div className="absolute inset-0 holo-foil opacity-40" />
          </div>

          {/* Lid — top portion, hinged at top, drag down-to-up to unseal */}
          <motion.div
            style={{
              y: lidY,
              rotateX: lidRotate,
              transformOrigin: "50% 0%",
              transformStyle: "preserve-3d",
            }}
            drag="y"
            dragConstraints={{ top: -TARGET - 10, bottom: 0 }}
            dragElastic={0.05}
            onDragEnd={onDragEnd}
            className="absolute inset-x-0 top-0 z-20 h-[140px] cursor-grab overflow-hidden rounded-t-xl ring-1 ring-white/15 active:cursor-grabbing"
          >
            <img
              src={boxArt}
              alt=""
              width={896}
              height={1152}
              draggable={false}
              className="h-[520px] w-full select-none object-cover md:h-[600px]"
            />
            <div className="absolute inset-0 holo-foil opacity-70" />
            {/* Foil seal strip */}
            <motion.div
              style={{ opacity: useTransform(lidY, [0, -20], [1, 0]) }}
              className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-cyan to-transparent shadow-[0_0_18px_4px_oklch(0.78_0.15_220/0.7)]"
            />
            {/* Pull tab */}
            <div className="absolute left-1/2 top-3 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/60 shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
          </motion.div>

          {/* Light beam from inside as lid opens */}
          <motion.div
            style={{
              opacity: useTransform(lidY, [0, -TARGET], [0, 0.85]),
              scaleY: useTransform(lidY, [0, -TARGET], [0.3, 1]),
            }}
            className="absolute inset-x-12 top-[60px] z-10 h-32 origin-top bg-gradient-to-b from-cyan/60 via-violet/30 to-transparent blur-md"
          />
        </div>
      </motion.div>

      {/* Seal integrity meter */}
      <div className="mt-12 w-56 space-y-2">
        <div className="h-px w-full overflow-hidden bg-border">
          <motion.div
            style={{ scaleX: progress, transformOrigin: "0% 50%" }}
            className="h-full bg-cyan shadow-glow-cyan"
          />
        </div>
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          Outer Seal
        </p>
      </div>
    </div>
  );
}
