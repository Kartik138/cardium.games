import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { opponentPlayer } from "./arenaData";

interface Props {
  onFound: () => void;
}

const stages = [
  "Scanning Nexus Lattice",
  "Indexing Diamond Tier",
  "Calibrating Skill Vector",
  "Opponent Located",
];

export function Matchmaking({ onFound }: Props) {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    if (stageIdx < stages.length - 1) {
      const t = setTimeout(() => setStageIdx(stageIdx + 1), 950);
      return () => clearTimeout(t);
    }
    const t = setTimeout(onFound, 1100);
    return () => clearTimeout(t);
  }, [stageIdx, onFound]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center"
    >
      {/* Concentric rings */}
      <div className="relative mb-12 flex size-[280px] items-center justify-center md:size-[360px]">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.4, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 2.4, delay: i * 0.6, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-violet/40"
          />
        ))}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-cyan/30"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute inset-6 rounded-full border border-dashed border-violet/30"
        />
        <div className="relative z-10 flex size-32 items-center justify-center rounded-full border border-violet/40 bg-background/60 backdrop-blur-xl">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="size-2 rounded-full bg-violet shadow-glow-violet"
          />
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan">
        S01 · Ranked Lattice
      </p>
      <motion.h2
        key={stageIdx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
        className="mt-4 font-display text-3xl font-extrabold tracking-tight md:text-5xl"
      >
        {stages[stageIdx]}
        <span className="text-violet">.</span>
      </motion.h2>

      {stageIdx >= stages.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 inline-flex items-center gap-3 rounded-full border border-violet/40 bg-violet/10 px-4 py-2"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-violet shadow-glow-violet" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground">
            {opponentPlayer.handle} · {opponentPlayer.rank}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
