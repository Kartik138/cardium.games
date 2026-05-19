import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { collectionRarityStyles } from "@/components/collection/collectionData";
import {
  formatCountdown,
  formatEth,
  tagMeta,
  type AuctionListing,
} from "./marketData";

interface Props {
  listing: AuctionListing | null;
  onClose: () => void;
}

const toneClass: Record<"violet" | "cyan" | "destructive" | "neutral", string> = {
  violet: "border-violet/40 bg-violet/10 text-violet",
  cyan: "border-cyan/40 bg-cyan/10 text-cyan",
  destructive: "border-destructive/40 bg-destructive/10 text-destructive",
  neutral: "border-border bg-surface/60 text-foreground",
};

export function AuctionDetail({ listing, onClose }: Props) {
  const [currentBid, setCurrentBid] = useState(listing?.bid ?? 0);
  const [bidCount, setBidCount] = useState(listing?.bids ?? 0);
  const [history, setHistory] = useState(listing?.history ?? []);
  const [countdown, setCountdown] = useState(listing?.endsIn ?? 0);
  const [pulse, setPulse] = useState(false);
  const [confirming, setConfirming] = useState<null | "pending" | "locked">(null);

  // Reset state when a new listing opens
  useEffect(() => {
    if (!listing) return;
    setCurrentBid(listing.bid);
    setBidCount(listing.bids);
    setHistory(listing.history);
    setCountdown(listing.endsIn);
    setConfirming(null);
  }, [listing?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tick countdown
  useEffect(() => {
    if (!listing) return;
    const id = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [listing?.id]);

  // ESC to close
  useEffect(() => {
    if (!listing) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [listing, onClose]);

  const minNext = useMemo(() => +(currentBid * 1.05).toFixed(3), [currentBid]);

  function placeBid() {
    if (!listing) return;
    setConfirming("pending");
    setTimeout(() => {
      setCurrentBid(minNext);
      setBidCount((b) => b + 1);
      setHistory((h) => [
        { addr: "0x4F2A…81C", amount: minNext, ago: "just now" },
        ...h.map((x) => ({ ...x, ago: x.ago === "just now" ? "30s ago" : x.ago })),
      ].slice(0, 7));
      setPulse(true);
      setConfirming("locked");
      setTimeout(() => setPulse(false), 1100);
      setTimeout(() => setConfirming(null), 1600);
    }, 900);
  }

  if (!listing) return null;
  const r = collectionRarityStyles[listing.rarity];
  const cd = formatCountdown(countdown);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 px-4 py-8 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border border-border bg-background/95 shadow-card md:grid-cols-[1.05fr_1fr]"
        >
          {/* Left: cinematic card */}
          <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-surface/50 to-background p-8 md:p-12 [perspective:1500px]">
            <div className={`pointer-events-none absolute -inset-8 ${r.haloClass} opacity-60 blur-3xl`} />
            <motion.div
              animate={pulse ? { scale: [1, 1.04, 1] } : { y: [0, -8, 0] }}
              transition={
                pulse
                  ? { duration: 0.7, ease: "easeOut" }
                  : { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative aspect-[5/7] w-[260px] md:w-[340px]"
            >
              <div className={`absolute -inset-3 -z-10 rounded-2xl ${r.glowClass}`} />
              <div className={`relative size-full overflow-hidden rounded-xl ring-1 ${r.ringClass}`}>
                <img src={listing.art} alt={listing.name} className="size-full object-cover" />
                {r.shimmer && <div className="absolute inset-0 holo-foil opacity-80" />}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-4">
                  <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${r.textClass}`}>
                    {r.label} · {listing.serial}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight">
                    {listing.name}
                  </h3>
                </div>
                <div className="absolute right-3 top-3 rounded-sm border border-white/15 bg-background/70 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest backdrop-blur">
                  {listing.rarity === "ACE" || listing.rarity === "PROMO" ? r.short : `#${listing.cardNum}`}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: lot dossier */}
          <div className="flex flex-col gap-6 overflow-y-auto border-l border-border p-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
                  Lot {listing.id} · Genesis Set
                </p>
                <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                  {listing.name}
                </h2>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {listing.faction} · Edition {listing.edition} of {listing.totalEdition}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-sm border border-border bg-surface/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
              >
                Close ESC
              </button>
            </div>

            {/* Tags */}
            {listing.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {listing.tags.map((t) => (
                  <span
                    key={t}
                    className={`rounded-sm border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest ${toneClass[tagMeta[t].tone]}`}
                  >
                    {tagMeta[t].label}
                  </span>
                ))}
              </div>
            )}

            {/* Bid panel */}
            <div className="rounded-xl border border-violet/30 bg-violet/5 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                    Current bid
                  </p>
                  <motion.p
                    key={currentBid}
                    initial={{ scale: 0.95, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    className="font-display text-4xl font-extrabold tabular-nums leading-none text-foreground"
                  >
                    {formatEth(currentBid)}
                    <span className="ml-1.5 font-mono text-xs font-semibold text-muted-foreground">
                      ETH
                    </span>
                  </motion.p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Base {formatEth(listing.base)} · {bidCount} bids · {listing.watchers} watching
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                    Ends in
                  </p>
                  <p
                    className={`font-display text-2xl font-bold tabular-nums ${
                      cd.urgent ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    {cd.label}
                  </p>
                </div>
              </div>

              <button
                onClick={placeBid}
                disabled={!!confirming}
                className="mt-5 flex w-full items-center justify-between gap-4 rounded-md bg-violet px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-foreground shadow-glow-violet transition-transform hover:scale-[1.01] disabled:opacity-70"
              >
                <span>
                  {confirming === "pending"
                    ? "Signing on Base"
                    : confirming === "locked"
                      ? "Bid Locked"
                      : "Place Bid"}
                </span>
                <span className="tabular-nums">{formatEth(minNext)} ETH</span>
              </button>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                Outbid funds release automatically · gasless via Cardium relayer
              </p>
            </div>

            {/* Bid history */}
            <div>
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                Live Bid Ledger
              </p>
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {history.map((h, i) => (
                  <motion.li
                    key={`${h.addr}-${h.amount}-${i}`}
                    initial={i === 0 ? { opacity: 0, x: -10 } : undefined}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between bg-surface/30 px-4 py-2.5 font-mono text-[11px] tabular-nums"
                  >
                    <span className="text-foreground">{h.addr}</span>
                    <span className={i === 0 ? "text-violet" : "text-muted-foreground"}>
                      {formatEth(h.amount)} ETH
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
                      {h.ago}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Provenance */}
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
              {[
                { k: "Seller", v: listing.seller },
                { k: "Mint Edition", v: `${listing.edition} / ${listing.totalEdition}` },
                { k: "Set", v: "Genesis Origin · S01" },
                { k: "Chain", v: "Base" },
              ].map((c) => (
                <div key={c.k} className="bg-background p-3">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    {c.k}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-foreground">{c.v}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
