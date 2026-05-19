import type { CardData, Rarity } from "@/components/pack/cards";
import aceCard from "@/assets/ace-card.jpg";
import cardCyan from "@/assets/card-cyan.jpg";
import cardCrimson from "@/assets/card-crimson.jpg";
import cardMint from "@/assets/card-mint.jpg";

const ARTS = [cardMint, cardCyan, cardCrimson, aceCard];
const FACTIONS = ["Iron Wake", "Tide Choir", "Sable Court", "Void"] as const;
const NAMES = [
  "Recon Vex", "Pulse Runner", "Halcyon Drift", "Echoed Sentinel",
  "Neo Tokyo Sector 7", "Cinder Wraith", "Glass Lattice", "Solar Vane",
  "Reverb Captain", "Static Choir", "Mercury Bloom", "Iron Hymn",
  "Last Light Foundry", "Subzero Spire", "Quartz Liturgy", "Black Tide Custodian",
  "Helix Convoy", "Ferrum Acolyte", "Lumen Cartographer", "Phase Crucible",
];

function pick<T>(arr: readonly T[], i: number): T {
  return arr[i % arr.length];
}

interface PackSlot {
  rarity: Rarity;
  power?: number;
}

/**
 * 12 packs × 5 cards. Early packs are calm; mid packs introduce Art Rare;
 * the FINAL three packs carry the guaranteed hits and build a climax.
 */
const PACK_TEMPLATES: PackSlot[][] = [
  // 1-3: pure base — quiet pacing
  [{ rarity: "Common" }, { rarity: "Common" }, { rarity: "Common" }, { rarity: "Rare" }, { rarity: "Common" }],
  [{ rarity: "Common" }, { rarity: "Rare" }, { rarity: "Common" }, { rarity: "Common" }, { rarity: "Rare" }],
  [{ rarity: "Rare" }, { rarity: "Common" }, { rarity: "Common" }, { rarity: "Rare" }, { rarity: "Common" }],
  // 4-6: first foils appear
  [{ rarity: "Common" }, { rarity: "Rare" }, { rarity: "Common" }, { rarity: "Art Rare" }, { rarity: "Rare" }],
  [{ rarity: "Common" }, { rarity: "Common" }, { rarity: "Rare" }, { rarity: "Rare" }, { rarity: "Art Rare" }],
  [{ rarity: "Rare" }, { rarity: "Common" }, { rarity: "Art Rare" }, { rarity: "Rare" }, { rarity: "Common" }],
  // 7-9: tension rising — multiple foils, no guaranteed hit yet
  [{ rarity: "Common" }, { rarity: "Art Rare" }, { rarity: "Rare" }, { rarity: "Art Rare" }, { rarity: "Rare" }],
  [{ rarity: "Rare" }, { rarity: "Rare" }, { rarity: "Common" }, { rarity: "Art Rare" }, { rarity: "Rare" }],
  [{ rarity: "Common" }, { rarity: "Rare" }, { rarity: "Art Rare" }, { rarity: "Rare" }, { rarity: "Art Rare" }],
  // 10 — Special Art Rare climax pack #1
  [{ rarity: "Common" }, { rarity: "Rare" }, { rarity: "Art Rare" }, { rarity: "Rare" }, { rarity: "Special Art Rare", power: 8 }],
  // 11 — Super + Ultra Rare climax pack #2
  [{ rarity: "Rare" }, { rarity: "Art Rare" }, { rarity: "Rare" }, { rarity: "Super Rare", power: 8 }, { rarity: "Ultra Rare", power: 9 }],
  // 12 — ACE finale
  [{ rarity: "Art Rare" }, { rarity: "Rare" }, { rarity: "Super Rare", power: 8 }, { rarity: "Ultra Rare", power: 9 }, { rarity: "ACE", power: 10 }],
];

export function buildBox(): CardData[][] {
  let seed = 0;
  return PACK_TEMPLATES.map((slots, packIdx) =>
    slots.map((slot, cardIdx): CardData => {
      seed++;
      const isHit = ["Special Art Rare", "Super Rare", "Ultra Rare", "ACE", "PROMO"].includes(slot.rarity);
      // Hits get the ACE art; foils get cyan/crimson; commons get mint.
      const art = isHit
        ? aceCard
        : slot.rarity === "Art Rare"
          ? pick([cardCyan, cardCrimson], seed)
          : slot.rarity === "Rare"
            ? pick([cardCyan, cardCrimson, cardMint], seed)
            : cardMint;
      return {
        id: `${String(packIdx + 1).padStart(2, "0")}-${cardIdx + 1}`,
        name: pick(NAMES, seed * 3 + packIdx),
        faction: pick(FACTIONS, seed + packIdx),
        rarity: slot.rarity,
        art,
        power: slot.power ?? 3 + (seed % 5),
      };
    }),
  );
}

export const TOTAL_PACKS = PACK_TEMPLATES.length;
