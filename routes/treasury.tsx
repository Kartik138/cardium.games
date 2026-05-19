import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/treasury")({
  head: () => ({
    meta: [
      { title: "Treasury · Protocol Vault — Cardium" },
      {
        name: "description",
        content:
          "The Cardium Treasury — every booster sale is permanently backed by on-chain reserves. Complete a Genesis set, redeem from the vault.",
      },
      { property: "og:title", content: "Treasury — Cardium Protocol Vault" },
      {
        property: "og:description",
        content:
          "On-chain reserves backing every Cardium card. Burn a complete set, redeem proportional vault value on Base.",
      },
    ],
  }),
  component: TreasuryRoute,
});

const reserves = [
  { token: "ETH", amount: "1,284.21", usd: "$4,832,141", pct: 52 },
  { token: "USDC", amount: "2,140,508", usd: "$2,140,508", pct: 23 },
  { token: "cbBTC", amount: "31.40", usd: "$2,094,002", pct: 22 },
  { token: "AERO", amount: "412,802", usd: "$280,705", pct: 3 },
];

const events = [
  { t: "2m", evt: "Pack sale", flow: "+$48.20", dir: "in" },
  { t: "4m", evt: "Genesis redemption · ARC-014", flow: "−$1,420.00", dir: "out" },
  { t: "11m", evt: "Auction settlement fee", flow: "+$92.40", dir: "in" },
  { t: "26m", evt: "Pack sale ×12", flow: "+$578.40", dir: "in" },
  { t: "41m", evt: "Genesis redemption · VOID-007", flow: "−$3,810.00", dir: "out" },
];

function TreasuryRoute() {
  return (
    <div className="relative min-h-screen text-foreground">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pb-32 pt-28">
        {/* Sub-header */}
        <div className="flex items-end justify-between border-b border-white/[0.06] pb-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cyan">
              ● Live · Base mainnet
            </p>
            <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight md:text-6xl">
              Protocol Vault
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Every pack sold deposits reserves on-chain. Burn a complete Genesis set to redeem your
              proportional share — fully transparent, fully verifiable.
            </p>
          </div>
          <Link
            to="/collection"
            className="hidden rounded-sm border border-white/10 bg-surface/40 px-5 py-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:bg-surface hover:text-foreground md:inline-block"
          >
            Track Completion →
          </Link>
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="mt-10 grid gap-4 md:grid-cols-3"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface/40 p-7 ring-glow">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Total Vault Value
            </p>
            <p className="mt-3 font-display text-4xl font-extrabold tracking-tight">
              $9,347,356
            </p>
            <p className="mt-2 font-mono text-[11px] text-cyan">+ $48,210 · 24h</p>
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-violet/30 blur-3xl" />
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-surface/40 p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Backing per Pack
            </p>
            <p className="mt-3 font-display text-4xl font-extrabold tracking-tight">$3.84</p>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">Floor · 96.0%</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-surface/40 p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Sets Redeemed · S01
            </p>
            <p className="mt-3 font-display text-4xl font-extrabold tracking-tight">182</p>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">of 2,400 minted</p>
          </div>
        </motion.div>

        {/* Reserves + flow */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-surface/30 p-7">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold tracking-tight">Reserve composition</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Verified · 12s ago
              </span>
            </div>
            <div className="mt-6 space-y-5">
              {reserves.map((r, i) => (
                <motion.div
                  key={r.token}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                >
                  <div className="flex items-baseline justify-between font-mono text-[11px]">
                    <span className="text-foreground">{r.token}</span>
                    <span className="text-muted-foreground">
                      {r.amount} · <span className="text-foreground">{r.usd}</span>
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${r.pct}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.07, ease: [0.32, 0.72, 0, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-violet to-cyan"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-surface/30 p-7">
            <h2 className="font-display text-lg font-bold tracking-tight">Live ledger</h2>
            <div className="mt-6 divide-y divide-white/[0.04]">
              {events.map((e) => (
                <div key={e.t + e.evt} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {e.t} ago
                    </p>
                    <p className="mt-1 text-sm text-foreground">{e.evt}</p>
                  </div>
                  <span
                    className={`font-mono text-[12px] font-semibold ${
                      e.dir === "in" ? "text-cyan" : "text-destructive"
                    }`}
                  >
                    {e.flow}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
