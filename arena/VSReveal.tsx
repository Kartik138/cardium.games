import { motion } from "framer-motion";
import { useEffect } from "react";
import { localPlayer, opponentPlayer, type BattlePlayer } from "./arenaData";

interface Props {
  onComplete: () => void;
}

function PlayerCard({ p, side }: { p: BattlePlayer; side: "L" | "R" }) {
  const fromX = side === "L" ? -120 : 120;
  return (
    <motion.div
      initial={{ opacity: 0, x: fromX, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
      className={`flex flex-col items-${side === "L" ? "start" : "end"} gap-4`}
    >
      <div className="relative size-32 overflow-hidden rounded-full border border-border bg-surface md:size-40">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 30%, oklch(0.66 0.23 ${p.avatarHue} / 0.7), oklch(0.13 0.012 260) 75%)`,
          }}
        />
        <div className="absolute inset-0 holo-foil opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center font-display text-4xl font-extrabold tracking-tighter">
          {p.handle.slice(0, 2)}
        </div>
      </div>
      <div className={`text-${side === "L" ? "left" : "right"}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {p.rank} · {p.region}
        </p>
        <h3 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{p.handle}</h3>
        <div className={`mt-2 flex items-center gap-3 ${side === "R" ? "justify-end" : ""}`}>
          <span className="font-mono text-xs tabular-nums text-cyan">ELO {p.elo}</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            WR {(p.winRate * 100).toFixed(0)}%
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-violet">
            W{p.streak}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function VSReveal({ onComplete }: Props) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2600);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-6">
      <div className="grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-12">
        <PlayerCard p={localPlayer} side="L" />

        <motion.div
          initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
          animate={{ scale: [0.4, 1.18, 1], opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 -m-8 rounded-full bg-violet/30 blur-3xl" />
          <div className="relative flex flex-col items-center font-display font-extrabold leading-none tracking-tighter">
            <span className="bg-gradient-to-b from-foreground via-foreground to-violet bg-clip-text text-7xl text-transparent md:text-9xl">
              VS
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-cyan"
            >
              Best of 7 · Ranked
            </motion.span>
          </div>
        </motion.div>

        <PlayerCard p={opponentPlayer} side="R" />
      </div>
    </div>
  );
}
