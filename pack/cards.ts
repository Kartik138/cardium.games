import aceCard from "@/assets/ace-card.jpg";
import cardCyan from "@/assets/card-cyan.jpg";
import cardCrimson from "@/assets/card-crimson.jpg";
import cardMint from "@/assets/card-mint.jpg";

export type Rarity = "Common" | "Rare" | "Art Rare" | "Special Art Rare" | "Super Rare" | "Ultra Rare" | "ACE" | "PROMO";

export interface CardData {
  id: string;
  name: string;
  faction: string;
  rarity: Rarity;
  art: string;
  power: number;
}

export interface RarityStyle {
  label: string;
  ringClass: string;
  glowClass: string;
  textClass: string;
  /** Seconds the reveal sits in suspense before the user can dismiss. */
  suspense: number;
  shimmer: boolean;
  cinematic: boolean;
}

export const rarityStyles: Record<Rarity, RarityStyle> = {
  Common: {
    label: "Common",
    ringClass: "ring-white/10",
    glowClass: "shadow-[0_20px_60px_-30px_rgba(255,255,255,0.2)]",
    textClass: "text-muted-foreground",
    suspense: 0.3,
    shimmer: false,
    cinematic: false,
  },
  Rare: {
    label: "Rare",
    ringClass: "ring-white/30",
    glowClass: "shadow-[0_30px_80px_-30px_rgba(255,255,255,0.35)]",
    textClass: "text-foreground",
    suspense: 0.55,
    shimmer: false,
    cinematic: false,
  },
  "Art Rare": {
    label: "Art Rare",
    ringClass: "ring-cyan/40",
    glowClass: "shadow-[0_30px_100px_-30px_oklch(0.78_0.15_220/0.6)]",
    textClass: "text-cyan",
    suspense: 0.7,
    shimmer: true,
    cinematic: false,
  },
  "Special Art Rare": {
    label: "Special Art Rare",
    ringClass: "ring-cyan/60",
    glowClass: "shadow-[0_40px_120px_-30px_oklch(0.78_0.15_220/0.7)]",
    textClass: "text-cyan",
    suspense: 0.9,
    shimmer: true,
    cinematic: true,
  },
  "Super Rare": {
    label: "Super Rare",
    ringClass: "ring-violet/60",
    glowClass: "shadow-[0_40px_120px_-30px_oklch(0.66_0.23_295/0.7)]",
    textClass: "text-violet",
    suspense: 1.0,
    shimmer: true,
    cinematic: true,
  },
  "Ultra Rare": {
    label: "Ultra Rare",
    ringClass: "ring-violet",
    glowClass: "shadow-[0_50px_160px_-30px_oklch(0.66_0.23_295/0.8)]",
    textClass: "text-violet",
    suspense: 1.3,
    shimmer: true,
    cinematic: true,
  },
  ACE: {
    label: "ACE",
    ringClass: "ring-violet",
    glowClass: "shadow-[0_60px_200px_-40px_oklch(0.66_0.23_295/0.95)]",
    textClass: "text-violet",
    suspense: 1.8,
    shimmer: true,
    cinematic: true,
  },
  PROMO: {
    label: "PROMO",
    ringClass: "ring-cyan",
    glowClass: "shadow-[0_60px_200px_-40px_oklch(0.78_0.15_220/0.95)]",
    textClass: "text-cyan",
    suspense: 2.0,
    shimmer: true,
    cinematic: true,
  },
};

export const genesisPack: CardData[] = [
  { id: "001", name: "Recon Vex",         faction: "Iron Wake",  rarity: "Common",            art: cardMint,    power: 3 },
  { id: "044", name: "Pulse Runner",      faction: "Iron Wake",  rarity: "Common",            art: cardMint,    power: 4 },
  { id: "112", name: "Halcyon Drift",     faction: "Tide Choir", rarity: "Rare",              art: cardCyan,    power: 5 },
  { id: "203", name: "Echoed Sentinel",   faction: "Iron Wake",  rarity: "Rare",              art: cardCrimson, power: 5 },
  { id: "318", name: "Neo Tokyo Sector 7",faction: "Tide Choir", rarity: "Art Rare",          art: cardCyan,    power: 6 },
  { id: "421", name: "Commandant Kael",   faction: "Sable Court",rarity: "Special Art Rare",  art: cardCrimson, power: 7 },
  { id: "510", name: "Void Walker Zenith",faction: "Void",       rarity: "Ultra Rare",        art: aceCard,     power: 9 },
  { id: "001A",name: "KAIROS VII",        faction: "Void",       rarity: "ACE",               art: aceCard,     power: 10 },
];
