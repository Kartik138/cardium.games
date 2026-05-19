import { motion } from "framer-motion";

interface Props {
  /** 0 = calm, 1 = tense, 2 = climax */
  intensity?: 0 | 1 | 2;
  /** Optional hue shift toward the leading player */
  hue?: "violet" | "cyan" | "neutral";
}

export function ArenaAmbience({ intensity = 0, hue = "neutral" }: Props) {
  const opacity = 0.18 + intensity * 0.12;
  const blurA = 140 + intensity * 40;
  const blurB = 180 + intensity * 40;

  const violet = `oklch(0.66 0.23 295 / ${opacity})`;
  const cyan = `oklch(0.78 0.15 220 / ${opacity * 0.85})`;
  const left = hue === "cyan" ? cyan : violet;
  const right = hue === "violet" ? violet : cyan;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-noise opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {/* floor light haze */}
      <motion.div
        animate={{ opacity: [0.7, 1, 0.85] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background: `radial-gradient(ellipse 70% 80% at 50% 100%, ${left}, transparent 70%)`,
        }}
      />

      {/* left + right stadium spots */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-15%] top-[10%] size-[55vw] rounded-full"
        style={{ background: left, filter: `blur(${blurA}px)` }}
      />
      <motion.div
        animate={{ opacity: [0.55, 0.9, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        className="absolute right-[-15%] top-[20%] size-[55vw] rounded-full"
        style={{ background: right, filter: `blur(${blurB}px)` }}
      />

      {/* horizon scanline */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* arena floor grid */}
      <div
        className="absolute inset-x-0 bottom-0 h-[42%] opacity-30 [mask-image:linear-gradient(to_top,black_10%,transparent_90%)]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: "perspective(800px) rotateX(62deg)",
          transformOrigin: "center bottom",
        }}
      />

      {intensity >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, transparent 40%, oklch(0.13 0.012 260 / 0.5) 80%)",
          }}
        />
      )}
    </div>
  );
}
