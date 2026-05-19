import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArenaAmbience } from "@/components/arena/ArenaAmbience";
import { Matchmaking } from "@/components/arena/Matchmaking";
import { VSReveal } from "@/components/arena/VSReveal";
import { StakeChamber } from "@/components/arena/StakeChamber";
import { BattleStage } from "@/components/arena/BattleStage";
import { Victory } from "@/components/arena/Victory";
import { buildDeck, type BattleCard } from "@/components/arena/arenaData";

type Stage = "matchmaking" | "vs" | "stake" | "battle" | "result";

export const Route = createFileRoute("/arena")({
  head: () => ({
    meta: [
      { title: "Arena · Ranked Nexus — Cardium" },
      {
        name: "description",
        content:
          "Cardium PvP — cinematic tactical card duels on Base. Stake cards, predict your opponent, and climb the Diamond ladder.",
      },
      { property: "og:title", content: "Arena · Cardium Ranked Nexus" },
      {
        property: "og:description",
        content: "Tactical card duels with real card stakes. Esports-grade arena built for the elite.",
      },
    ],
  }),
  component: ArenaRoute,
});

function ArenaRoute() {
  const [stage, setStage] = useState<Stage>("matchmaking");
  const [seed, setSeed] = useState(0);

  const playerDeck = useMemo<BattleCard[]>(() => buildDeck("P" + seed), [seed]);
  const opponentDeck = useMemo<BattleCard[]>(() => buildDeck("O" + seed), [seed]);

  // Opponent stakes — their three highest cards
  const opponentStakes = useMemo<BattleCard[]>(
    () => [...opponentDeck].sort((a, b) => b.power - a.power).slice(0, 3),
    [opponentDeck]
  );

  const [playerStakes, setPlayerStakes] = useState<BattleCard[]>([]);
  const [matchResult, setMatchResult] = useState<{
    pScore: number;
    oScore: number;
    outcome: "P" | "O" | "D";
  } | null>(null);

  const intensity: 0 | 1 | 2 =
    stage === "battle"
      ? matchResult
        ? 2
        : 1
      : stage === "result"
        ? 2
        : 0;
  const hue =
    stage === "result" && matchResult
      ? matchResult.outcome === "P"
        ? "violet"
        : matchResult.outcome === "O"
          ? "cyan"
          : "neutral"
      : "neutral";

  function rematch() {
    setSeed((s) => s + 1);
    setPlayerStakes([]);
    setMatchResult(null);
    setStage("matchmaking");
  }

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <ArenaAmbience intensity={intensity} hue={hue} />

      {/* Contextual sub-header */}
      <header className="relative z-40 mx-auto flex max-w-[1400px] items-center justify-between px-6 pt-24 pb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Ranked Nexus · {stage.toUpperCase()}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
          ● Live · S01
        </span>
      </header>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {stage === "matchmaking" && (
            <motion.div key="mm" exit={{ opacity: 0 }}>
              <Matchmaking onFound={() => setStage("vs")} />
            </motion.div>
          )}
          {stage === "vs" && (
            <motion.div key="vs" exit={{ opacity: 0 }}>
              <VSReveal onComplete={() => setStage("stake")} />
            </motion.div>
          )}
          {stage === "stake" && (
            <motion.div key="stake" exit={{ opacity: 0 }}>
              <StakeChamber
                deck={playerDeck}
                opponentStakes={opponentStakes}
                onLockIn={(s) => {
                  setPlayerStakes(s);
                  setStage("battle");
                }}
              />
            </motion.div>
          )}
          {stage === "battle" && (
            <motion.div key="battle" exit={{ opacity: 0 }}>
              <BattleStage
                playerDeck={playerDeck}
                opponentDeck={opponentDeck}
                playerStakes={playerStakes}
                opponentStakes={opponentStakes}
                onFinish={(r) => {
                  setMatchResult(r);
                  setStage("result");
                }}
              />
            </motion.div>
          )}
          {stage === "result" && matchResult && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Victory
                outcome={matchResult.outcome}
                pScore={matchResult.pScore}
                oScore={matchResult.oScore}
                playerStakes={playerStakes}
                opponentStakes={opponentStakes}
                onRematch={rematch}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
