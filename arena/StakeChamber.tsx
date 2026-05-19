import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { BattleCardTile } from "./BattleCardTile";
import type { BattleCard } from "./arenaData";

interface Props {
  deck: BattleCard[];
  opponentStakes: BattleCard[];
  onLockIn: (stakes: BattleCard[]) => void;
}

export function StakeChamber({ deck, opponentStakes, onLockIn }: Props) {
  const [picked, setPicked] = useState<string[]>([]);
  const [revealOpponent, setRevealOpponent] = useState(false);
  const [locking, setLocking] = useState(false);

  // Order deck by descending power so the choice feels meaningful
  const sorted = [...deck].sort((a, b) => b.power - a.power);

  function toggle(id: string) {
    if (locking) return;
    setPicked((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? p : [...p, id]
    );
  }

  function lockIn() {
    if (picked.length !== 3 || locking) return;
    setLocking(true);
    const stakes = deck.filter((c) => picked.includes(c.id));
    setTimeout(() => setRevealOpponent(true), 700);
    setTimeout(() => onLockIn(stakes), 2800);
  }

  return (
    <div className="relative flex min-h-[88vh] flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-destructive">
          Stake Chamber · Phase 1
        </p>
        <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight md:text-5xl">
          Select 3 cards to wager.
        </h2>
        <p className="mt-3 max-w-md mx-auto text-pretty text-sm text-muted-foreground">
          Losing this match transfers your staked cards to EXARCH. Choose what you're
          willing to risk.
        </p>
      </motion.div>

      {/* Opponent stake reveal */}
      <AnimatePresence>
        {revealOpponent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-10 flex flex-col items-center"
          >
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
              EXARCH locks in
            </p>
            <div className="flex gap-3">
              {opponentStakes.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, rotateY: -90, y: -20 }}
                  animate={{ opacity: 1, rotateY: 0, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.15 * i, ease: [0.32, 0.72, 0, 1] }}
                >
                  <BattleCardTile card={c} size="sm" staked />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stake slots */}
      <div className="mb-10 flex items-center gap-4">
        {[0, 1, 2].map((i) => {
          const id = picked[i];
          const card = id ? deck.find((c) => c.id === id) : null;
          return (
            <motion.div
              key={i}
              animate={card ? { scale: [0.85, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
              className={`relative aspect-[5/7] w-[100px] overflow-hidden rounded-lg border md:w-[120px] ${
                card ? "border-destructive/60" : "border-dashed border-border"
              }`}
            >
              {card ? (
                <BattleCardTile card={card} size="md" staked />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1">
                  <span className="font-display text-2xl font-extrabold text-muted-foreground/40">
                    {i + 1}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">
                    Stake Slot
                  </span>
                </div>
              )}
              {card && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: locking ? 1 : 0 }}
                  className="pointer-events-none absolute inset-0 bg-destructive/15 mix-blend-screen"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Deck list */}
      <div className="grid max-w-6xl grid-cols-4 gap-2 md:grid-cols-6 md:gap-3 lg:grid-cols-11">
        {sorted.map((c) => (
          <BattleCardTile
            key={c.id}
            card={c}
            size="sm"
            selected={picked.includes(c.id)}
            onClick={() => toggle(c.id)}
            used={locking && !picked.includes(c.id)}
          />
        ))}
      </div>

      <motion.button
        onClick={lockIn}
        disabled={picked.length !== 3 || locking}
        whileHover={picked.length === 3 ? { scale: 1.02 } : undefined}
        whileTap={picked.length === 3 ? { scale: 0.98 } : undefined}
        className={`mt-10 rounded-sm border px-8 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] transition-colors ${
          picked.length === 3 && !locking
            ? "border-destructive bg-destructive/15 text-destructive shadow-[0_0_40px_-10px_oklch(0.62_0.24_22/0.6)] hover:bg-destructive hover:text-foreground"
            : "border-border bg-surface/40 text-muted-foreground"
        }`}
      >
        {locking ? "Sealing Chamber" : `Lock In Stakes (${picked.length}/3)`}
      </motion.button>
    </div>
  );
}
