import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { CardData } from "./cards";
import { rarityStyles } from "./cards";

interface Props {
  cards: CardData[];
  onComplete: (revealed: CardData[]) => void;
}

/**
 * Stacked deck of cards. The top card is weighted and draggable upward.
 *
 * Rarity drives emotional pacing:
 *  - Low-rarity cards reveal quickly with light glow.
 *  - Mid-rarity cards pause briefly with ambient lighting shift.
 *  - High-rarity (SAR / SR / UR) cards enter with a brief "ignition" —
 *    the ambient light dims, then surges, and interaction is locked
 *    during the suspense window so the user can't rush past it.
 *  - ACE / PROMO add a subtle camera push (entire stage scales up
 *    almost imperceptibly) and a long cinematic title flash.
 *
 * No flips — cards stay forward-facing, sliding up off the deck with
 * believable inertia. Cards beneath have depth blur and subtle scale falloff.
 */
export function CardStackReveal({ cards, onComplete }: Props) {
  const [index, setIndex] = useState(0); // index of currently-top card
  const [hitFlash, setHitFlash] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [armed, setArmed] = useState(false); // user may drag the top card

  const remaining = cards.length - index;
  const current = cards[index];
  const currentStyle = current ? rarityStyles[current.rarity] : null;

  // When a new top card mounts: gate interaction for the suspense duration.
  // For cinematic rarities, also fire the title flash mid-suspense.
  useEffect(() => {
    if (!current) {
      onComplete(cards);
      return;
    }
    const style = rarityStyles[current.rarity];
    setArmed(false);
    const armTimer = setTimeout(() => setArmed(true), style.suspense * 700);
    let flashTimer: ReturnType<typeof setTimeout> | undefined;
    if (style.cinematic) {
      flashTimer = setTimeout(() => {
        setHitFlash(current.rarity);
        setTimeout(() => setHitFlash(null), 1100);
      }, style.suspense * 400);
    }
    return () => {
      clearTimeout(armTimer);
      if (flashTimer) clearTimeout(flashTimer);
    };
  }, [index, current, cards, onComplete]);

  // Subtle camera push for cinematic pulls — the whole stage scales up ~1.5%
  const cameraScale = currentStyle?.cinematic ? 1.025 : 1;

  return (
    <motion.div
      animate={{ scale: cameraScale }}
      transition={{ duration: 1.4, ease: [0.32, 0.72, 0, 1] }}
      className="relative flex flex-col items-center"
    >
      {/* Counter pill */}
      <div className="absolute -top-16 flex items-center gap-3 rounded-full border border-border bg-surface/60 px-4 py-1.5 backdrop-blur">
        <span className="size-1.5 animate-pulse rounded-full bg-cyan shadow-glow-cyan" />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {remaining > 0 ? `${remaining} card${remaining === 1 ? "" : "s"} remaining` : "Pack complete"}
        </span>
      </div>

      {/* Ignition wash for cinematic rarities — dims then surges */}
      <AnimatePresence>
        {currentStyle?.cinematic && current && (
          <motion.div
            key={`ignite-${current.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.15, 0.5, 0] }}
            transition={{
              duration: currentStyle.suspense * 0.95,
              times: [0, 0.2, 0.45, 0.7, 1],
              ease: "easeInOut",
            }}
            className={`pointer-events-none absolute -inset-60 -z-10 rounded-full blur-[160px] ${
              currentStyle.textClass === "text-cyan" ? "bg-cyan/40" : "bg-violet/50"
            }`}
          />
        )}
      </AnimatePresence>

      {/* Stack */}
      <div className="relative h-[520px] w-[340px]" style={{ perspective: 1600 }}>
        <AnimatePresence>
          {cards.map((card, i) => {
            if (i < index || i > index + 3) return null;
            const depth = i - index;
            const isTop = depth === 0;
            return (
              <CardLayer
                key={card.id}
                card={card}
                depth={depth}
                isTop={isTop}
                armed={armed}
                locked={locked}
                onFlyOff={() => {
                  setLocked(true);
                  setTimeout(() => {
                    setIndex((n) => n + 1);
                    setLocked(false);
                  }, 280);
                }}
              />
            );
          })}
        </AnimatePresence>

        {/* Cinematic rarity flash */}
        <AnimatePresence>
          {hitFlash && currentStyle && (
            <motion.div
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center"
            >
              <motion.p
                initial={{ letterSpacing: "0.05em", opacity: 0 }}
                animate={{ letterSpacing: "0.55em", opacity: 1 }}
                exit={{ letterSpacing: "1.1em", opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
                className={`relative font-display text-5xl font-extrabold uppercase ${currentStyle.textClass} drop-shadow-[0_0_30px_currentColor]`}
              >
                {hitFlash}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hint */}
      <AnimatePresence mode="wait">
        {current && (
          <motion.p
            key={`hint-${current.id}-${armed ? "armed" : "wait"}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.5 }}
            className="mt-10 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground"
          >
            {armed ? "Swipe up to reveal" : "Hold ·  ·  ·"}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** A single layered card inside the stack. */
function CardLayer({
  card,
  depth,
  isTop,
  armed,
  locked,
  onFlyOff,
}: {
  card: CardData;
  depth: number;
  isTop: boolean;
  armed: boolean;
  locked: boolean;
  onFlyOff: () => void;
}) {
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-7, 7]);
  // Drag feedback — slight tilt forward as user pulls the card up
  const tiltX = useTransform(y, [-200, 0], [10, 0]);
  const style = rarityStyles[card.rarity];
  const canInteract = isTop && armed && !locked;

  const restOffsets = useMemo(
    () => ({
      y: depth * 9,
      scale: 1 - depth * 0.045,
      opacity: depth === 0 ? 1 : 1 - depth * 0.22,
      blur: depth === 0 ? 0 : depth * 1.6,
    }),
    [depth],
  );

  // Cinematic rarities use a heavier fly-off (longer ease, more inertia)
  const flyDuration = style.cinematic ? 0.75 : 0.55;
  const flyDistance = style.cinematic ? -1100 : -900;

  const dragHandler = canInteract
    ? {
        drag: true as const,
        dragElastic: style.cinematic ? 0.08 : 0.14,
        dragMomentum: false,
        onDragEnd: (_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
          const threshold = style.cinematic ? -200 : -160;
          const flung = info.offset.y < threshold || info.velocity.y < -520;
          if (flung) {
            animate(y, flyDistance, { duration: flyDuration, ease: [0.32, 0.72, 0, 1] });
            animate(x, x.get() * 4, { duration: flyDuration });
            setTimeout(onFlyOff, flyDuration * 700);
          } else {
            animate(y, 0, { type: "spring", stiffness: 220, damping: 28 });
            animate(x, 0, { type: "spring", stiffness: 220, damping: 28 });
          }
        },
      }
    : {};

  // Idle breathing on the top card — barely perceptible, signals "alive"
  const breathing = isTop
    ? {
        y: [0, -3, 0],
        transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" as const },
      }
    : undefined;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{
        opacity: restOffsets.opacity,
        y: restOffsets.y,
        scale: restOffsets.scale,
        filter: `blur(${restOffsets.blur}px)`,
        transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] },
      }}
      exit={{ opacity: 0 }}
      style={{ y, x, rotate, rotateX: tiltX, zIndex: 100 - depth, transformStyle: "preserve-3d" }}
      {...dragHandler}
      className={`absolute inset-0 origin-bottom ${
        canInteract ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
    >
      {/* Drop shadow that deepens with depth — sells the stacked deck weight */}
      <div
        className="absolute inset-x-4 -bottom-2 h-6 rounded-full bg-black/60 blur-xl"
        style={{ opacity: isTop ? 0.6 : 0.35 - depth * 0.08 }}
      />

      {/* Rarity glow halo under the top card */}
      {isTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: style.cinematic ? [0.6, 1, 0.85] : 1,
            scale: 1,
          }}
          transition={{
            delay: style.suspense * 0.4,
            duration: 1.2,
            repeat: style.cinematic ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className={`absolute -inset-10 rounded-[2rem] blur-[80px] ${
            style.textClass === "text-cyan"
              ? "bg-cyan/35"
              : style.textClass === "text-violet"
                ? "bg-violet/45"
                : "bg-white/10"
          }`}
        />
      )}

      {/* Top-card breathing — wraps the card body */}
      <motion.div
        animate={breathing}
        className={`relative size-full overflow-hidden rounded-[20px] bg-surface ring-1 ${style.ringClass} ${style.glowClass}`}
      >
        <img
          src={card.art}
          alt={`${card.name} — ${card.rarity}`}
          loading="lazy"
          width={680}
          height={952}
          draggable={false}
          className="size-full select-none object-cover"
        />
        {style.shimmer && <div className="absolute inset-0 holo-foil opacity-70" />}

        {/* Inner edge highlight — sells card thickness */}
        <div className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/10" />

        {/* Card chrome */}
        <div className="absolute right-3 top-3 rounded-sm border border-white/20 bg-background/60 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider backdrop-blur">
          {card.rarity === "Special Art Rare"
            ? "SAR"
            : card.rarity === "Ultra Rare"
              ? "UR"
              : card.rarity === "Super Rare"
                ? "SR"
                : card.rarity === "Art Rare"
                  ? "AR"
                  : card.rarity === "Common"
                    ? "C"
                    : card.rarity}
          {" · "}#{card.id}
        </div>
        <div className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-full border border-white/20 bg-background/60 font-mono text-xs font-bold backdrop-blur">
          {card.power}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-5 pt-12">
          <p className={`font-mono text-[9px] uppercase tracking-[0.25em] ${style.textClass}`}>
            {card.faction} · {style.label}
          </p>
          <h3 className="mt-1 font-display text-xl font-bold tracking-tight">{card.name}</h3>
        </div>
      </motion.div>
    </motion.div>
  );
}
