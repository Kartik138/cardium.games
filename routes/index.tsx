import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { RarityLadder } from "@/components/RarityLadder";
import { PackOpening } from "@/components/PackOpening";
import { Arena } from "@/components/Arena";
import { Treasury } from "@/components/Treasury";
import { Auctions } from "@/components/Auctions";
import { Season } from "@/components/Season";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cardium — Collect. Battle. Redeem." },
      {
        name: "description",
        content:
          "A production-grade collectible card ecosystem on Base. Cinematic pack openings, esports PvP, and treasury-backed redemption.",
      },
      { property: "og:title", content: "Cardium — Collect. Battle. Redeem." },
      {
        property: "og:description",
        content:
          "Cinematic collectible card ecosystem. Open packs, stake cards in tactical PvP, redeem complete sets from the protocol vault.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen text-foreground">
      <main>
        <Hero />
        <HowItWorks />
        <RarityLadder />
        <PackOpening />
        <Arena />
        <Treasury />
        <Auctions />
        <Season />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
