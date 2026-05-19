import { motion } from "framer-motion";
import { localPlayer, opponentPlayer } from "./arenaData";

interface Props {
  round: number;
  totalRounds: number;
  pScore: number;
  oScore: number;
  timer: number;
  phaseLabel: string;
}

export function Scoreboard({ round, totalRounds, pScore, oScore, timer, phaseLabel }: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center px-4 pt-4">
      <div className="pointer-events-auto flex w-full max-w-5xl items-stretch overflow-hidden rounded-md border border-border bg-background/75 font-mono text-[10px] uppercase tracking-[0.25em] backdrop-blur-xl">
        {/* P1 */}
        <div className="flex-1 px-4 py-3">
          <p className="text-[8px] text-muted-foreground">{localPlayer.handle}</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-2xl font-extrabold tabular-nums text-foreground">
              {pScore}
            </span>
            <span className="text-[8px] text-muted-foreground">ELO {localPlayer.elo}</span>
          </p>
        </div>

        {/* Round + timer */}
        <div className="flex flex-col items-center justify-center gap-1 border-x border-border bg-surface/60 px-6 py-3">
          <span className="text-[8px] text-cyan">{phaseLabel}</span>
          <span className="font-display text-base font-bold text-foreground">
            Round {round} / {totalRounds}
          </span>
          <motion.span
            key={timer}
            initial={{ scale: 1.2, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`tabular-nums ${timer <= 5 ? "text-destructive" : "text-muted-foreground"}`}
          >
            {String(Math.max(0, timer)).padStart(2, "0")}s
          </motion.span>
        </div>

        {/* P2 */}
        <div className="flex-1 px-4 py-3 text-right">
          <p className="text-[8px] text-muted-foreground">{opponentPlayer.handle}</p>
          <p className="mt-1 flex items-baseline justify-end gap-2">
            <span className="text-[8px] text-muted-foreground">ELO {opponentPlayer.elo}</span>
            <span className="font-display text-2xl font-extrabold tabular-nums text-foreground">
              {oScore}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
