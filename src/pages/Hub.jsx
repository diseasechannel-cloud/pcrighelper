import { useState } from "react";
import { Link } from "react-router-dom";

/* ──────────────────────── Mock Data ──────────────────────── */

const moduleCards = [
  {
    key: "build",
    title: "Build",
    desc: "Assemble your dream rig part‑by‑part with real‑time compatibility checks.",
    stat: "1,284 builds this week",
    cta: "Start Building",
    to: "/build",
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 6V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
        <line x1="12" y1="10" x2="12" y2="14" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
    accent: "neon",
  },
  {
    key: "benchmark",
    title: "Benchmark",
    desc: "Stress‑test your hardware and get detailed performance scores.",
    stat: "9.4M scores logged",
    cta: "Run Benchmark",
    to: "/benchmark",
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    accent: "neon-green",
  },
  {
    key: "compare",
    title: "Compare",
    desc: "Side‑by‑side specs and benchmarks for any two components.",
    stat: "326 GPUs tracked",
    cta: "Compare Now",
    to: "/compare",
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    accent: "neon-purple",
  },
  {
    key: "market",
    title: "Market",
    desc: "Buy, sell, and flip components at the best prices.",
    stat: "$42K traded today",
    cta: "Browse Market",
    to: "/market",
    icon: (
      <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    accent: "neon-yellow",
  },
];

const topBuilds = [
  {
    id: 1,
    name: "Shadow Vortex",
    user: "xNightRider",
    cpu: "Ryzen 9 9950X",
    gpu: "RTX 5090",
    ram: "64 GB DDR5‑6400",
    price: 4299,
    rating: 4.9,
    votes: 312,
  },
  {
    id: 2,
    name: "Arctic Wolf",
    user: "FrostByte",
    cpu: "i9‑14900K",
    gpu: "RX 9070 XT",
    ram: "32 GB DDR5‑6000",
    price: 2649,
    rating: 4.7,
    votes: 247,
  },
  {
    id: 3,
    name: "Budget Blitz",
    user: "ValueKing99",
    cpu: "Ryzen 7 7800X3D",
    gpu: "RTX 4070 Super",
    ram: "32 GB DDR5‑5600",
    price: 1389,
    rating: 4.8,
    votes: 581,
  },
];

/* ──────────────────────── Helpers ──────────────────────── */

const accentMap = {
  neon: {
    border: "border-neon/30",
    text: "text-neon",
    bg: "bg-neon/10",
    btn: "bg-neon/20 hover:bg-neon/30 text-neon",
    glow: "hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
  },
  "neon-green": {
    border: "border-neon-green/30",
    text: "text-neon-green",
    bg: "bg-neon-green/10",
    btn: "bg-neon-green/20 hover:bg-neon-green/30 text-neon-green",
    glow: "hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]",
  },
  "neon-purple": {
    border: "border-neon-purple/30",
    text: "text-neon-purple",
    bg: "bg-neon-purple/10",
    btn: "bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple",
    glow: "hover:shadow-[0_0_20px_rgba(191,90,242,0.15)]",
  },
  "neon-yellow": {
    border: "border-neon-yellow/30",
    text: "text-neon-yellow",
    bg: "bg-neon-yellow/10",
    btn: "bg-neon-yellow/20 hover:bg-neon-yellow/30 text-neon-yellow",
    glow: "hover:shadow-[0_0_20px_rgba(255,230,0,0.15)]",
  },
};

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5 text-neon-yellow text-sm">
      {Array.from({ length: full }, (_, i) => (
        <svg key={i} className="size-4 fill-neon-yellow" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 0 0-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 0 0-1.176 0l-3.368 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 0 0-.364-1.118L2.063 9.384c-.784-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69l1.286-3.957Z" />
        </svg>
      ))}
      {half && (
        <svg className="size-4" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="#ffe600" />
              <stop offset="50%" stopColor="#30363d" />
            </linearGradient>
          </defs>
          <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 0 0-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 0 0-1.176 0l-3.368 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 0 0-.364-1.118L2.063 9.384c-.784-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69l1.286-3.957Z" />
        </svg>
      )}
      <span className="ml-1 text-gray-400">{rating}</span>
    </span>
  );
}

/* ──────────────────────── Component ──────────────────────── */

export default function Hub() {
  const [query, setQuery] = useState("");

  return (
    <div className="pcb-bg min-h-screen pb-20">
      {/* ───── Hero ───── */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[36rem] rounded-full bg-neon/5 blur-3xl" />

        <h1 className="neon-text font-display text-4xl font-bold tracking-widest text-neon sm:text-5xl lg:text-6xl">
          UpgradeRig
        </h1>
        <p className="mt-4 max-w-xl font-mono text-lg text-gray-400 sm:text-xl">
          Upgrade Your Rig&nbsp;&mdash; Build, Benchmark, Compare, Flip
        </p>

        {/* Search bar */}
        <div className="neon-glow mt-10 flex w-full max-w-2xl items-center gap-3 rounded-xl border border-neon/30 bg-surface-light px-5 py-3">
          <svg className="size-5 shrink-0 text-neon-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components, builds, benchmarks..."
            className="w-full bg-transparent font-mono text-sm text-gray-200 placeholder-gray-500 outline-none sm:text-base"
          />
          <kbd className="hidden shrink-0 rounded-md border border-border bg-surface-lighter px-2 py-0.5 font-mono text-xs text-gray-500 sm:inline-block">
            /
          </kbd>
        </div>
      </section>

      {/* ───── Module Cards Grid ───── */}
      <section className="mx-auto max-w-5xl px-4">
        <h2 className="mb-6 font-display text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
          Modules
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {moduleCards.map((card) => {
            const a = accentMap[card.accent];
            return (
              <Link
                key={card.key}
                to={card.to}
                className={`group relative flex flex-col gap-4 rounded-xl border ${a.border} bg-surface-light p-6 transition-all duration-300 ${a.glow} hover:-translate-y-0.5`}
              >
                {/* Icon */}
                <div className={`flex size-12 items-center justify-center rounded-lg ${a.bg} ${a.text}`}>
                  {card.icon}
                </div>

                {/* Content */}
                <div>
                  <h3 className={`font-display text-xl font-bold tracking-wide ${a.text}`}>
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">
                    {card.desc}
                  </p>
                </div>

                {/* Stat + CTA */}
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-mono text-xs text-gray-500">{card.stat}</span>
                  <span className={`rounded-lg px-4 py-1.5 font-mono text-xs font-semibold transition-colors ${a.btn}`}>
                    {card.cta}
                  </span>
                </div>

                {/* Corner accent line */}
                <span className={`pointer-events-none absolute top-0 right-0 h-px w-16 rounded-tr-xl ${a.bg}`} />
                <span className={`pointer-events-none absolute top-0 right-0 h-16 w-px rounded-tr-xl ${a.bg}`} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ───── Top Builds of the Week ───── */}
      <section className="mx-auto mt-20 max-w-5xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
            Top Builds of the Week
          </h2>
          <Link
            to="/builds"
            className="font-mono text-xs text-neon-dim transition-colors hover:text-neon"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topBuilds.map((build) => (
            <div
              key={build.id}
              className="group flex flex-col rounded-xl border border-border bg-surface-light p-5 transition-all duration-300 hover:border-neon/30 hover:shadow-[0_0_24px_rgba(0,240,255,0.08)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold tracking-wide text-gray-100">
                    {build.name}
                  </h3>
                  <p className="font-mono text-xs text-gray-500">by {build.user}</p>
                </div>
                <span className="rounded-md bg-neon/10 px-2.5 py-1 font-mono text-sm font-bold text-neon">
                  ${build.price.toLocaleString()}
                </span>
              </div>

              {/* Specs */}
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="inline-block size-1.5 rounded-full bg-neon-green" />
                  <span className="text-gray-400">CPU</span>
                  <span className="ml-auto font-mono text-gray-300">{build.cpu}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block size-1.5 rounded-full bg-neon-purple" />
                  <span className="text-gray-400">GPU</span>
                  <span className="ml-auto font-mono text-gray-300">{build.gpu}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block size-1.5 rounded-full bg-neon-yellow" />
                  <span className="text-gray-400">RAM</span>
                  <span className="ml-auto font-mono text-gray-300">{build.ram}</span>
                </li>
              </ul>

              {/* Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div className="flex flex-col gap-1">
                  <Stars rating={build.rating} />
                  <span className="font-mono text-[10px] text-gray-600">{build.votes} votes</span>
                </div>
                <Link
                  to={`/builds/${build.id}`}
                  className="rounded-lg border border-neon/20 bg-neon/5 px-4 py-1.5 font-mono text-xs font-semibold text-neon transition-colors hover:bg-neon/15"
                >
                  View Build
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
