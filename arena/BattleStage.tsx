import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { BattleCardTile } from "./BattleCardTile";
import { Scoreboard } from "./Scoreboard";
import type { BattleCard } from "./arenaData";

type Phase = "select" | "reveal" | "clash" | "result";
type Outcome = "P" | "O" | "D";

interface Props {
  playerDeck: BattleCard[];
  opponentDeck: BattleCard[];
  playerStakes: BattleCard[];
  opponentStakes: BattleCard[];
  totalRounds?: number;
  onFinish: (result: { pScore: number; oScore: number; outcome: Outcome }) => void;
}

const SELECT_TIME = 18;

export function BattleStage({
  playerDeck,
  opponentDeck,
  playerStakes,
  opponentStakes,
  totalRounds = 7,
  onFinish,
}: Props) {
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<Phase>("select");
  const [timer, setTimer] = useState(SELECT_TIME);
  const [pUsed, setPUsed] = useState<string[]>([]);
  const [oUsed, setOUsed] = useState<string[]>([]);
  const [pScore, setPScore] = useState(0);
  const [oScore, setOScore] = useState(0);

  const [pPlay, setPPlay] = useState<BattleCard | null>(null);
  const [oPlay, setOPlay] = useState<BattleCard | null>(null);
  const [lastOutcome, setLastOutcome] = useState<Outcome | null>(null);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // Timer
  useEffect(() => {
    if (phase !== "select") return;
    setTimer(SELECT_TIME);
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          if (phaseRef.current === "select") {
            // auto-pick the strongest available card
            const avail = playerDeck.filter((c) => !pUsed.includes(c.id));
            const auto = avail.sort((a, b) => b.power - a.power)[0];
            if (auto) commitPlayer(auto);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, phase]);

  function commitPlayer(card: BattleCard) {
    if (phase !== "select") return;
    setPPlay(card);
    setPUsed((u) => [...u, card.id]);

    // opponent AI: matches with weighted power, sometimes baits
    const oAvail = opponentDeck.filter((c) => !oUsed.includes(c.id));
    const remainingRounds = totalRounds - round + 1;
    const oSorted = [...oAvail].sort((a, b) => b.power - a.power);
    // late rounds → strongest, mid → median, early → slight bait
    let oCard: BattleCard;
    if (remainingRounds <= 2) oCard = oSorted[0];
    else if (round === 1) oCard = oSorted[Math.min(oSorted.length - 1, Math.floor(oSorted.length / 2))];
    else oCard = oSorted[Math.floor(Math.random() * Math.min(3, oSorted.length))];
    setOPlay(oCard);
    setOUsed((u) => [...u, oCard.id]);

    setPhase("reveal");
    setTimeout(() => setPhase("clash"), 700);
    setTimeout(() => {
      const outcome: Outcome =
        card.power > oCard.power ? "P" : card.power < oCard.power ? "O" : "D";
      setLastOutcome(outcome);
      if (outcome === "P") setPScore((s) => s + 1);
      else if (outcome === "O") setOScore((s) => s + 1);
      setPhase("result");
    }, 1600);
  }

  // Advance round after result
  useEffect(() => {
    if (phase !== "result") return;
    const t = setTimeout(() => {
      const winsNeeded = Math.ceil(totalRounds / 2);
      const newP = pScore;
      const newO = oScore;
      if (newP >= winsNeeded || newO >= winsNeeded || round >= totalRounds) {
        const outcome: Outcome = newP > newO ? "P" : newO > newP ? "O" : "D";
        onFinish({ pScore: newP, oScore: newO, outcome });
        return;
      }
      setRound((r) => r + 1);
      setPPlay(null);
      setOPlay(null);
      setLastOutcome(null);
      setPhase("select");
    }, 2400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const phaseLabel =
    phase === "select"
      ? "Selection"
      : phase === "reveal"
        ? "Reveal"
        : phase === "clash"
          ? "Clash"
          : "Result";

  const climax = round >= totalRounds - 1;

  return (
    <div className="relative flex min-h-screen flex-col">
      <Scoreboard
        round={round}
        totalRounds={totalRounds}
        pScore={pScore}
        oScore={oScore}
        timer={timer}
        phaseLabel={phaseLabel}
      />

      {/* Stake strip */}
      <div className="pointer-events-none absolute inset-x-0 top-24 z-20 flex items-start justify-between px-6 text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
        <div className="flex gap-1">
          {playerStakes.map((s) => (
            <BattleCardTile key={s.id} card={s} size="sm" staked />
          ))}
        </div>
        <div className="flex gap-1">
          {opponentStakes.map((s) => (
            <BattleCardTile key={s.id} card={s} size="sm" faceDown staked />
          ))}
        </div>
      </div>

      {/* Center arena */}
      <div className="relative flex flex-1 items-center justify-center px-6 pt-44">
        {/* Opponent played card */}
        <div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2">
          <AnimatePresence>
            {oPlay && (
              <motion.div
                key={oPlay.id + "-o"}
                initial={{ opacity: 0, y: -180, rotateY: 180, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: phase === "clash" ? 30 : 0,
                  rotateY: 0,
                  scale: phase === "clash" ? 1.05 : 1,
                }}
                exit={{ opacity: 0, y: -100, scale: 0.7 }}
                transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
              >
                <BattleCardTile card={oPlay} size="lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Player played card */}
        <div className="absolute left-1/2 top-[68%] -translate-x-1/2 -translate-y-1/2">
          <AnimatePresence>
            {pPlay && (
              <motion.div
                key={pPlay.id + "-p"}
                initial={{ opacity: 0, y: 180, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: phase === "clash" ? -30 : 0,
                  scale: phase === "clash" ? 1.05 : 1,
                }}
                exit={{ opacity: 0, y: 100, scale: 0.7 }}
                transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
              >
                <BattleCardTile card={pPlay} size="lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Clash flare */}
        <AnimatePresence>
          {(phase === "clash" || phase === "result") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 1, 0.3], scale: [0.4, 1.4, 1.2] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="size-[260px] rounded-full bg-violet/30 blur-3xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outcome banner */}
        <AnimatePresence>
          {phase === "result" && lastOutcome && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div
                className={`rounded-sm border px-6 py-2 font-display text-2xl font-extrabold uppercase tracking-tight backdrop-blur-xl ${
                  lastOutcome === "P"
                    ? "border-violet/50 bg-violet/15 text-violet"
                    : lastOutcome === "O"
                      ? "border-cyan/50 bg-cyan/10 text-cyan"
                      : "border-border bg-surface/60 text-muted-foreground"
                }`}
              >
                {lastOutcome === "P" ? "Round Won" : lastOutcome === "O" ? "Round Lost" : "Stalemate"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {climax && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,oklch(0.66_0.23_295/0.18)_100%)]"
          />
        )}
      </div>

      {/* Player hand */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-8">
        <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
          Your Hand · {playerDeck.length - pUsed.length} remaining
        </p>
        <div className="flex flex-wrap items-end gap-2">
          {playerDeck.map((c) => {
            const used = pUsed.includes(c.id);
            return (
              <BattleCardTile
                key={c.id}
                card={c}
                size="sm"
                used={used}
                onClick={() => !used && phase === "select" && commitPlayer(c)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
