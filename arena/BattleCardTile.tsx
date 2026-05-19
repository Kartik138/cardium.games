import { motion } from "framer-motion";
import { rarityGlow, rarityRing, rarityText, type BattleCard } from "./arenaData";

interface Props {
  card: BattleCard;
  selected?: boolean;
  used?: boolean;
  staked?: boolean;
  faceDown?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-[78px] md:w-[92px]",
  md: "w-[120px] md:w-[140px]",
  lg: "w-[200px] md:w-[240px]",
};

export function BattleCardTile({ card, selected, used, staked, faceDown, onClick, size = "md" }: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={!used && !faceDown ? { y: -6, scale: 1.02 } : undefined}
      whileTap={!used && !faceDown ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={`group relative ${sizeMap[size]} shrink-0 select-none text-left outline-none`}
      aria-pressed={selected}
    >
      <div
        className={`relative aspect-[5/7] overflow-hidden rounded-lg ring-1 ${rarityRing[card.rarity]} ${rarityGlow[card.rarity]} ${
          used ? "opacity-30 grayscale" : ""
        } ${selected ? "ring-2 ring-violet" : ""}`}
      >
        {faceDown ? (
          <div className="absolute inset-0 bg-gradient-to-br from-surface to-background">
            <div className="absolute inset-0 holo-foil opacity-50" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(oklch(0.66 0.23 295 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.66 0.23 295 / 0.08) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl font-extrabold tracking-tighter text-violet/70">
                C<span className="text-cyan/70">M</span>
              </span>
            </div>
          </div>
        ) : (
          <>
            <img
              src={card.art}
              alt={card.name}
              loading="lazy"
              className="size-full object-cover"
              draggable={false}
            />
            {card.rarity !== "Common" && card.rarity !== "Rare" && (
              <div className="absolute inset-0 holo-foil opacity-70" />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-2">
              <p className="font-display text-[10px] font-bold uppercase tracking-tight leading-tight">
                {card.name}
              </p>
              <p className="mt-0.5 flex items-center justify-between font-mono text-[8px] uppercase tracking-widest">
                <span className={rarityText[card.rarity]}>{card.rarity}</span>
                <span className="tabular-nums text-foreground">{card.power}</span>
              </p>
            </div>
            <div className="absolute right-1.5 top-1.5 rounded-sm border border-white/15 bg-background/70 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider backdrop-blur">
              {card.type}
            </div>
            {staked && (
              <div className="absolute left-1.5 top-1.5 rounded-sm border border-destructive/40 bg-destructive/15 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-destructive backdrop-blur">
                Stake
              </div>
            )}
          </>
        )}
      </div>
    </motion.button>
  );
}
