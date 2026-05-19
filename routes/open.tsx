import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { VaultAmbience } from "@/components/pack/VaultAmbience";
import { SealedPack } from "@/components/pack/SealedPack";
import { CardStackReveal } from "@/components/pack/CardStackReveal";
import { genesisPack, rarityStyles, type CardData } from "@/components/pack/cards";

export const Route = createFileRoute("/open")({
  head: () => ({
    meta: [
      { title: "Open Genesis Pack — Cardium" },
      { name: "description", content: "Cinematic booster pack opening — tear the seal, swipe each card, witness the pull." },
    ],
  }),
  component: OpenPackRoute,
});

type Phase = "idle" | "revealing" | "complete";

function OpenPackRoute() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [pulled, setPulled] = useState<CardData[]>([]);

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <VaultAmbience intensity={phase === "idle" ? 0.7 : 1.2} />

      <header className="relative z-30 flex items-center justify-between px-6 pt-24 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Genesis Pack · S01
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
          ● Vault · Sealed
        </span>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 pb-20">
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col items-center gap-16"
            >
              <SealedPack onOpened={() => setPhase("revealing")} />
            </motion.div>
          )}

          {phase === "revealing" && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            >
              <CardStackReveal
                cards={genesisPack}
                onComplete={(all) => {
                  setPulled(all);
                  setTimeout(() => setPhase("complete"), 400);
                }}
              />
            </motion.div>
          )}

          {phase === "complete" && <Summary key="done" cards={pulled} onReset={() => setPhase("idle")} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Summary({ cards, onReset }: { cards: CardData[]; onReset: () => void }) {
  const hits = cards.filter((c) => ["Special Art Rare", "Super Rare", "Ultra Rare", "ACE", "PROMO"].includes(c.rarity));
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-5xl"
    >
      <div className="mb-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan">Pack Complete</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
          {hits.length > 0 ? `${hits.length} hit${hits.length === 1 ? "" : "s"} secured.` : "Sealed and shipped."}
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
        {cards.map((c, i) => {
          const style = rarityStyles[c.rarity];
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`relative aspect-[5/7] overflow-hidden rounded-lg ring-1 ${style.ringClass} ${style.glowClass}`}
            >
              <img src={c.art} alt={c.name} loading="lazy" width={300} height={420} className="size-full object-cover" />
              {style.shimmer && <div className="absolute inset-0 holo-foil opacity-50" />}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-2">
                <p className={`font-mono text-[8px] uppercase tracking-widest ${style.textClass}`}>{style.label}</p>
                <p className="truncate font-display text-[11px] font-bold">{c.name}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 flex items-center justify-center gap-3">
        <button
          onClick={onReset}
          className="rounded-sm bg-violet px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest shadow-glow-violet transition-transform hover:scale-[1.02]"
        >
          Open Another
        </button>
        <Link
          to="/"
          className="rounded-sm border border-border bg-surface/40 px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors hover:bg-surface"
        >
          Return to Vault
        </Link>
      </div>
    </motion.div>
  );
}
