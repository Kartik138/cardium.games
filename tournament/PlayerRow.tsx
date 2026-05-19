import { motion } from "framer-motion";
import { tierStyles, type Player } from "./tournamentData";

export function PlayerRow({ player, index }: { player: Player; index: number }) {
  const s = tierStyles[player.tier];
  const moveUp = player.movement > 0;
  const moveDown = player.movement < 0;

  return (
    <motion.div
      layout
      layoutId={`row-${player.handle}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.025, ease: [0.32, 0.72, 0, 1] }}
      className={`group relative grid grid-cols-[44px_1fr_72px_80px_72px_60px] items-center gap-4 px-4 py-3 transition-colors ${
        player.isYou
          ? "bg-violet/10 ring-1 ring-inset ring-violet/30"
          : "hover:bg-white/[0.03]"
      }`}
    >
      {/* Rank */}
      <div className="flex items-center gap-1.5">
        <span
          className={`font-display text-sm font-bold tabular-nums ${
            player.rank <= 3 ? s.text : "text-muted-foreground"
          }`}
        >
          {String(player.rank).padStart(2, "0")}
        </span>
        {moveUp && <span className="font-mono text-[9px] text-cyan">▲{player.movement}</span>}
        {moveDown && <span className="font-mono text-[9px] text-destructive">▼{Math.abs(player.movement)}</span>}
      </div>

      {/* Identity */}
      <div className="flex min-w-0 items-center gap-3">
        <div className={`relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border ${s.border} ${s.bg}`}>
          <span className={`font-mono text-[9px] font-bold ${s.text}`}>
            {player.handle.slice(0, 2)}
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
            {player.handle}
            {player.isYou && <span className="ml-2 text-violet">· you</span>}
          </p>
          <p className="truncate font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            {player.faction} · {player.tag}
          </p>
        </div>
      </div>

      {/* Tier */}
      <span
        className={`hidden justify-self-start rounded-sm border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest md:inline-block ${s.border} ${s.bg} ${s.text}`}
      >
        {player.tier}
      </span>

      {/* ELO */}
      <div className="text-right">
        <p className="font-display text-sm font-bold tabular-nums text-foreground">{player.elo.toLocaleString()}</p>
        <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">elo</p>
      </div>

      {/* W-L */}
      <p className="text-right font-mono text-[11px] tabular-nums text-muted-foreground">
        <span className="text-foreground">{player.wins}</span>
        <span className="mx-0.5">/</span>
        {player.losses}
      </p>

      {/* Streak */}
      <p
        className={`text-right font-mono text-[11px] font-semibold tabular-nums ${
          player.streak > 0 ? "text-cyan" : player.streak < 0 ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        {player.streak > 0 ? `W${player.streak}` : player.streak < 0 ? `L${Math.abs(player.streak)}` : "—"}
      </p>
    </motion.div>
  );
}
