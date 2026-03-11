import { useState } from "react";
import { XEON_SWAPS } from "../data/market.js";

/* ──────────────────────── Static Data ──────────────────────── */

const SLEEPER_BUILDS = [
  {
    name: "Budget Beast",
    totalCost: 180,
    useCase: "1080p gaming, esports titles, light streaming",
    components: [
      { part: "CPU", value: "Xeon E5-2678 v3 (12C/24T)" },
      { part: "Board", value: "Huananzhi X99-TF" },
      { part: "RAM", value: "32GB DDR4 ECC" },
      { part: "GPU", value: "RX 580 8GB" },
      { part: "Storage", value: "256GB SSD (reuse)" },
    ],
    perfIndicator: 72,
    accent: "neon-green",
  },
  {
    name: "Office Sleeper",
    totalCost: 120,
    useCase: "Light gaming, office work, media center",
    components: [
      { part: "CPU", value: "i5-4590 (4C/4T)" },
      { part: "Board", value: "Any H81/B85 board" },
      { part: "RAM", value: "16GB DDR3" },
      { part: "GPU", value: "GTX 1060 6GB" },
      { part: "Storage", value: "128GB SSD (reuse)" },
    ],
    perfIndicator: 55,
    accent: "neon-yellow",
  },
  {
    name: "Workstation",
    totalCost: 250,
    useCase: "3D rendering, video editing, CAD",
    components: [
      { part: "CPU", value: "Xeon E5-2680 v4 (14C/28T)" },
      { part: "Board", value: "Machinist X99-RS9" },
      { part: "RAM", value: "64GB DDR4 ECC" },
      { part: "GPU", value: "GTX 1070 8GB" },
      { part: "Storage", value: "512GB NVMe" },
    ],
    perfIndicator: 82,
    accent: "neon",
  },
];

const SCENARIOS = [
  {
    title: "Cheap Upgrade",
    tagline: "Get 2 more years out of your rig for under $100",
    accent: "neon-green",
    costEstimate: "$60 - $100",
    profitEstimate: null,
    steps: [
      "Identify your current platform (socket, chipset, RAM type)",
      "Find the best CPU your board supports on AliExpress or eBay",
      "Upgrade RAM to max supported (usually $15-25 for DDR3/DDR4)",
      "Add an SSD if you're still on HDD ($20 for 240GB)",
      "Apply fresh thermal paste and clean dust ($5)",
      "Overclock if your board supports it (free performance)",
    ],
  },
  {
    title: "Flip Mode",
    tagline: "Buy old hardware, clean up, sell for profit",
    accent: "neon-yellow",
    costEstimate: "$80 - $200 investment",
    profitEstimate: "$50 - $150 profit per flip",
    steps: [
      "Source cheap office PCs (Dell OptiPlex, HP EliteDesk) for $50-80",
      "Clean the case thoroughly, replace thermal paste",
      "Add a budget GPU (GTX 1060/RX 580) for $40-60",
      "Install a fresh SSD with Windows ($25)",
      "Benchmark and screenshot results for the listing",
      "List on FB Marketplace/OfferUp as 'Gaming PC Ready' for $250-350",
    ],
  },
  {
    title: "Server to Workstation",
    tagline: "Convert decommissioned servers into powerful workstations",
    accent: "neon",
    costEstimate: "$100 - $300",
    profitEstimate: "Equivalent to $800+ new workstation",
    steps: [
      "Find decommissioned rack servers (Dell R720, HP DL380) for $80-150",
      "Extract CPUs, RAM, and drives — sell the chassis for parts",
      "Buy a Chinese X99/X79 ATX board ($40-60) for the Xeons",
      "Install in a standard ATX case with proper cooling ($30)",
      "Add a workstation GPU (Quadro/GTX) depending on workload",
      "Configure for your use case: rendering, VMs, NAS, or dev server",
    ],
  },
];

const TABS = [
  { key: "xeon", label: "Xeon Swap Guide" },
  { key: "sleeper", label: "Sleeper Builds" },
  { key: "scenarios", label: "Scenarios" },
];

/* ──────────────────────── Helpers ──────────────────────── */

function perfScoreColor(score) {
  if (score > 70) return "text-neon-green";
  if (score >= 40) return "text-neon-yellow";
  return "text-neon-red";
}

function perfScoreBg(score) {
  if (score > 70) return "bg-neon-green/15";
  if (score >= 40) return "bg-neon-yellow/15";
  return "bg-neon-red/15";
}

function PerfBar({ value, max = 100 }) {
  const pct = Math.min((value / max) * 100, 100);
  const color =
    value > 70
      ? "bg-neon-green"
      : value >= 40
        ? "bg-neon-yellow"
        : "bg-neon-red";

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-surface-lighter overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`font-mono text-xs font-bold ${perfScoreColor(value)}`}>
        {value}
      </span>
    </div>
  );
}

const accentBorder = {
  neon: "border-neon/30",
  "neon-green": "border-neon-green/30",
  "neon-yellow": "border-neon-yellow/30",
};

const accentText = {
  neon: "text-neon",
  "neon-green": "text-neon-green",
  "neon-yellow": "text-neon-yellow",
};

const accentBg = {
  neon: "bg-neon/10",
  "neon-green": "bg-neon-green/10",
  "neon-yellow": "bg-neon-yellow/10",
};

const accentGlow = {
  neon: "hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]",
  "neon-green": "hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]",
  "neon-yellow": "hover:shadow-[0_0_20px_rgba(255,230,0,0.15)]",
};

/* ──────────────────────── Tab Panels ──────────────────────── */

function XeonSwapPanel() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 rounded-xl border border-neon/20 bg-neon/5 p-6">
        <h3 className="font-display text-lg font-bold tracking-wide text-neon">
          Server CPUs in consumer boards = insane value
        </h3>
        <p className="mt-2 font-mono text-sm leading-relaxed text-gray-400">
          Xeon processors from decommissioned servers can be paired with cheap
          Chinese motherboards for a fraction of the cost of equivalent consumer
          hardware. These combos deliver multi-core performance that rivals
          modern mid-range CPUs at 10-20% of the price.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-lighter">
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Xeon Model
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Socket
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Compatible Board
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                RAM Type
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Cost
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Perf Score
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {XEON_SWAPS.map((row, i) => (
              <tr
                key={row.xeon}
                className={`border-b border-border transition-colors hover:bg-surface-lighter/50 ${
                  i % 2 === 0 ? "bg-surface" : "bg-surface-light"
                }`}
              >
                <td className="whitespace-nowrap px-4 py-3 font-mono text-sm font-semibold text-gray-200">
                  {row.xeon}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-gray-400">
                  {row.socket}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-gray-400">
                  {row.board}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-sm text-gray-400">
                  {row.ramType}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="rounded-md bg-neon/10 px-2 py-0.5 font-mono text-sm font-bold text-neon">
                    ${row.totalCost}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-sm font-bold ${perfScoreColor(row.perfScore)} ${perfScoreBg(row.perfScore)}`}
                  >
                    {row.perfScore}
                  </span>
                </td>
                <td className="max-w-xs px-4 py-3 text-sm text-gray-500">
                  {row.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SleeperBuildsPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {SLEEPER_BUILDS.map((build) => (
        <div
          key={build.name}
          className={`group flex flex-col rounded-xl border ${accentBorder[build.accent]} bg-surface-light p-6 transition-all duration-300 ${accentGlow[build.accent]} hover:-translate-y-0.5`}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <h3
              className={`font-display text-xl font-bold tracking-wide ${accentText[build.accent]}`}
            >
              {build.name}
            </h3>
            <span
              className={`rounded-md ${accentBg[build.accent]} px-2.5 py-1 font-mono text-sm font-bold ${accentText[build.accent]}`}
            >
              ${build.totalCost}
            </span>
          </div>

          {/* Use case */}
          <p className="mt-2 text-sm text-gray-400">{build.useCase}</p>

          {/* Component list */}
          <ul className="mt-5 space-y-2">
            {build.components.map((c) => (
              <li key={c.part} className="flex items-center gap-2 text-sm">
                <span
                  className={`inline-block size-1.5 rounded-full ${accentBg[build.accent].replace("/10", "")}`}
                />
                <span className="text-gray-500">{c.part}</span>
                <span className="ml-auto font-mono text-gray-300">
                  {c.value}
                </span>
              </li>
            ))}
          </ul>

          {/* Performance indicator */}
          <div className="mt-auto border-t border-border pt-4 mt-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-gray-500">
                Performance
              </span>
              <PerfBar value={build.perfIndicator} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScenariosPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {SCENARIOS.map((scenario) => (
        <div
          key={scenario.title}
          className={`group flex flex-col rounded-xl border ${accentBorder[scenario.accent]} bg-surface-light p-6 transition-all duration-300 ${accentGlow[scenario.accent]} hover:-translate-y-0.5`}
        >
          {/* Header */}
          <h3
            className={`font-display text-xl font-bold tracking-wide ${accentText[scenario.accent]}`}
          >
            {scenario.title}
          </h3>
          <p className="mt-1 text-sm text-gray-400">{scenario.tagline}</p>

          {/* Cost / Profit badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`rounded-md ${accentBg[scenario.accent]} px-2.5 py-1 font-mono text-xs font-semibold ${accentText[scenario.accent]}`}
            >
              Cost: {scenario.costEstimate}
            </span>
            {scenario.profitEstimate && (
              <span className="rounded-md bg-neon-green/10 px-2.5 py-1 font-mono text-xs font-semibold text-neon-green">
                {scenario.profitEstimate}
              </span>
            )}
          </div>

          {/* Steps */}
          <ol className="mt-5 space-y-3">
            {scenario.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full ${accentBg[scenario.accent]} font-mono text-[10px] font-bold ${accentText[scenario.accent]}`}
                >
                  {i + 1}
                </span>
                <span className="text-gray-400">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────── Component ──────────────────────── */

export default function Legacy() {
  const [activeTab, setActiveTab] = useState("xeon");

  return (
    <div className="min-h-screen pb-20">
      {/* ───── Hero ───── */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-24 pb-12 text-center">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[36rem] rounded-full bg-neon/5 blur-3xl" />

        <h1 className="neon-text font-display text-4xl font-bold tracking-widest text-neon sm:text-5xl">
          Legacy Archive
        </h1>
        <p className="mt-4 max-w-2xl font-mono text-lg text-gray-400">
          Xeon swaps, sleeper builds, and strategies for squeezing every last
          frame out of old hardware.
        </p>
      </section>

      {/* ───── Tabs ───── */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-lg px-4 py-2.5 font-display text-sm font-semibold tracking-wide transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-neon/10 text-neon shadow-[0_0_12px_rgba(0,240,255,0.1)]"
                  : "text-gray-500 hover:text-gray-300 hover:bg-surface-light"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ───── Tab Content ───── */}
        <div className="mt-8">
          {activeTab === "xeon" && <XeonSwapPanel />}
          {activeTab === "sleeper" && <SleeperBuildsPanel />}
          {activeTab === "scenarios" && <ScenariosPanel />}
        </div>
      </div>
    </div>
  );
}
