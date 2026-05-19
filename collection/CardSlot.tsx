import { motion } from "framer-motion";
import { collectionRarityStyles, type CollectionCard } from "./collectionData";

interface Props {
  card: CollectionCard;
  index: number;
  onOpen: (card: CollectionCard) => void;
}

/**
 * A single slot in the binder. Owned cards display art with rarity treatment.
 * Missing cards show a dark silhouette with an animated rarity-tinted outline
 * that breathes — psychologically signaling "almost yours".
 */
export function CardSlot({ card, index, onOpen }: Props) {
  const visual = collectionRarityStyles[card.rarity];
  const owned = card.owned;

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(card)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.015, 0.35), duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      whileHover={{ y: -6, scale: 1.025 }}
      whileTap={{ scale: 0.985 }}
      className={`group relative aspect-[5/7] overflow-hidden rounded-[10px] bg-surface text-left ring-1 transition-shadow duration-500 ${
        owned ? `${visual.ringClass} ${visual.glowClass}` : "ring-white/[0.06] hover:ring-white/15"
      }`}
    >
      {/* Rarity halo behind card on hover (owned only) */}
      {owned && (
        <div
          className={`pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-0 blur-[50px] transition-opacity duration-500 group-hover:opacity-100 ${visual.haloClass}`}
        />
      )}

      {owned ? (
        <>
          <img
            src={card.art}
            alt={`${card.name} — ${card.rarity}`}
            loading="lazy"
            width={400}
            height={560}
            className="size-full select-none object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {visual.shimmer && (
            <div className="absolute inset-0 holo-foil opacity-0 transition-opacity duration-500 group-hover:opacity-90" />
          )}
          {visual.prestige >= 5 && (
            <div className="absolute inset-0 holo-foil opacity-30" />
          )}
          {/* Inner edge highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-[10px] ring-1 ring-inset ring-white/10" />
        </>
      ) : (
        <MissingSlot card={card} />
      )}

      {/* Card chrome */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-2">
        <span
          className={`rounded-sm border px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider backdrop-blur ${
            owned
              ? `border-white/20 bg-background/60 ${visual.textClass}`
              : "border-white/10 bg-background/70 text-white/40"
          }`}
        >
          {visual.short}
        </span>
        <span className="rounded-sm bg-background/70 px-1.5 py-0.5 font-mono text-[8px] text-white/60 backdrop-blur">
          {String(card.num).padStart(3, "0")}
        </span>
      </div>

      {/* Bottom name strip (owned) */}
      {owned && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/80 to-transparent p-2 pt-8">
          <p className={`font-mono text-[8px] uppercase tracking-[0.2em] ${visual.textClass}`}>
            {card.faction}
          </p>
          <p className="truncate font-display text-[11px] font-bold tracking-tight">{card.name}</p>
        </div>
      )}

      {/* Owned-copies pip (>1) */}
      {owned && card.copies > 1 && (
        <span className="absolute bottom-2 right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet/90 px-1.5 font-mono text-[9px] font-bold shadow-glow-violet">
          ×{card.copies}
        </span>
      )}
    </motion.button>
  );
}

function MissingSlot({ card }: { card: CollectionCard }) {
  const visual = collectionRarityStyles[card.rarity];
  const tint = visual.textClass === "text-cyan"
    ? "oklch(0.78 0.15 220)"
    : visual.textClass === "text-violet"
      ? "oklch(0.66 0.23 295)"
      : "oklch(0.65 0.02 260)";
  return (
    <>
      {/* Vault recess — darker than surrounding card */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-background/90 to-black/70" />
      {/* Subtle inner grid noise */}
      <div className="grid-noise absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

      {/* Silhouette glyph — abstract card shape */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 60 84"
          className="h-3/5 w-auto opacity-30 transition-opacity duration-500 group-hover:opacity-60"
          fill="none"
          stroke={tint}
          strokeWidth="0.5"
        >
          <rect x="6" y="6" width="48" height="72" rx="4" strokeDasharray="3 4" />
          <circle cx="30" cy="34" r="10" />
          <path d="M14 60 L30 46 L46 60" />
          <path d="M22 70 L38 70" />
        </svg>
      </div>

      {/* Animated rarity-tinted outline */}
      <div
        className="pointer-events-none absolute inset-1 rounded-[8px]"
        style={{
          boxShadow: `inset 0 0 0 1px ${tint}25, inset 0 0 24px ${tint}18`,
          animation: visual.prestige >= 4 ? "missing-pulse 3.6s ease-in-out infinite" : undefined,
        }}
      />

      {/* Bottom locked label */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2">
        <p
          className="font-mono text-[8px] uppercase tracking-[0.25em] opacity-60"
          style={{ color: tint }}
        >
          {visual.label}
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">— Locked —</p>
      </div>
    </>
  );
}
