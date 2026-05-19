import { motion } from "framer-motion";
import { collectionRarityStyles } from "@/components/collection/collectionData";
import type { AuctionListing } from "./marketData";

interface Props {
  listings: AuctionListing[];
  onJump: (id: string) => void;
}

/**
 * Premium notification surface: cards the collector is missing that
 * are actively up for auction. Designed to feel intelligent and
 * collectible-focused — not aggressive or casino-like.
 */
export function MissingAlert({ listings, onJump }: Props) {
  const missing = listings.filter((l) => !l.ownedByUser);
  // Prioritize high prestige + ending sooner
  const top = [...missing]
    .sort((a, b) => {
      const pa = collectionRarityStyles[a.rarity].prestige;
      const pb = collectionRarityStyles[b.rarity].prestige;
      if (pb !== pa) return pb - pa;
      return a.endsIn - b.endsIn;
    })
    .slice(0, 3);

  if (top.length === 0) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="relative overflow-hidden rounded-2xl border border-violet/30 bg-gradient-to-r from-violet/10 via-background/50 to-cyan/10 p-6 backdrop-blur-md"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-violet/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 size-72 rounded-full bg-cyan/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-md">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-violet">
            Archivist Notice
          </p>
          <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
            {top.length} missing card{top.length > 1 ? "s" : ""} on the floor right now.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The Vault has flagged active lots that would advance your Genesis archive. Acquisition
            windows close within the hour.
          </p>
        </div>

        <div className="flex gap-3">
          {top.map((l) => {
            const r = collectionRarityStyles[l.rarity];
            return (
              <button
                key={l.id}
                onClick={() => onJump(l.id)}
                className="group relative w-[110px] shrink-0 text-left"
              >
                <div className={`relative aspect-[5/7] overflow-hidden rounded-md ring-1 ${r.ringClass} ${r.glowClass} transition-transform group-hover:-translate-y-1`}>
                  <img src={l.art} alt={l.name} className="size-full object-cover" loading="lazy" />
                  {r.shimmer && <div className="absolute inset-0 holo-foil opacity-70" />}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-1.5">
                    <p className={`font-mono text-[8px] uppercase tracking-widest ${r.textClass}`}>
                      {r.short}
                    </p>
                    <p className="truncate font-display text-[10px] font-bold leading-tight">
                      {l.name}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
}
