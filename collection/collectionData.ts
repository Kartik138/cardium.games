import aceCard from "@/assets/ace-card.jpg";
import cardCyan from "@/assets/card-cyan.jpg";
import cardCrimson from "@/assets/card-crimson.jpg";
import cardMint from "@/assets/card-mint.jpg";

export type CollectionRarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Double Rare"
  | "Art Rare"
  | "Special Art Rare"
  | "Super Rare"
  | "Ultra Rare"
  | "ACE"
  | "PROMO";

export interface CollectionCard {
  id: string;
  num: number;
  name: string;
  faction: string;
  rarity: CollectionRarity;
  art: string;
  owned: boolean;
  copies: number;
  serial?: string;
}

export interface RarityVisual {
  label: string;
  short: string;
  ringClass: string;
  glowClass: string;
  textClass: string;
  haloClass: string;
  shimmer: boolean;
  prestige: number; // 1..10 for visual escalation
}

export const collectionRarityStyles: Record<CollectionRarity, RarityVisual> = {
  Common: {
    label: "Common", short: "C",
    ringClass: "ring-white/10",
    glowClass: "shadow-[0_10px_30px_-15px_rgba(255,255,255,0.15)]",
    textClass: "text-muted-foreground",
    haloClass: "bg-white/0",
    shimmer: false, prestige: 1,
  },
  Uncommon: {
    label: "Uncommon", short: "U",
    ringClass: "ring-white/15",
    glowClass: "shadow-[0_14px_40px_-18px_rgba(255,255,255,0.2)]",
    textClass: "text-muted-foreground",
    haloClass: "bg-white/5",
    shimmer: false, prestige: 2,
  },
  Rare: {
    label: "Rare", short: "R",
    ringClass: "ring-white/30",
    glowClass: "shadow-[0_18px_50px_-20px_rgba(255,255,255,0.3)]",
    textClass: "text-foreground",
    haloClass: "bg-white/10",
    shimmer: false, prestige: 3,
  },
  "Double Rare": {
    label: "Double Rare", short: "RR",
    ringClass: "ring-cyan/30",
    glowClass: "shadow-[0_20px_60px_-22px_oklch(0.78_0.15_220/0.45)]",
    textClass: "text-cyan",
    haloClass: "bg-cyan/15",
    shimmer: false, prestige: 4,
  },
  "Art Rare": {
    label: "Art Rare", short: "AR",
    ringClass: "ring-cyan/40",
    glowClass: "shadow-[0_22px_70px_-22px_oklch(0.78_0.15_220/0.55)]",
    textClass: "text-cyan",
    haloClass: "bg-cyan/20",
    shimmer: true, prestige: 5,
  },
  "Special Art Rare": {
    label: "Special Art Rare", short: "SAR",
    ringClass: "ring-cyan/60",
    glowClass: "shadow-[0_26px_80px_-22px_oklch(0.78_0.15_220/0.7)]",
    textClass: "text-cyan",
    haloClass: "bg-cyan/30",
    shimmer: true, prestige: 6,
  },
  "Super Rare": {
    label: "Super Rare", short: "SR",
    ringClass: "ring-violet/60",
    glowClass: "shadow-[0_28px_90px_-22px_oklch(0.66_0.23_295/0.65)]",
    textClass: "text-violet",
    haloClass: "bg-violet/30",
    shimmer: true, prestige: 7,
  },
  "Ultra Rare": {
    label: "Ultra Rare", short: "UR",
    ringClass: "ring-violet",
    glowClass: "shadow-[0_34px_110px_-25px_oklch(0.66_0.23_295/0.8)]",
    textClass: "text-violet",
    haloClass: "bg-violet/40",
    shimmer: true, prestige: 8,
  },
  ACE: {
    label: "ACE", short: "ACE",
    ringClass: "ring-violet",
    glowClass: "shadow-[0_44px_150px_-28px_oklch(0.66_0.23_295/0.95)]",
    textClass: "text-violet",
    haloClass: "bg-violet/55",
    shimmer: true, prestige: 9,
  },
  PROMO: {
    label: "PROMO", short: "PR",
    ringClass: "ring-cyan",
    glowClass: "shadow-[0_44px_160px_-28px_oklch(0.78_0.15_220/0.95)]",
    textClass: "text-cyan",
    haloClass: "bg-cyan/55",
    shimmer: true, prestige: 10,
  },
};

export const rarityOrder: CollectionRarity[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Double Rare",
  "Art Rare",
  "Special Art Rare",
  "Super Rare",
  "Ultra Rare",
  "ACE",
  "PROMO",
];

// Distribution across the 101-card Genesis set
const distribution: Record<CollectionRarity, number> = {
  Common: 28,
  Uncommon: 20,
  Rare: 16,
  "Double Rare": 12,
  "Art Rare": 10,
  "Special Art Rare": 6,
  "Super Rare": 4,
  "Ultra Rare": 3,
  ACE: 1,
  PROMO: 1,
};

const factions = ["Iron Wake", "Tide Choir", "Sable Court", "Void", "Helix Pact"];
const namePool = [
  "Recon Vex", "Pulse Runner", "Halcyon Drift", "Echoed Sentinel", "Neo Tokyo Sector 7",
  "Commandant Kael", "Void Walker Zenith", "Black Lance Aria", "Sable Inquisitor", "Tide Caller Nyx",
  "Iron Vanguard", "Helix Spire", "Null Carrier", "Solar Conduit", "Crimson Choir",
  "Glass Saint", "Vector Saint", "Spire Custodian", "Quanta Witness", "Ember Marshal",
  "Mirror Disciple", "Ghost Lattice", "Hollow Sovereign", "Lumen Praetor", "Obsidian Heir",
  "Static Oracle", "Resonant Knight", "Drift Apostle", "Cinder Herald", "Aegis Pulse",
  "Veiled Centurion", "Halo Cartographer", "Strata Magus", "Echo Praetor", "Salt Diviner",
];

const arts = [cardMint, cardCyan, cardCrimson, aceCard];

// Deterministic pseudo-random for stable SSR/CSR output
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function buildSet(): CollectionCard[] {
  const rand = seeded(7);
  const cards: CollectionCard[] = [];
  let num = 1;
  for (const rarity of rarityOrder) {
    const count = distribution[rarity];
    const visual = collectionRarityStyles[rarity];
    for (let i = 0; i < count; i++) {
      const r = rand();
      const owned = rarity === "ACE" || rarity === "PROMO"
        ? r < 0.25
        : visual.prestige >= 6
          ? r < 0.45
          : visual.prestige >= 4
            ? r < 0.65
            : r < 0.82;
      const name = namePool[(num * 13) % namePool.length];
      const faction = factions[(num * 7) % factions.length];
      const art = rarity === "ACE"
        ? aceCard
        : visual.prestige >= 6
          ? arts[(num * 3) % arts.length]
          : arts[(num * 5) % arts.length];
      cards.push({
        id: String(num).padStart(3, "0") + (rarity === "PROMO" ? "P" : ""),
        num,
        name,
        faction,
        rarity,
        art,
        owned,
        copies: owned ? 1 + Math.floor(rand() * 3) : 0,
        serial: owned ? `#${String(Math.floor(rand() * 9000) + 1000)} / ${rarity === "ACE" ? "250" : rarity === "PROMO" ? "100" : rarity === "Ultra Rare" ? "1500" : "10000"}` : undefined,
      });
      num++;
    }
  }
  return cards;
}

export const genesisSet: CollectionCard[] = buildSet();

export interface RaritySectionData {
  rarity: CollectionRarity;
  cards: CollectionCard[];
  owned: number;
  total: number;
}

export function groupByRarity(set: CollectionCard[]): RaritySectionData[] {
  return rarityOrder.map((rarity) => {
    const cards = set.filter((c) => c.rarity === rarity);
    return {
      rarity,
      cards,
      owned: cards.filter((c) => c.owned).length,
      total: cards.length,
    };
  });
}
