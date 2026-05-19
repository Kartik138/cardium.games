import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { collectionRarityStyles, type CollectionCard } from "./collectionData";

interface Props {
  card: CollectionCard | null;
  onClose: () => void;
}

/**
 * Cinematic card inspection modal. Enlarged card with rarity treatment,
 * lore placeholder, ownership history, and serial. Click backdrop or ESC closes.
 */
export function CardInspector({ card, onClose }: Props) {
  useEffect(() => {
    if (!card) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [card, onClose]);

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-background/85 backdrop-blur-xl" />
          <div className="absolute left-1/2 top-1/2 size-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/15 blur-[160px]" />

          <InspectorBody card={card} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InspectorBody({ card, onClose }: { card: CollectionCard; onClose: () => void }) {
  const visual = collectionRarityStyles[card.rarity];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      onClick={(e) => e.stopPropagation()}
      className="relative grid w-full max-w-5xl grid-cols-1 gap-8 rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-2xl md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-10"
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full border border-border bg-background/60 font-mono text-xs text-muted-foreground transition hover:text-foreground"
        aria-label="Close"
      >
        ✕
      </button>

      {/* Card preview */}
      <div className="relative mx-auto w-full max-w-sm">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-0.4, 0.4, -0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className={`absolute -inset-12 -z-10 rounded-[2rem] blur-[80px] ${visual.haloClass}`} />
          <div
            className={`relative aspect-[5/7] overflow-hidden rounded-[18px] bg-surface ring-1 ${visual.ringClass} ${visual.glowClass}`}
          >
            {card.owned ? (
              <>
                <img
                  src={card.art}
                  alt={card.name}
                  width={680}
                  height={952}
                  className="size-full select-none object-cover"
                />
                {visual.shimmer && <div className="absolute inset-0 holo-foil opacity-80" />}
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-background" />
            )}
            <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-inset ring-white/10" />

            {/* Chrome */}
            <div className="absolute right-3 top-3 rounded-sm border border-white/20 bg-background/60 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur">
              {visual.short} · #{card.id}
            </div>
            {card.owned && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent p-5 pt-12">
                <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${visual.textClass}`}>
                  {card.faction} · {visual.label}
                </p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">{card.name}</h3>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Detail panel */}
      <div className="flex flex-col gap-6">
        <div>
          <p className={`font-mono text-[10px] uppercase tracking-[0.4em] ${visual.textClass}`}>
            {visual.label} · Genesis · S01
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            {card.owned ? card.name : "Unclaimed Slot"}
          </h2>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Card {String(card.num).padStart(3, "0")} / 101
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
          <Stat label="Owned" value={card.owned ? `${card.copies} cop${card.copies === 1 ? "y" : "ies"}` : "—"} />
          <Stat label="Serial" value={card.serial ?? "—"} mono />
          <Stat label="Rarity" value={visual.label} tint={visual.textClass} />
          <Stat label="Faction" value={card.faction} />
        </div>

        {/* Lore */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Lore</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">
            {card.owned
              ? "Forged within the deep archives of the Genesis vault, this artifact transmits a low-frequency signal only audible to those who carry the same lineage."
              : "This slot remains sealed. Acquire the card to unlock its lore, ownership ledger, and signal frequency."}
          </p>
        </div>

        {/* Ledger */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            Ownership Ledger
          </p>
          <div className="mt-3 space-y-2 font-mono text-[11px]">
            {card.owned ? (
              <>
                <LedgerRow time="03:41 UTC" event="Pulled · Genesis Box #00128" />
                <LedgerRow time="02:18 UTC" event="Authenticated · Vault Sector 9" />
                <LedgerRow time="—" event="Awaiting next transfer" muted />
              </>
            ) : (
              <LedgerRow time="—" event="No ledger entries · card not owned" muted />
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-2">
          {card.owned ? (
            <>
              <button className="rounded-sm bg-violet px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-widest shadow-glow-violet transition-transform hover:scale-[1.02]">
                Showcase
              </button>
              <button className="rounded-sm border border-border bg-surface/50 px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-widest transition-colors hover:bg-surface">
                List on Market
              </button>
            </>
          ) : (
            <button className="rounded-sm bg-cyan px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-background shadow-glow-cyan transition-transform hover:scale-[1.02]">
              Hunt this card
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, mono, tint }: { label: string; value: string; mono?: boolean; tint?: string }) {
  return (
    <div className="bg-surface/60 px-4 py-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
      <p className={`mt-1.5 ${mono ? "font-mono text-xs" : "font-display text-sm font-semibold"} ${tint ?? ""}`}>
        {value}
      </p>
    </div>
  );
}

function LedgerRow({ time, event, muted }: { time: string; event: string; muted?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${muted ? "text-muted-foreground" : "text-foreground/80"}`}>
      <span className="w-20 text-[10px] uppercase tracking-widest text-muted-foreground">{time}</span>
      <span className="flex-1 truncate">{event}</span>
    </div>
  );
}
