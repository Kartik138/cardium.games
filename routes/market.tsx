import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { VaultAmbience } from "@/components/pack/VaultAmbience";
import { AuctionCard } from "@/components/market/AuctionCard";
import { AuctionDetail } from "@/components/market/AuctionDetail";
import { MissingAlert } from "@/components/market/MissingAlert";
import { MarketTicker } from "@/components/market/MarketTicker";
import { listings, type AuctionListing } from "@/components/market/marketData";
import { collectionRarityStyles, rarityOrder, type CollectionRarity } from "@/components/collection/collectionData";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Auction House · Genesis Exchange — Cardium" },
      {
        name: "description",
        content:
          "Live Cardium auction floor — bid on rare Genesis cards, watch top lots, and complete your archive on Base.",
      },
      { property: "og:title", content: "Auction House — Cardium Exchange" },
      {
        property: "og:description",
        content: "A luxury collectible exchange for futuristic TCG cards. Live auctions, holographic lots, instant settlement on Base.",
      },
    ],
  }),
  component: MarketRoute,
});

type SortKey = "ending" | "top-bid" | "most-watched" | "newest";

function MarketRoute() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [rarity, setRarity] = useState<CollectionRarity | "all">("all");
  const [view, setView] = useState<"all" | "missing" | "owned">("all");
  const [sort, setSort] = useState<SortKey>("ending");

  // Synthetic global tick — auctions count down live
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const enriched = useMemo(
    () => listings.map((l) => ({ ...l, _countdown: Math.max(0, l.endsIn - tick) })),
    [tick]
  );

  const filtered = useMemo(() => {
    let arr = enriched.slice();
    if (rarity !== "all") arr = arr.filter((l) => l.rarity === rarity);
    if (view === "missing") arr = arr.filter((l) => !l.ownedByUser);
    if (view === "owned") arr = arr.filter((l) => l.ownedByUser);
    switch (sort) {
      case "ending":
        arr.sort((a, b) => a._countdown - b._countdown);
        break;
      case "top-bid":
        arr.sort((a, b) => b.bid - a.bid);
        break;
      case "most-watched":
        arr.sort((a, b) => b.watchers - a.watchers);
        break;
      case "newest":
        arr.sort((a, b) => b.endsIn - a.endsIn);
        break;
    }
    return arr;
  }, [enriched, rarity, view, sort]);

  const totalVolume = listings.reduce((n, l) => n + l.bid, 0);
  const liveLots = listings.length;
  const topLot = [...listings].sort((a, b) => b.bid - a.bid)[0];

  const open: AuctionListing | null = openId
    ? listings.find((l) => l.id === openId) ?? null
    : null;

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <VaultAmbience intensity={0.9} />

      <header className="relative z-30 mx-auto flex max-w-[1400px] items-center justify-between px-6 pt-24 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Auction House · Genesis Exchange
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
          ● Live Floor · S01
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
        {/* Hero stats */}
        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
            <div className="rounded-2xl border border-border bg-surface/30 p-6 backdrop-blur-md">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-violet">
                Genesis Exchange
              </p>
              <h1 className="mt-3 font-display text-4xl font-extrabold leading-[0.95] tracking-tight md:text-5xl">
                A curated floor for the rarest Genesis lots.
              </h1>
              <p className="mt-3 max-w-md text-pretty text-sm text-muted-foreground">
                Every listing is auction-only. Settlement is instant on Base. Outbid funds release
                automatically — no manual reclamation, no gas friction.
              </p>
            </div>
            {[
              { k: "Live Lots", v: liveLots, sub: "active across 7 tiers" },
              { k: "Floor Volume · 24h", v: `${totalVolume.toFixed(2)} Ξ`, sub: "+18% vs yesterday" },
              { k: "Top Lot", v: topLot.name.split(" ")[0], sub: `${topLot.bid.toFixed(2)} Ξ · ${topLot.rarity}` },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-border bg-surface/30 p-6 backdrop-blur-md">
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                  {s.k}
                </p>
                <p className="mt-2 font-display text-3xl font-extrabold tabular-nums tracking-tight">
                  {s.v}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-cyan">
                  {s.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ticker */}
        <div className="mt-8">
          <MarketTicker listings={listings} />
        </div>

        {/* Missing alert */}
        <div className="mt-10">
          <MissingAlert listings={listings} onJump={(id) => setOpenId(id)} />
        </div>

        {/* Filter bar */}
        <div className="sticky top-20 z-20 mt-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-background/70 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-1 rounded-sm bg-surface/60 p-1">
            {(["all", "missing", "owned"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-sm px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  view === v ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v === "missing" ? "Missing from Vault" : v === "owned" ? "Already Owned" : "All Lots"}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setRarity("all")}
              className={`rounded-sm px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors ${
                rarity === "all"
                  ? "bg-violet text-foreground shadow-glow-violet"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Tiers
            </button>
            {rarityOrder
              .filter((r) => collectionRarityStyles[r].prestige >= 3)
              .map((r) => (
                <button
                  key={r}
                  onClick={() => setRarity(r)}
                  className={`rounded-sm px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors ${
                    rarity === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {collectionRarityStyles[r].short}
                </button>
              ))}
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-sm border border-border bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-foreground outline-none focus:border-violet"
            >
              <option value="ending">Ending soonest</option>
              <option value="top-bid">Top bid</option>
              <option value="most-watched">Most watched</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((l) => (
            <AuctionCard
              key={l.id}
              listing={l}
              countdown={l._countdown}
              onOpen={() => setOpenId(l.id)}
            />
          ))}
        </section>

        {filtered.length === 0 && (
          <p className="py-32 text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            No lots match the current filter.
          </p>
        )}
      </main>

      {open && <AuctionDetail listing={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
