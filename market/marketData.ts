import aceCard from "@/assets/ace-card.jpg";
import cardCyan from "@/assets/card-cyan.jpg";
import cardCrimson from "@/assets/card-crimson.jpg";
import cardMint from "@/assets/card-mint.jpg";
import type { CollectionRarity } from "@/components/collection/collectionData";

export interface AuctionListing {
  id: string;
  cardNum: string;
  name: string;
  faction: string;
  rarity: CollectionRarity;
  art: string;
  serial: string;
  edition: number;
  totalEdition: number;
  /** ETH-equivalent on Base */
  bid: number;
  base: number;
  bids: number;
  watchers: number;
  /** Seconds remaining at page load */
  endsIn: number;
  seller: string;
  /** Are you missing this card from your binder? */
  ownedByUser: boolean;
  tags: ("HOT" | "LOW_SUPPLY" | "HIGH_DEMAND" | "MOST_WATCHED" | "COLLECTION_NEAR")[];
  history: { addr: string; amount: number; ago: string }[];
}

const arts = [aceCard, cardCyan, cardCrimson, cardMint];
const factions = ["Iron Wake", "Tide Choir", "Sable Court", "Void", "Helix Pact"];
const names = [
  "KAIROS VII", "Commandant Kael", "Void Walker Zenith", "Black Lance Aria",
  "Tide Caller Nyx", "Iron Vanguard", "Helix Spire", "Null Carrier",
  "Solar Conduit", "Crimson Choir", "Glass Saint", "Vector Saint",
  "Spire Custodian", "Quanta Witness", "Ember Marshal", "Mirror Disciple",
  "Ghost Lattice", "Hollow Sovereign", "Lumen Praetor", "Obsidian Heir",
];

function mkAddr(seed: number): string {
  const hex = (seed * 9301 + 49297).toString(16).padStart(6, "0").slice(0, 4).toUpperCase();
  const tail = (seed * 233 + 17).toString(16).padStart(3, "0").slice(0, 3).toUpperCase();
  return `0x${hex}…${tail}`;
}

const blueprint: Array<{
  rarity: CollectionRarity;
  bid: number;
  base: number;
  bids: number;
  watchers: number;
  endsIn: number;
  edition: number;
  totalEdition: number;
  ownedByUser: boolean;
  tags: AuctionListing["tags"];
}> = [
  { rarity: "ACE", bid: 18.74, base: 5.0, bids: 47, watchers: 312, endsIn: 1842, edition: 14, totalEdition: 250, ownedByUser: false, tags: ["HOT", "LOW_SUPPLY", "MOST_WATCHED"] },
  { rarity: "PROMO", bid: 22.10, base: 8.0, bids: 31, watchers: 286, endsIn: 9210, edition: 7, totalEdition: 100, ownedByUser: false, tags: ["LOW_SUPPLY", "HOT"] },
  { rarity: "Ultra Rare", bid: 4.62, base: 1.5, bids: 28, watchers: 184, endsIn: 624, edition: 92, totalEdition: 1500, ownedByUser: true, tags: ["HOT"] },
  { rarity: "Super Rare", bid: 2.18, base: 0.8, bids: 19, watchers: 121, endsIn: 3120, edition: 411, totalEdition: 4500, ownedByUser: false, tags: ["HIGH_DEMAND"] },
  { rarity: "Special Art Rare", bid: 1.42, base: 0.5, bids: 14, watchers: 96, endsIn: 5400, edition: 209, totalEdition: 6000, ownedByUser: false, tags: ["COLLECTION_NEAR"] },
  { rarity: "Art Rare", bid: 0.84, base: 0.3, bids: 11, watchers: 72, endsIn: 7820, edition: 814, totalEdition: 10000, ownedByUser: true, tags: [] },
  { rarity: "Ultra Rare", bid: 5.21, base: 1.8, bids: 36, watchers: 244, endsIn: 240, edition: 18, totalEdition: 1500, ownedByUser: false, tags: ["HOT", "MOST_WATCHED"] },
  { rarity: "Double Rare", bid: 0.42, base: 0.15, bids: 7, watchers: 38, endsIn: 12400, edition: 2104, totalEdition: 15000, ownedByUser: false, tags: [] },
  { rarity: "Special Art Rare", bid: 1.96, base: 0.6, bids: 22, watchers: 142, endsIn: 1080, edition: 88, totalEdition: 6000, ownedByUser: false, tags: ["HOT", "COLLECTION_NEAR"] },
  { rarity: "Super Rare", bid: 2.74, base: 0.9, bids: 24, watchers: 156, endsIn: 8400, edition: 312, totalEdition: 4500, ownedByUser: true, tags: ["HIGH_DEMAND"] },
  { rarity: "ACE", bid: 14.20, base: 5.0, bids: 39, watchers: 268, endsIn: 16240, edition: 88, totalEdition: 250, ownedByUser: false, tags: ["LOW_SUPPLY"] },
  { rarity: "Art Rare", bid: 0.62, base: 0.25, bids: 9, watchers: 54, endsIn: 11400, edition: 1142, totalEdition: 10000, ownedByUser: false, tags: [] },
];

export const listings: AuctionListing[] = blueprint.map((b, i) => {
  const idx = b.rarity === "ACE" || b.rarity === "PROMO" ? 0 : (i + 3) % arts.length;
  const history: AuctionListing["history"] = Array.from({ length: 5 }).map((_, j) => {
    const drop = (1 - j * 0.06);
    return {
      addr: mkAddr(i * 11 + j * 7),
      amount: +(b.bid * drop).toFixed(3),
      ago: j === 0 ? "just now" : `${j * 2 + 1}m ago`,
    };
  });
  return {
    id: `LOT-${String(i + 1).padStart(4, "0")}`,
    cardNum: String(((i + 1) * 17) % 101).padStart(3, "0"),
    name: names[(i * 5) % names.length],
    faction: factions[i % factions.length],
    rarity: b.rarity,
    art: arts[idx],
    serial: `#${String(b.edition).padStart(4, "0")} / ${b.totalEdition}`,
    edition: b.edition,
    totalEdition: b.totalEdition,
    bid: b.bid,
    base: b.base,
    bids: b.bids,
    watchers: b.watchers,
    endsIn: b.endsIn,
    seller: mkAddr(i * 41 + 13),
    ownedByUser: b.ownedByUser,
    tags: b.tags,
    history,
  };
});

export function formatEth(n: number): string {
  if (n >= 10) return n.toFixed(2);
  if (n >= 1) return n.toFixed(2);
  return n.toFixed(3);
}

export function formatCountdown(s: number): { label: string; urgent: boolean } {
  if (s <= 0) return { label: "Settled", urgent: false };
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return { label: `${h}h ${String(m).padStart(2, "0")}m`, urgent: false };
  if (m >= 10) return { label: `${m}m ${String(sec).padStart(2, "0")}s`, urgent: false };
  if (m > 0) return { label: `${m}m ${String(sec).padStart(2, "0")}s`, urgent: true };
  return { label: `${sec}s`, urgent: true };
}

export const tagMeta: Record<
  NonNullable<AuctionListing["tags"][number]>,
  { label: string; tone: "violet" | "cyan" | "destructive" | "neutral" }
> = {
  HOT: { label: "Hot Auction", tone: "destructive" },
  LOW_SUPPLY: { label: "Low Supply", tone: "violet" },
  HIGH_DEMAND: { label: "High Demand", tone: "cyan" },
  MOST_WATCHED: { label: "Most Watched", tone: "neutral" },
  COLLECTION_NEAR: { label: "Completes Your Set", tone: "violet" },
};
