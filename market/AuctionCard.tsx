import { motion } from "framer-motion";
import { collectionRarityStyles } from "@/components/collection/collectionData";
import { formatCountdown, formatEth, tagMeta, type AuctionListing } from "./marketData";

interface Props {
  listing: AuctionListing;
  countdown: number;
  onOpen: () => void;
}

const toneClass: Record<"violet" | "cyan" | "destructive" | "neutral", string> = {
  violet: "border-violet/40 bg-violet/10 text-violet",
  cyan: "border-cyan/40 bg-cyan/10 text-cyan",
  destructive: "border-destructive/40 bg-destructive/10 text-destructive",
  neutral: "border-border bg-surface/60 text-foreground",
};

export function AuctionCard({ listing, countdown, onOpen }: Props) {
  const r = collectionRarityStyles[listing.rarity];
  const cd = formatCountdown(countdown);
  const isPrestige = r.prestige >= 7;
  const isElite = r.prestige >= 9;

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/30 text-left backdrop-blur-md transition-colors hover:border-violet/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
    >
      {/* Card art */}
      <div className="relative aspect-[5/7] overflow-hidden">
        <img
          src={listing.art}
          alt={listing.name}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        {/* Rarity halo */}
        <div className={`pointer-events-none absolute inset-0 ${r.haloClass} mix-blend-screen opacity-60`} />
        {r.shimmer && <div className="pointer-events-none absolute inset-0 holo-foil opacity-70" />}

        {/* Elite outer glow */}
        {isElite && (
          <motion.div
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={`pointer-events-none absolute -inset-2 -z-10 rounded-2xl ${r.glowClass}`}
          />
        )}

        {/* Top-left rarity chip */}
        <div className={`absolute left-2.5 top-2.5 rounded-sm border ${isPrestige ? "border-violet/40 bg-background/70" : "border-border bg-background/70"} px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${r.textClass} backdrop-blur`}>
          {r.short} · {listing.cardNum}
        </div>

        {/* Owned indicator */}
        {listing.ownedByUser && (
          <div className="absolute right-2.5 top-2.5 rounded-sm border border-cyan/40 bg-cyan/10 px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest text-cyan backdrop-blur">
            In Vault
          </div>
        )}

        {/* Tag stack — bottom-left */}
        {listing.tags.length > 0 && (
          <div className="absolute inset-x-2.5 bottom-2.5 flex flex-wrap gap-1">
            {listing.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className={`rounded-sm border px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest backdrop-blur ${toneClass[tagMeta[t].tone]}`}
              >
                {tagMeta[t].label}
              </span>
            ))}
          </div>
        )}

        {/* Bottom gradient veil */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/90 to-transparent" />
      </div>

      {/* Meta */}
      <div className="relative flex flex-1 flex-col gap-3 border-t border-border p-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            {listing.faction} · {listing.serial}
          </p>
          <h3 className="mt-1 font-display text-base font-bold leading-tight tracking-tight">
            {listing.name}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Top bid
            </p>
            <p className="font-display text-xl font-extrabold tabular-nums leading-none">
              {formatEth(listing.bid)}
              <span className="ml-1 font-mono text-[10px] font-semibold text-muted-foreground">
                ETH
              </span>
            </p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              {listing.bids} bids
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              Ends in
            </p>
            <p
              className={`font-display text-sm font-bold tabular-nums ${
                cd.urgent ? "text-destructive" : "text-foreground"
              }`}
            >
              {cd.label}
            </p>
            <p className="mt-1 flex items-center justify-end gap-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              <span className="size-1 animate-pulse rounded-full bg-cyan" />
              {listing.watchers} watching
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
