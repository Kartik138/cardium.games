export type Tier = "Bronze" | "Silver" | "Gold" | "Diamond" | "Master" | "Apex";

export const tierStyles: Record<Tier, { bg: string; text: string; border: string; glow: string }> = {
  Bronze:  { bg: "bg-[oklch(0.45_0.08_45)]/15",  text: "text-[oklch(0.78_0.12_55)]",  border: "border-[oklch(0.65_0.12_55)]/30",  glow: "" },
  Silver:  { bg: "bg-white/[0.05]",               text: "text-foreground",             border: "border-white/15",                   glow: "" },
  Gold:    { bg: "bg-[oklch(0.78_0.16_85)]/12",  text: "text-[oklch(0.85_0.16_85)]",  border: "border-[oklch(0.78_0.16_85)]/35",  glow: "shadow-[0_0_30px_-10px_oklch(0.78_0.16_85/0.5)]" },
  Diamond: { bg: "bg-cyan/12",                    text: "text-cyan",                   border: "border-cyan/35",                    glow: "shadow-glow-cyan" },
  Master:  { bg: "bg-violet/15",                  text: "text-violet",                 border: "border-violet/40",                  glow: "shadow-glow-violet" },
  Apex:    { bg: "bg-gradient-to-br from-violet/25 to-cyan/20", text: "text-foreground", border: "border-violet/60", glow: "shadow-[0_0_50px_-10px_oklch(0.66_0.23_295/0.7)]" },
};

export type Player = {
  rank: number;
  handle: string;
  tag: string;
  faction: "Void" | "Pulse" | "Arc" | "Helix";
  tier: Tier;
  elo: number;
  wins: number;
  losses: number;
  streak: number;
  movement: number; // positive = up, negative = down
  isYou?: boolean;
};

const factions = ["Void", "Pulse", "Arc", "Helix"] as const;
const names = [
  "ZER0-WULF", "KAIROS·VII", "ORION-Δ", "VEXA·MIRA", "HALCYON-9", "NOVA-RIPPL3", "TYR·KAEL",
  "SYREN-04", "OMEGA·LYR", "CIPHER-X", "ARCHE-7", "RIN·VESSEL", "PHOBOS-AX", "NYX·ECHO",
  "ATLAS·R3", "QORE-SIGMA", "VELA·DRIFT", "MESA-OBL", "AXIOM-77", "TYDAL·SHARD",
];

function pickTier(rank: number): Tier {
  if (rank === 1) return "Apex";
  if (rank <= 4) return "Master";
  if (rank <= 12) return "Diamond";
  if (rank <= 32) return "Gold";
  if (rank <= 80) return "Silver";
  return "Bronze";
}

export function buildLeaderboard(seed = 1): Player[] {
  return names.map((handle, i) => {
    const rank = i + 1;
    const tier = pickTier(rank);
    return {
      rank,
      handle,
      tag: `0x${(0x4f2b ^ (seed * 7 + i * 131)).toString(16).slice(0, 4).padEnd(4, "a")}…${(i * 53 + seed).toString(16).slice(0, 3).padEnd(3, "c")}`,
      faction: factions[(i + seed) % 4],
      tier,
      elo: 3200 - i * 22 - ((i * 11) % 8),
      wins: 184 - i * 4 + ((i * 7) % 6),
      losses: 20 + i * 2 + ((i * 3) % 5),
      streak: i === 0 ? 12 : i === 2 ? 7 : i === 5 ? -3 : ((i % 5) - 2),
      movement: i === 0 ? 0 : ((i * 17 + seed) % 9) - 4,
      isYou: i === 6,
    };
  });
}

export type BracketMatch = {
  id: string;
  a?: { handle: string; tier: Tier; score: number };
  b?: { handle: string; tier: Tier; score: number };
  status: "done" | "live" | "upcoming";
};

export type BracketRound = {
  name: string;
  matches: BracketMatch[];
};

export function buildBracket(): BracketRound[] {
  return [
    {
      name: "Quarterfinals",
      matches: [
        { id: "q1", status: "done", a: { handle: "ZER0-WULF", tier: "Apex", score: 4 }, b: { handle: "AXIOM-77", tier: "Gold", score: 2 } },
        { id: "q2", status: "done", a: { handle: "KAIROS·VII", tier: "Master", score: 4 }, b: { handle: "MESA-OBL", tier: "Gold", score: 1 } },
        { id: "q3", status: "live", a: { handle: "ORION-Δ", tier: "Master", score: 3 }, b: { handle: "PHOBOS-AX", tier: "Diamond", score: 2 } },
        { id: "q4", status: "upcoming", a: { handle: "VEXA·MIRA", tier: "Master", score: 0 }, b: { handle: "HALCYON-9", tier: "Diamond", score: 0 } },
      ],
    },
    {
      name: "Semifinals",
      matches: [
        { id: "s1", status: "upcoming", a: { handle: "ZER0-WULF", tier: "Apex", score: 0 }, b: { handle: "KAIROS·VII", tier: "Master", score: 0 } },
        { id: "s2", status: "upcoming" } as BracketMatch,
      ],
    },
    {
      name: "Finals",
      matches: [{ id: "f1", status: "upcoming" }],
    },
  ];
}

export const dailyRewards = [
  { rank: "1st", reward: "Promo Card · Holo Artifact", glow: "violet" as const },
  { rank: "Top 4", reward: "Booster Box · Genesis", glow: "cyan" as const },
  { rank: "Top 16", reward: "3× Premium Packs", glow: "muted" as const },
];

export const seasonRewards = [
  { tier: "Apex", reward: "1-of-1 Championship ACE", desc: "Custom holographic art · permanent leaderboard etching", glow: "violet" },
  { tier: "Master", reward: "Special Art Rare set", desc: "4 alternate-art Legendaries · exclusive frame", glow: "violet" },
  { tier: "Diamond", reward: "Ultra Rare drop · ACE shard", desc: "Guaranteed Ultra Rare + 25% ACE shard", glow: "cyan" },
  { tier: "Gold", reward: "Premium Booster Box", desc: "Full Genesis box with guaranteed Legendary", glow: "muted" },
];

export const liveFeed = [
  { t: 0, type: "win", text: "ZER0-WULF advanced to Semifinals · QF1 4–2" },
  { t: 1, type: "promo", text: "VEXA·MIRA promoted to Master · 2,841 ELO" },
  { t: 2, type: "streak", text: "NOVA-RIPPL3 on 8-win streak · climbing Diamond" },
  { t: 3, type: "qualify", text: "Top 32 cutoff now 2,612 ELO · 47m to lock" },
  { t: 4, type: "match", text: "ORION-Δ vs PHOBOS-AX · Game 5 deciding round" },
  { t: 5, type: "win", text: "KAIROS·VII secured semifinal slot · 4–1" },
  { t: 6, type: "drop", text: "AXIOM-77 demoted to Gold · -3 streak" },
];
