import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const links = [
  { to: "/open-box", label: "Collect" },
  { to: "/arena", label: "Battle" },
  { to: "/tournaments", label: "Tournament" },
  { to: "/treasury", label: "Treasury" },
  { to: "/market", label: "Market" },
  { to: "/profile", label: "Profile" },
] as const;

export function Nav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-background/40 backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative flex size-7 items-center justify-center rounded-[7px] border border-violet/40 bg-violet/10 shadow-glow-violet">
              <span className="font-display text-[13px] font-black leading-none text-violet">C</span>
            </span>
            <span className="font-display text-[15px] font-extrabold uppercase tracking-tighter">
              <span className="text-foreground">Card</span>
              <span className="text-violet">ium</span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.to || pathname.startsWith(`${l.to}/`);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className="relative px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors"
                >
                  <span className={active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>
                    {l.label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent via-violet to-transparent"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-surface/50 py-1.5 pl-3 pr-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur lg:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-cyan shadow-glow-cyan" />
            0x4F…81C
          </span>
          <button className="hidden rounded-sm bg-foreground px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-background transition-all hover:bg-violet hover:text-foreground hover:shadow-glow-violet md:inline-block">
            Connect
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="relative flex size-9 items-center justify-center rounded-sm border border-white/10 bg-surface/50 md:hidden"
          >
            <span className="relative flex size-4 flex-col items-center justify-center gap-1">
              <motion.span
                animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
                className="block h-px w-4 bg-foreground"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
                className="block h-px w-4 bg-foreground"
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden border-t border-white/[0.06] md:hidden"
          >
            <div className="mx-auto flex max-w-[1400px] flex-col px-6 py-4">
              {links.map((l) => {
                const active = pathname === l.to || pathname.startsWith(`${l.to}/`);
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`flex items-center justify-between border-b border-white/[0.04] py-3.5 font-mono text-[11px] uppercase tracking-[0.25em] ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className={active ? "text-violet" : "text-muted-foreground/40"}>→</span>
                  </Link>
                );
              })}
              <button className="mt-5 rounded-sm bg-foreground px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-background">
                Connect Wallet
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
