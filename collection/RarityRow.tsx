import { motion } from "framer-motion";
import { CardSlot } from "./CardSlot";
import { collectionRarityStyles, type CollectionCard, type CollectionRarity } from "./collectionData";

interface Props {
  rarity: CollectionRarity;
  cards: CollectionCard[];
  owned: number;
  total: number;
  onOpen: (card: CollectionCard) => void;
}

/**
 * One prestige section — header with rarity label, completion ratio, and
 * a visual progress strip. The grid below holds owned cards + silhouettes.
 */
export function RarityRow({ rarity, cards, owned, total, onOpen }: Props) {
  const visual = collectionRarityStyles[rarity];
  const pct = total > 0 ? (owned / total) * 100 : 0;
  const complete = owned === total;
  const nearComplete = !complete && total - owned <= 2 && total >= 3;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      className="relative"
    >
      {/* Section header */}
      <div className="mb-5 flex items-end justify-between gap-6 border-b border-border/60 pb-4">
        <div className="flex items-baseline gap-4">
          <span className={`font-mono text-[10px] uppercase tracking-[0.4em] ${visual.textClass}`}>
            Tier {visual.prestige.toString().padStart(2, "0")}
          </span>
          <h3
            className={`font-display text-2xl font-bold tracking-tight md:text-3xl ${
              visual.prestige >= 8 ? visual.textClass : "text-foreground"
            }`}
          >
            {visual.label}
          </h3>
          {complete && (
            <span className="rounded-sm border border-cyan/40 bg-cyan/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan">
              Complete
            </span>
          )}
          {nearComplete && (
            <span className="animate-pulse rounded-sm border border-violet/50 bg-violet/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-violet">
              {total - owned} remaining
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {owned} / {total}
          </span>
          <div className="relative h-px w-32 overflow-hidden bg-border md:w-48">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: pct / 100 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
              style={{ transformOrigin: "0% 50%" }}
              className={`h-full ${complete ? "bg-cyan shadow-glow-cyan" : visual.textClass === "text-violet" ? "bg-violet shadow-glow-violet" : visual.textClass === "text-cyan" ? "bg-cyan shadow-glow-cyan" : "bg-foreground"}`}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div
        className={`grid gap-3 md:gap-4 ${
          visual.prestige >= 9
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : visual.prestige >= 7
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
              : visual.prestige >= 5
                ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
                : "grid-cols-4 sm:grid-cols-5 lg:grid-cols-8"
        }`}
      >
        {cards.map((c, i) => (
          <CardSlot key={c.id} card={c} index={i} onOpen={onOpen} />
        ))}
      </div>
    </motion.section>
  );
}
