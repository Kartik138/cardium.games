import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { VaultAmbience } from "@/components/pack/VaultAmbience";
import { CompletionTracker } from "@/components/collection/CompletionTracker";
import { RarityRow } from "@/components/collection/RarityRow";
import { CardInspector } from "@/components/collection/CardInspector";
import {
  genesisSet,
  groupByRarity,
  rarityOrder,
  type CollectionCard,
  type CollectionRarity,
} from "@/components/collection/collectionData";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Collection · Genesis Archive — Cardium" },
      {
        name: "description",
        content:
          "Your Cardium Genesis archive — track completion across 101 cards, inspect rare pulls, and hunt the missing slots inside the vault.",
      },
      { property: "og:title", content: "Genesis Archive — Cardium Collection" },
      {
        property: "og:description",
        content: "A luxury digital binder for your Cardium collection. Track every rarity tier and hunt the missing cards.",
      },
    ],
  }),
  component: CollectionRoute,
});

function CollectionRoute() {
  const sections = useMemo(() => groupByRarity(genesisSet), []);
  const totalOwned = sections.reduce((n, s) => n + s.owned, 0);
  const totalCards = sections.reduce((n, s) => n + s.total, 0);
  const [active, setActive] = useState<CollectionCard | null>(null);
  const [filter, setFilter] = useState<"all" | "owned" | "missing">("all");
  const [rarityFilter, setRarityFilter] = useState<CollectionRarity | "all">("all");

  const visibleSections = sections
    .filter((s) => rarityFilter === "all" || s.rarity === rarityFilter)
    .map((s) => ({
      ...s,
      cards:
        filter === "owned"
          ? s.cards.filter((c) => c.owned)
          : filter === "missing"
            ? s.cards.filter((c) => !c.owned)
            : s.cards,
    }))
    .filter((s) => s.cards.length > 0);

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <VaultAmbience intensity={1.1} />

      <header className="relative z-30 mx-auto flex max-w-[1400px] items-center justify-between px-6 pt-24 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Genesis Archive · S01
        </span>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="hidden md:inline">Archivist sync · 12s ago</span>
          <span className="size-1.5 animate-pulse rounded-full bg-cyan shadow-glow-cyan" />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-32">
        <CompletionTracker sections={sections} totalOwned={totalOwned} totalCards={totalCards} />

        {/* Filter bar */}
        <div className="sticky top-20 z-20 mb-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-background/70 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-1 rounded-sm bg-surface/60 p-1">
            {(["all", "owned", "missing"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-sm px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors ${
                  filter === f
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setRarityFilter("all")}
              className={`rounded-sm px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors ${
                rarityFilter === "all"
                  ? "bg-violet text-foreground shadow-glow-violet"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Tiers
            </button>
            {rarityOrder.map((r) => (
              <button
                key={r}
                onClick={() => setRarityFilter(r)}
                className={`rounded-sm px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] transition-colors ${
                  rarityFilter === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Rarity sections */}
        <div className="space-y-20">
          {visibleSections.map((s) => (
            <RarityRow
              key={s.rarity}
              rarity={s.rarity}
              cards={s.cards}
              owned={s.owned}
              total={s.total}
              onOpen={setActive}
            />
          ))}
        </div>

        {visibleSections.length === 0 && (
          <p className="py-32 text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            No cards match the current filter.
          </p>
        )}
      </main>

      <CardInspector card={active} onClose={() => setActive(null)} />
    </div>
  );
}
