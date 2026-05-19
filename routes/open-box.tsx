import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { VaultAmbience } from "@/components/pack/VaultAmbience";
import { CardStackReveal } from "@/components/pack/CardStackReveal";
import { rarityStyles, type CardData } from "@/components/pack/cards";
import { BoosterBoxStage } from "@/components/box/BoosterBoxStage";
import { PackTray } from "@/components/box/PackTray";
import { FoilPack } from "@/components/box/FoilPack";
import { buildBox, TOTAL_PACKS } from "@/components/box/cardPool";

export const Route = createFileRoute("/open-box")({
  head: () => ({
    meta: [
      { title: "Open Genesis Box — Cardium" },
      {
        name: "description",
        content:
          "Cinematic booster box opening — unseal the box, slice each foil pack, and witness the final guaranteed ACE reveal.",
      },
    ],
  }),
  component: OpenBoxRoute,
});

type Phase = "sealed" | "tray" | "slicing" | "revealing" | "complete";

function OpenBoxRoute() {
  const packs = useMemo(() => buildBox(), []);
  const [phase, setPhase] = useState<Phase>("sealed");
  const [opened, setOpened] = useState<boolean[]>(() => Array(TOTAL_PACKS).fill(false));
  const [active, setActive] = useState(0);
  const [pulled, setPulled] = useState<CardData[]>([]);

  const climaxIntensity = active >= 9 ? 1.6 : active >= 6 ? 1.2 : 1;

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <VaultAmbience intensity={phase === "sealed" ? 0.8 : climaxIntensity} />

      {/* Cinematic climax lighting overlay */}
      <AnimatePresence>
        {active >= 9 && phase !== "sealed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="pointer-events-none absolute inset-0 z-0"
          >
            <div className="absolute left-1/2 top-1/2 size-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-[160px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-violet/10" />
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative z-30 flex items-center justify-between px-6 pt-24 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Genesis Box · S01
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
          ● 24 packs · Guaranteed ACE
        </span>
      </header>

      <main className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-6 pb-20">
        <AnimatePresence mode="wait">
          {phase === "sealed" && (
            <motion.div
              key="sealed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.92 }}
              transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col items-center gap-12"
            >
              <BoosterBoxStage onOpened={() => setPhase("tray")} />
            </motion.div>
          )}

          {phase === "tray" && (
            <motion.div
              key="tray"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="w-full"
            >
              <div className="mx-auto mb-10 max-w-2xl text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan">
                  Box Unsealed
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">
                  {active >= 9
                    ? "Final packs. Hold your breath."
                    : active >= 6
                      ? "The deck thickens. Keep going."
                      : "Open each pack in sequence."}
                </h2>
              </div>
              <div className="flex justify-center">
                <PackTray
                  total={TOTAL_PACKS}
                  openedFlags={opened}
                  currentIndex={active}
                  onSelect={(i) => {
                    setActive(i);
                    setPhase("slicing");
                  }}
                />
              </div>
            </motion.div>
          )}

          {phase === "slicing" && (
            <motion.div
              key={`slicing-${active}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="flex flex-col items-center gap-8"
            >
              <div className="text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
                  Pack {String(active + 1).padStart(2, "0")} / {TOTAL_PACKS}
                </p>
              </div>
              <FoilPack
                label={`Booster · ${String(active + 1).padStart(2, "0")}`}
                onOpened={() => setPhase("revealing")}
              />
            </motion.div>
          )}

          {phase === "revealing" && (
            <motion.div
              key={`reveal-${active}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            >
              <CardStackReveal
                cards={packs[active]}
                onComplete={(all) => {
                  setPulled((prev) => [...prev, ...all]);
                  const nextOpened = [...opened];
                  nextOpened[active] = true;
                  setOpened(nextOpened);
                  const next = active + 1;
                  setTimeout(() => {
                    if (next >= TOTAL_PACKS) {
                      setPhase("complete");
                    } else {
                      setActive(next);
                      setPhase("tray");
                    }
                  }, 600);
                }}
              />
            </motion.div>
          )}

          {phase === "complete" && (
            <Summary
              key="done"
              cards={pulled}
              onReset={() => {
                setOpened(Array(TOTAL_PACKS).fill(false));
                setActive(0);
                setPulled([]);
                setPhase("sealed");
              }}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Summary({ cards, onReset }: { cards: CardData[]; onReset: () => void }) {
  const hits = cards.filter((c) =>
    ["Special Art Rare", "Super Rare", "Ultra Rare", "ACE", "PROMO"].includes(c.rarity),
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="w-full max-w-6xl"
    >
      <div className="mb-12 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan">Box Complete</p>
        <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-6xl">
          {hits.length} hit{hits.length === 1 ? "" : "s"} secured.
        </h2>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {cards.length} cards · Genesis S01
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3 md:grid-cols-10">
        {cards.map((c, i) => {
          const style = rarityStyles[c.rarity];
          return (
            <motion.div
              key={`${c.id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`relative aspect-[5/7] overflow-hidden rounded-md ring-1 ${style.ringClass} ${style.glowClass}`}
            >
              <img
                src={c.art}
                alt={c.name}
                loading="lazy"
                width={260}
                height={364}
                className="size-full object-cover"
              />
              {style.shimmer && <div className="absolute inset-0 holo-foil opacity-50" />}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-1.5">
                <p className={`truncate font-mono text-[7px] uppercase tracking-widest ${style.textClass}`}>
                  {style.label}
                </p>
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
          Open Another Box
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
