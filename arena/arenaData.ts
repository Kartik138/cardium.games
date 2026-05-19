import aceCard from "@/assets/ace-card.jpg";
import cardCyan from "@/assets/card-cyan.jpg";
import cardCrimson from "@/assets/card-crimson.jpg";
import cardMint from "@/assets/card-mint.jpg";

export type BattleRarity =
  | "Common"
  | "Rare"
  | "Art Rare"
  | "Special Art Rare"
  | "Super Rare"
  | "Ultra Rare"
  | "ACE";

export interface BattleCard {
  id: string;
  name: string;
  faction: string;
  rarity: BattleRarity;
  art: string;
  power: number;
  /** Tactical archetype, used for clash flavor copy. */
  type: "Strike" | "Guard" | "Cipher" | "Vector";
}

const arts = [cardMint, cardCyan, cardCrimson, aceCard];

const factions = ["Iron Wake", "Tide Choir", "Sable Court", "Void", "Helix Pact"];
const types: BattleCard["type"][] = ["Strike", "Guard", "Cipher", "Vector"];

const names = [
  "Recon Vex", "Pulse Runner", "Halcyon Drift", "Echoed Sentinel",
  "Sector Seven", "Commandant Kael", "Void Walker Zenith", "Black Lance Aria",
  "Tide Caller Nyx", "Iron Vanguard", "Helix Spire", "Null Carrier",
  "Solar Conduit", "Crimson Choir", "Glass Saint", "Vector Saint",
  "Spire Custodian", "Quanta Witness", "Ember Marshal", "Mirror Disciple",
  "Ghost Lattice", "Hollow Sovereign", "Lumen Praetor", "Obsidian Heir",
];

const rarityCycle: BattleRarity[] = [
  "Common", "Common", "Rare", "Common", "Rare", "Art Rare",
  "Rare", "Special Art Rare", "Super Rare", "Ultra Rare", "ACE",
];

function powerFor(r: BattleRarity): number {
  switch (r) {
    case "Common": return 3 + Math.floor(Math.random() * 2);
    case "Rare": return 5 + Math.floor(Math.random() * 2);
    case "Art Rare": return 6 + Math.floor(Math.random() * 2);
    case "Special Art Rare": return 7;
    case "Super Rare": return 8;
    case "Ultra Rare": return 9;
    case "ACE": return 10;
  }
}

function artFor(r: BattleRarity, i: number): string {
  if (r === "ACE") return aceCard;
  if (r === "Ultra Rare" || r === "Super Rare") return aceCard;
  return arts[i % arts.length];
}

export function buildDeck(seed: string): BattleCard[] {
  // 11 cards, deterministic enough for the visual demo
  return rarityCycle.map((r, i) => ({
    id: `${seed}-${String(i + 1).padStart(2, "0")}`,
    name: names[(i * 3 + seed.charCodeAt(0)) % names.length],
    faction: factions[(i + seed.charCodeAt(0)) % factions.length],
    rarity: r,
    art: artFor(r, i + seed.charCodeAt(0)),
    power: powerFor(r),
    type: types[i % types.length],
  }));
}

export interface BattlePlayer {
  handle: string;
  wallet: string;
  rank: string;
  elo: number;
  region: string;
  avatarHue: number; // for ambient ring color
  winRate: number;
  streak: number;
}

export const localPlayer: BattlePlayer = {
  handle: "PRODIGY",
  wallet: "0x4F2A…81C",
  rank: "Diamond II",
  elo: 2148,
  region: "NA-East",
  avatarHue: 285,
  winRate: 0.61,
  streak: 4,
};

export const opponentPlayer: BattlePlayer = {
  handle: "EXARCH",
  wallet: "0x9C7D…44B",
  rank: "Diamond I",
  elo: 2196,
  region: "EU-West",
  avatarHue: 220,
  winRate: 0.58,
  streak: 2,
};

export const rarityRing: Record<BattleRarity, string> = {
  Common: "ring-white/10",
  Rare: "ring-white/30",
  "Art Rare": "ring-cyan/40",
  "Special Art Rare": "ring-cyan/60",
  "Super Rare": "ring-violet/60",
  "Ultra Rare": "ring-violet",
  ACE: "ring-violet",
};

export const rarityGlow: Record<BattleRarity, string> = {
  Common: "shadow-[0_10px_30px_-18px_rgba(255,255,255,0.2)]",
  Rare: "shadow-[0_14px_45px_-20px_rgba(255,255,255,0.35)]",
  "Art Rare": "shadow-[0_18px_60px_-22px_oklch(0.78_0.15_220/0.55)]",
  "Special Art Rare": "shadow-[0_22px_75px_-22px_oklch(0.78_0.15_220/0.7)]",
  "Super Rare": "shadow-[0_26px_90px_-22px_oklch(0.66_0.23_295/0.7)]",
  "Ultra Rare": "shadow-[0_34px_120px_-25px_oklch(0.66_0.23_295/0.85)]",
  ACE: "shadow-[0_44px_160px_-28px_oklch(0.66_0.23_295/0.95)]",
};

export const rarityText: Record<BattleRarity, string> = {
  Common: "text-muted-foreground",
  Rare: "text-foreground",
  "Art Rare": "text-cyan",
  "Special Art Rare": "text-cyan",
  "Super Rare": "text-violet",
  "Ultra Rare": "text-violet",
  ACE: "text-violet",
};
