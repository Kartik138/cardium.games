import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Ambient drifting particles for the vault chamber atmosphere.
 * Deterministic seeded positions to avoid SSR/CSR mismatch.
 */
export function VaultAmbience({ intensity = 1 }: { intensity?: number }) {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; d: number; s: number; del: number }>>([]);

  useEffect(() => {
    const count = Math.round(28 * intensity);
    const next = Array.from({ length: count }).map((_, i) => ({
      x: (i * 137) % 100,
      y: (i * 91) % 100,
      d: 8 + ((i * 13) % 12),
      s: 1 + ((i * 7) % 3),
      del: (i * 0.31) % 6,
    }));
    setParticles(next);
  }, [intensity]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft violet floor wash */}
      <div className="absolute left-1/2 top-1/2 size-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-[140px]" />
      {/* Cyan rim from the right */}
      <div className="absolute right-0 top-1/3 size-[600px] rounded-full bg-cyan/10 blur-[140px]" />
      {/* Floor */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      {/* Grid noise floor */}
      <div className="grid-noise absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      {/* Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan/60"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, filter: "blur(0.5px)" }}
          animate={{ y: [-10, -40, -10], opacity: [0, 0.7, 0] }}
          transition={{ duration: p.d, repeat: Infinity, delay: p.del, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
