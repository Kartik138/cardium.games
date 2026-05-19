import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { BattleCardTile } from "./BattleCardTile";
import { localPlayer, opponentPlayer, type BattleCard } from "./arenaData";

interface Props {
  outcome: "P" | "O" | "D";
  pScore: number;
  oScore: number;
  playerStakes: BattleCard[];
  opponentStakes: BattleCard[];
  onRematch: () => void;
}

export function Victory({ outcome, pScore, oScore, playerStakes, opponentStakes, onRematch }: Props) {
  const won = outcome === "P";
  const draw = outcome === "D";

  const title = won ? "Victory" : draw ? "Stalemate" : "Defeat";
  const sub = won
    ? "Stake cards transferring to your archive."
    : draw
      ? "Stakes returned to both vaults."
      : `${opponentPlayer.handle} claims your wagered cards.`;

  const eloDelta = won ? 24 : draw ? 0 : -18;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan"
      >
        Match Complete · Ranked S01
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className={`mt-6 font-display text-7xl font-extrabold tracking-tighter md:text-9xl ${
          won ? "text-violet" : draw ? "text-foreground" : "text-cyan"
        }`}
        style={{
          textShadow: won
            ? "0 0 80px oklch(0.66 0.23 295 / 0.6)"
            : draw
              ? "none"
              : "0 0 60px oklch(0.78 0.15 220 / 0.5)",
        }}
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 max-w-md text-pretty text-sm text-muted-foreground"
      >
        {sub}
      </motion.p>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex items-center gap-6 font-display text-5xl font-extrabold tabular-nums"
      >
        <span className={won ? "text-violet" : "text-foreground"}>{pScore}</span>
        <span className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">vs</span>
        <span className={!won && !draw ? "text-cyan" : "text-foreground"}>{oScore}</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className={`mt-2 font-mono text-xs tabular-nums ${
          eloDelta > 0 ? "text-violet" : eloDelta < 0 ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        ELO {eloDelta > 0 ? "+" : ""}
        {eloDelta} · {localPlayer.handle}
      </motion.p>

      {/* Stake transfer */}
      <div className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-8">
        <div>
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            {won ? "Acquired" : draw ? "Returned" : "Forfeited"}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {(won ? opponentStakes : playerStakes).map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: won ? -40 : 20, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: 1 + i * 0.2, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              >
                <BattleCardTile card={c} size="md" />
              </motion.div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            Final Hand Synergy
          </p>
          <div className="rounded-md border border-border bg-surface/40 px-4 py-5 text-left font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <div className="flex justify-between"><span>Predictions</span><span className="text-foreground tabular-nums">{pScore}/{pScore + oScore}</span></div>
            <div className="mt-2 flex justify-between"><span>Reads</span><span className="text-cyan tabular-nums">{Math.round((pScore / Math.max(1, pScore + oScore)) * 100)}%</span></div>
            <div className="mt-2 flex justify-between"><span>Streak</span><span className="text-violet tabular-nums">{won ? "W" + (localPlayer.streak + 1) : "W0"}</span></div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-3"
      >
        <button
          onClick={onRematch}
          className="rounded-sm bg-violet px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-foreground shadow-glow-violet transition-transform hover:scale-[1.02]"
        >
          Queue Again
        </button>
        <Link
          to="/collection"
          className="rounded-sm border border-border bg-surface/40 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-surface"
        >
          View Collection
        </Link>
        <Link
          to="/"
          className="rounded-sm border border-border bg-surface/40 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-surface"
        >
          Exit Arena
        </Link>
      </motion.div>
    </motion.div>
  );
}
