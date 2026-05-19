import { motion } from "framer-motion";
import aceCard from "@/assets/ace-card.jpg";

const lots = [
  { id: "#091", name: "Commandant Kael", rarity: "ACE", tone: "text-violet", price: "12.50 ETH", sub: "Ends 04:22:10" },
  { id: "#442", name: "Void Walker Zenith", rarity: "Super Rare", tone: "text-cyan", price: "4.20 ETH", sub: "High bid · 18 bids" },
  { id: "#121", name: "Neo Tokyo Sector 7", rarity: "Art Rare", tone: "text-muted-foreground", price: "1.15 ETH", sub: "Buy now" },
];

export function Auctions() {
  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-violet">
              Auction House
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Elite Lots — Live.
            </h2>
          </div>
          <a href="#" className="hidden font-mono text-[11px] uppercase tracking-widest text-violet hover:underline md:block">
            View all 48 listings →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {lots.map((lot, i) => (
            <motion.div
              key={lot.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="group overflow-hidden rounded-2xl border border-border bg-surface/40 p-4 transition-all duration-500 hover:border-violet/40 hover:bg-surface"
            >
              <div className="relative mb-5 aspect-[5/7] overflow-hidden rounded-xl ring-1 ring-white/5">
                <img
                  src={aceCard}
                  alt={lot.name}
                  loading="lazy"
                  width={500}
                  height={700}
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 holo-foil opacity-40" />
                <div className="absolute right-3 top-3 rounded-sm border border-white/20 bg-background/60 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider backdrop-blur">
                  {lot.id}
                </div>
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold tracking-tight">{lot.name}</h3>
                  <p className={`mt-1 font-mono text-[10px] uppercase tracking-widest ${lot.tone}`}>
                    {lot.rarity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold tabular-nums">{lot.price}</p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    {lot.sub}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
