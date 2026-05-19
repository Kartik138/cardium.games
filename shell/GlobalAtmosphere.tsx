import { motion } from "framer-motion";
import { useMemo } from "react";

/**
 * Persistent Cardium universe background. Renders once at root,
 * stays mounted across every route to preserve continuity.
 */
export function GlobalAtmosphere() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 8,
        duration: 14 + Math.random() * 18,
        hue: Math.random() > 0.5 ? "violet" : "cyan",
      })),
    []
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Deep base gradient */}
      <div className="absolute inset-0 bg-background" />

      {/* Layered nebulae */}
      <div className="absolute -top-40 left-1/2 size-[1100px] -translate-x-1/2 rounded-full bg-violet/15 blur-[160px]" />
      <div className="absolute -bottom-40 -left-40 size-[900px] rounded-full bg-cyan/10 blur-[180px]" />
      <div className="absolute -right-40 top-1/3 size-[700px] rounded-full bg-violet/10 blur-[160px]" />

      {/* Holographic horizon line */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-violet/30 to-transparent" />

      {/* Cinematic vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.08_0.02_260)_100%)]" />

      {/* Architectural grid */}
      <div className="absolute inset-0 grid-noise opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_85%)]" />

      {/* Drifting particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.7, 0.7, 0],
            y: [0, -60, -120, -180],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className={`absolute rounded-full ${
            p.hue === "violet" ? "bg-violet shadow-glow-violet" : "bg-cyan shadow-glow-cyan"
          }`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
        />
      ))}

      {/* Soft scanline pulse */}
      <motion.div
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0,oklch(1_0_0/0.04)_50%,transparent_100%)] bg-[length:100%_4px]"
      />
    </div>
  );
}
