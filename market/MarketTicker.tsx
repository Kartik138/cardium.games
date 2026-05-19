import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { formatEth, type AuctionListing } from "./marketData";

interface Props {
  listings: AuctionListing[];
}

/**
 * A premium broadcast-style activity ticker for the marketplace floor.
 * Pure visual — looped CSS marquee with framer fade gradients.
 */
export function MarketTicker({ listings }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Build a stable, mixed activity feed
  const events = listings.flatMap((l, i) => [
    { id: `${l.id}-bid`, kind: "bid" as const, listing: l, who: l.history[0].addr, amount: l.bid },
    { id: `${l.id}-watch`, kind: "watch" as const, listing: l, who: l.seller, amount: l.watchers },
  ]).slice(0, 14);

  // Duplicate for seamless loop
  const looped = [...events, ...events];

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.style.animation = "ticker-scroll 60s linear infinite";
  }, []);

  return (
    <div className="relative overflow-hidden border-y border-border bg-background/40 py-2 backdrop-blur-md">
      <style>{`@keyframes ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <div ref={trackRef} className="flex w-max items-center gap-8 whitespace-nowrap will-change-transform">
        {looped.map((e, i) => (
          <motion.div
            key={`${e.id}-${i}`}
            className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
          >
            {e.kind === "bid" ? (
              <>
                <span className="size-1.5 rounded-full bg-violet shadow-glow-violet" />
                <span className="text-foreground">{e.who}</span>
                <span>bid</span>
                <span className="text-violet">{formatEth(e.amount)} ETH</span>
                <span>on</span>
                <span className="text-foreground">{e.listing.name}</span>
              </>
            ) : (
              <>
                <span className="size-1.5 rounded-full bg-cyan shadow-glow-cyan" />
                <span className="text-foreground">{e.listing.name}</span>
                <span>watched by</span>
                <span className="text-cyan tabular-nums">{e.amount}</span>
                <span>collectors</span>
              </>
            )}
            <span className="text-muted-foreground/40">·</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
