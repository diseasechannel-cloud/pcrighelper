import { useState } from "react";
import { PRICING_TIERS } from "../data/market.js";

/* ══════════════════════════════════════════════════════════════
   Flip Mode — Pipeline, Pricing, Listing & Context AI
   ══════════════════════════════════════════════════════════════ */

const SUB_TABS = ["Pricing", "Pipeline", "Listing", "Context AI"];

/* ──────────────────────── Pipeline Data ──────────────────────── */

const PIPELINE_STEPS = [
  { key: "survey", label: "Survey" },
  { key: "photos", label: "Photos" },
  { key: "ai-assess", label: "AI Assessment" },
  { key: "variant", label: "Choose Variant" },
  { key: "parts", label: "Find Parts" },
  { key: "agent", label: "AI Agent" },
  { key: "guide", label: "Build Guide" },
];

const EXISTING_COMPONENTS = [
  { id: 1, name: "Intel i5-7500", type: "CPU", condition: "Good", value: 35 },
  { id: 2, name: "8 GB DDR4 2400", type: "RAM", condition: "Good", value: 12 },
  { id: 3, name: "256 GB SATA SSD", type: "Storage", condition: "Fair", value: 15 },
  { id: 4, name: "Intel HD 630", type: "GPU", condition: "Good", value: 0 },
  { id: 5, name: "300W OEM PSU", type: "PSU", condition: "Fair", value: 5 },
];

const PIPELINE_STEP_CONTENT = {
  photos: {
    title: "Photo Capture",
    desc: "Take 6-8 photos of the rig: front, back, internals, ports, labels, and any damage. Our AI will identify components automatically.",
    mock: ["Front panel shot detected: Dell OptiPlex 7050 SFF", "Internal shot: i5-7500 + stock cooler identified", "Rear I/O: 4x USB 3.0, DisplayPort, VGA confirmed", "Label scan: Service Tag matched — specs verified"],
  },
  "ai-assess": {
    title: "AI Assessment",
    desc: "We analyse the rig's upgrade potential, thermal headroom, PSU limits, and market demand for the base config.",
    mock: ["Good Bones Score: 82 / 100", "Thermal headroom: adequate for LP GPU", "PSU limit: 300 W — low-profile cards only", "Market demand: HIGH for budget gaming in this chassis", "Estimated flip profit: $95 - $140"],
  },
  variant: {
    title: "Choose Variant",
    desc: "Pick a build path based on target buyer. Each variant has different part costs and expected sale price.",
    mock: [
      { name: "Budget Gamer", cost: 65, sell: 295, parts: "GTX 1650 LP + 8 GB RAM" },
      { name: "Office Pro", cost: 30, sell: 220, parts: "16 GB RAM + NVMe SSD" },
      { name: "Streaming Starter", cost: 110, sell: 380, parts: "GTX 1660 LP + 16 GB + NVMe" },
    ],
  },
  parts: {
    title: "Find Parts",
    desc: "AI scans marketplaces in your region for the cheapest compatible parts with availability alerts.",
    mock: [
      { part: "MSI GTX 1650 LP", source: "AliExpress", price: 42, eta: "7 days" },
      { part: "8 GB DDR4 2400 stick", source: "eBay", price: 9, eta: "3 days" },
      { part: "256 GB NVMe SSD", source: "Amazon", price: 18, eta: "2 days" },
    ],
  },
  agent: {
    title: "AI Agent",
    desc: "The autonomous agent handles sourcing negotiations, tracks shipments, and alerts you when all parts arrive.",
    mock: ["Agent negotiated GTX 1650 LP from $42 to $38", "Shipment tracking: 2 of 3 parts dispatched", "ETA alignment: all parts arrive by March 18", "Auto-alert set for price drop on NVMe SSD"],
  },
  guide: {
    title: "Build Guide",
    desc: "Step-by-step illustrated build instructions customised to your exact rig and chosen variant.",
    mock: ["Step 1: Remove OEM shroud (2x Phillips screws)", "Step 2: Install additional RAM in slot B2", "Step 3: Mount NVMe SSD in M.2 slot (if available) or use SATA", "Step 4: Insert GTX 1650 LP into PCIe x16, connect aux power if needed", "Step 5: Cable management & close case", "Step 6: Install drivers — run benchmark — photograph for listing"],
  },
};

/* ──────────────────────── Listing Data ──────────────────────── */

const LISTING_STEPS = ["Text Generation", "Photo Enhancement", "Preview", "Publish", "Status"];

const TONE_OPTIONS = ["Natural", "Technical", "Casual", "Premium"];

const TONE_SAMPLES = {
  Natural: "Upgraded Dell OptiPlex 7050 SFF with GTX 1650 LP, 16 GB RAM, and 256 GB SSD. Runs popular games at 1080p medium-high settings. Clean, tested, ready to go.",
  Technical: "Dell OptiPlex 7050 SFF | i5-7500 (4C/4T, 3.4 GHz boost) | 16 GB DDR4-2400 | GTX 1650 LP 4 GB GDDR6 (TDP 75 W) | 256 GB SATA III SSD | Win 11 Pro activated. Benchmarked: 8,240 Time Spy, 62 FPS avg Fortnite 1080p Medium.",
  Casual: "Solid little gaming PC! Plays Fortnite, Valorant, Minecraft no problem. Quiet, small form factor, fits anywhere. Upgraded with a dedicated GPU and extra RAM. Hit me up!",
  Premium: "Professionally refurbished compact gaming workstation. Enterprise-grade Dell chassis with carefully selected upgrades: dedicated NVIDIA graphics, expanded memory, and solid-state storage. Ideal for gaming, content creation, or a capable home office. 30-day warranty included.",
};

const PLATFORMS = [
  { name: "Avito", method: "API" },
  { name: "OLX", method: "Browser" },
  { name: "FB Marketplace", method: "Browser" },
  { name: "eBay", method: "API" },
  { name: "Craigslist", method: "Browser" },
];

/* ──────────────────────── Context AI Data ──────────────────────── */

const QUICK_TEMPLATES = [
  "Gaming build for a client with $400 budget, prefers AMD",
  "Market insight: are Xeon flips still profitable in Q1?",
  "Brand preference: client wants all-Corsair aesthetics",
];

const AI_MEMORY = [
  { id: 1, insight: "Client Alex prefers NVIDIA GPUs — avoids AMD drivers", tag: "preference", impact: "high", applied: 12 },
  { id: 2, insight: "Local market: GTX 1650 LP sells fastest under $260", tag: "market", impact: "high", applied: 34 },
  { id: 3, insight: "Repeat buyer: DmitryPC always wants Xeon workstations", tag: "client", impact: "medium", applied: 8 },
  { id: 4, insight: "AliExpress shipping to RU averages 12 days (not 7)", tag: "market", impact: "medium", applied: 19 },
  { id: 5, insight: "FB Marketplace listings with 'gaming' in title get 3x views", tag: "market", impact: "high", applied: 27 },
  { id: 6, insight: "Client Sergei: budget ceiling is always $300, never upsell", tag: "client", impact: "low", applied: 5 },
];

const AI_MODULES = [
  { module: "Pipeline — Survey", data: "Client preferences, budget ceilings", color: "neon" },
  { module: "Pipeline — Find Parts", data: "Shipping times, brand preferences, regional pricing", color: "neon-green" },
  { module: "Listing — Text Gen", data: "Tone preferences, keyword insights from market data", color: "neon-purple" },
  { module: "Listing — Publish", data: "Platform performance per region, best posting times", color: "neon-yellow" },
];

/* ══════════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════════ */

/* ── Pricing Tab ─────────────────────────────────────────────── */

function PricingTab() {
  return (
    <div className="space-y-12">
      {/* Consumer Plans */}
      <div>
        <h3 className="mb-6 font-display text-lg font-bold tracking-wide text-neon">
          Consumer Plans
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING_TIERS.consumer.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col rounded-xl border border-border bg-surface-light p-5 transition-all duration-300 hover:border-neon/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]"
            >
              <h4 className="font-display text-base font-bold tracking-wide text-gray-100">
                {tier.name}
              </h4>
              <p className="mt-1 font-mono text-2xl font-bold text-neon">
                {tier.price === 0 ? "Free" : `$${tier.price}`}
                {tier.price !== 0 && (
                  <span className="text-xs font-normal text-gray-500">/mo</span>
                )}
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-neon-green" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="mt-5 w-full rounded-lg border border-neon/20 bg-neon/10 py-2 font-mono text-sm font-semibold text-neon transition-colors hover:bg-neon/20">
                {tier.price === 0 ? "Get Started" : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Flipper Plans */}
      <div>
        <h3 className="mb-6 font-display text-lg font-bold tracking-wide text-neon-green">
          Flipper Plans
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRICING_TIERS.flipper.map((tier) => {
            const isEnterprise = tier.commission;
            return (
              <div
                key={tier.name}
                className={`flex flex-col rounded-xl border p-5 transition-all duration-300 ${
                  isEnterprise
                    ? "border-neon-yellow/40 bg-gradient-to-br from-surface-light to-neon-yellow/5 shadow-[0_0_30px_rgba(255,230,0,0.08)]"
                    : "border-border bg-surface-light hover:border-neon-green/30 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)]"
                }`}
              >
                {isEnterprise && (
                  <span className="mb-3 inline-flex self-start rounded-full border border-neon-yellow/30 bg-neon-yellow/10 px-3 py-1 font-mono text-[11px] font-semibold text-neon-yellow">
                    Unlock: {tier.unlockRule}
                  </span>
                )}
                <h4
                  className={`font-display text-base font-bold tracking-wide ${
                    isEnterprise ? "text-neon-yellow" : "text-gray-100"
                  }`}
                >
                  {tier.name}
                </h4>
                <p
                  className={`mt-1 font-mono text-2xl font-bold ${
                    isEnterprise ? "text-neon-yellow" : "text-neon-green"
                  }`}
                >
                  {tier.commission ? tier.price : `$${tier.price}`}
                  <span className="text-xs font-normal text-gray-500">
                    {tier.commission ? " per sale" : "/mo"}
                  </span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                      <span
                        className={`mt-1 inline-block size-1.5 shrink-0 rounded-full ${
                          isEnterprise ? "bg-neon-yellow" : "bg-neon-green"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-5 w-full rounded-lg border py-2 font-mono text-sm font-semibold transition-colors ${
                    isEnterprise
                      ? "border-neon-yellow/30 bg-neon-yellow/10 text-neon-yellow hover:bg-neon-yellow/20"
                      : "border-neon-green/20 bg-neon-green/10 text-neon-green hover:bg-neon-green/20"
                  }`}
                >
                  {isEnterprise ? "Apply for Enterprise" : "Subscribe"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Pipeline Tab ────────────────────────────────────────────── */

function PipelineTab({ pipelineStep, setPipelineStep, budget, setBudget, conditionFilter, setConditionFilter, componentActions, setComponentActions }) {
  return (
    <div className="space-y-8">
      {/* Stepper */}
      <div className="flex flex-wrap items-center gap-2">
        {PIPELINE_STEPS.map((step, i) => (
          <button
            key={step.key}
            onClick={() => setPipelineStep(i)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs font-semibold transition-all ${
              pipelineStep === i
                ? "border-neon/40 bg-neon/15 text-neon shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                : pipelineStep > i
                ? "border-neon-green/30 bg-neon-green/10 text-neon-green"
                : "border-border bg-surface-lighter text-gray-500 hover:border-gray-500 hover:text-gray-300"
            }`}
          >
            <span
              className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                pipelineStep === i
                  ? "bg-neon text-surface"
                  : pipelineStep > i
                  ? "bg-neon-green text-surface"
                  : "bg-surface-lighter text-gray-500"
              }`}
            >
              {pipelineStep > i ? "\u2713" : i + 1}
            </span>
            {step.label}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-border bg-surface-light p-6">
        {pipelineStep === 0 ? (
          <SurveyStep
            budget={budget}
            setBudget={setBudget}
            conditionFilter={conditionFilter}
            setConditionFilter={setConditionFilter}
            componentActions={componentActions}
            setComponentActions={setComponentActions}
          />
        ) : (
          <GenericPipelineStep stepKey={PIPELINE_STEPS[pipelineStep].key} />
        )}
      </div>
    </div>
  );
}

function SurveyStep({ budget, setBudget, conditionFilter, setConditionFilter, componentActions, setComponentActions }) {
  const CONDITIONS = ["New Only", "Used Only", "Mix"];

  return (
    <div className="space-y-8">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon">
        Survey
      </h3>
      <p className="text-sm text-gray-400">
        Set your flip parameters: budget, condition preference, and decide what to do with existing components.
      </p>

      {/* Budget Slider */}
      <div>
        <label className="mb-2 block font-mono text-sm text-gray-300">
          Upgrade Budget:&nbsp;
          <span className="text-neon font-bold">${budget}</span>
        </label>
        <input
          type="range"
          min={50}
          max={2000}
          step={10}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full max-w-md accent-[#00f0ff]"
        />
        <div className="mt-1 flex max-w-md justify-between font-mono text-[10px] text-gray-600">
          <span>$50</span>
          <span>$500</span>
          <span>$1,000</span>
          <span>$2,000</span>
        </div>
      </div>

      {/* Condition Filter */}
      <div>
        <label className="mb-2 block font-mono text-sm text-gray-300">
          Condition Filter
        </label>
        <div className="flex gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => setConditionFilter(c)}
              className={`rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition-all ${
                conditionFilter === c
                  ? "border-neon/40 bg-neon/15 text-neon"
                  : "border-border bg-surface-lighter text-gray-500 hover:text-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Existing Components Table */}
      <div>
        <h4 className="mb-3 font-mono text-sm font-semibold text-gray-300">
          Existing Components Inventory
        </h4>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-lighter">
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Component</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Type</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Condition</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Value</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {EXISTING_COMPONENTS.map((comp) => (
                <tr key={comp.id} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3 font-mono text-gray-200">{comp.name}</td>
                  <td className="px-4 py-3 text-gray-400">{comp.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        comp.condition === "Good"
                          ? "bg-neon-green/10 text-neon-green"
                          : "bg-neon-yellow/10 text-neon-yellow"
                      }`}
                    >
                      {comp.condition}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-300">${comp.value}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {["Apply", "Keep", "Sell"].map((action) => (
                        <button
                          key={action}
                          onClick={() =>
                            setComponentActions((prev) => ({
                              ...prev,
                              [comp.id]: action,
                            }))
                          }
                          className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                            componentActions[comp.id] === action
                              ? action === "Apply"
                                ? "border border-neon/40 bg-neon/15 text-neon"
                                : action === "Keep"
                                ? "border border-neon-purple/40 bg-neon-purple/15 text-neon-purple"
                                : "border border-neon-yellow/40 bg-neon-yellow/15 text-neon-yellow"
                              : "border border-border bg-surface-lighter text-gray-500 hover:text-gray-300"
                          }`}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GenericPipelineStep({ stepKey }) {
  const data = PIPELINE_STEP_CONTENT[stepKey];
  if (!data) return null;

  return (
    <div className="space-y-5">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon">
        {data.title}
      </h3>
      <p className="text-sm text-gray-400">{data.desc}</p>

      {/* Variant cards */}
      {stepKey === "variant" && Array.isArray(data.mock) && typeof data.mock[0] === "object" && "cost" in data.mock[0] && (
        <div className="grid gap-4 sm:grid-cols-3">
          {data.mock.map((v) => (
            <div
              key={v.name}
              className="rounded-lg border border-border bg-surface-lighter p-4 transition-all hover:border-neon-green/30"
            >
              <h4 className="font-display text-sm font-bold text-gray-100">{v.name}</h4>
              <p className="mt-1 font-mono text-xs text-gray-500">{v.parts}</p>
              <div className="mt-3 flex items-center justify-between font-mono text-xs">
                <span className="text-neon-red">-${v.cost}</span>
                <span className="text-neon-green">+${v.sell}</span>
              </div>
              <p className="mt-1 text-right font-mono text-xs font-bold text-neon">
                ROI {Math.round(((v.sell - v.cost) / v.cost) * 100)}%
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Parts table */}
      {stepKey === "parts" && Array.isArray(data.mock) && typeof data.mock[0] === "object" && "source" in data.mock[0] && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-lighter">
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Part</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Source</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Price</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">ETA</th>
              </tr>
            </thead>
            <tbody>
              {data.mock.map((p) => (
                <tr key={p.part} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3 font-mono text-gray-200">{p.part}</td>
                  <td className="px-4 py-3 text-gray-400">{p.source}</td>
                  <td className="px-4 py-3 font-mono text-neon-green">${p.price}</td>
                  <td className="px-4 py-3 font-mono text-gray-500">{p.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generic list output for other steps */}
      {Array.isArray(data.mock) && typeof data.mock[0] === "string" && (
        <div className="space-y-2">
          {data.mock.map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-surface-lighter px-4 py-3"
            >
              <span className="mt-0.5 font-mono text-xs text-neon-green">{">"}</span>
              <span className="font-mono text-sm text-gray-300">{line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Listing Tab ─────────────────────────────────────────────── */

function ListingTab({ listingStep, setListingStep, selectedTone, setSelectedTone, selectedPlatforms, setSelectedPlatforms }) {
  return (
    <div className="space-y-8">
      {/* Listing Steps */}
      <div className="flex flex-wrap gap-2">
        {LISTING_STEPS.map((step, i) => (
          <button
            key={step}
            onClick={() => setListingStep(i)}
            className={`rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition-all ${
              listingStep === i
                ? "border-neon-purple/40 bg-neon-purple/15 text-neon-purple shadow-[0_0_12px_rgba(191,90,242,0.15)]"
                : listingStep > i
                ? "border-neon-green/30 bg-neon-green/10 text-neon-green"
                : "border-border bg-surface-lighter text-gray-500 hover:text-gray-300"
            }`}
          >
            {listingStep > i ? "\u2713 " : `${i + 1}. `}
            {step}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface-light p-6">
        {listingStep === 0 && (
          <TextGenerationStep selectedTone={selectedTone} setSelectedTone={setSelectedTone} />
        )}
        {listingStep === 1 && <PhotoEnhancementStep />}
        {listingStep === 2 && <PreviewStep selectedTone={selectedTone} />}
        {listingStep === 3 && (
          <PublishStep
            selectedPlatforms={selectedPlatforms}
            setSelectedPlatforms={setSelectedPlatforms}
          />
        )}
        {listingStep === 4 && <StatusStep />}
      </div>
    </div>
  );
}

function TextGenerationStep({ selectedTone, setSelectedTone }) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon-purple">
        Text Generation
      </h3>
      <p className="text-sm text-gray-400">
        Choose a tone for your listing description. AI generates platform-optimised copy.
      </p>

      {/* Tone Selector */}
      <div className="flex flex-wrap gap-2">
        {TONE_OPTIONS.map((tone) => (
          <button
            key={tone}
            onClick={() => setSelectedTone(tone)}
            className={`rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition-all ${
              selectedTone === tone
                ? "border-neon-purple/40 bg-neon-purple/15 text-neon-purple"
                : "border-border bg-surface-lighter text-gray-500 hover:text-gray-300"
            }`}
          >
            {tone}
          </button>
        ))}
      </div>

      {/* Sample Output */}
      <div className="rounded-lg border border-neon-purple/20 bg-neon-purple/5 p-4">
        <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-neon-purple/70">
          Generated — {selectedTone}
        </p>
        <p className="font-mono text-sm leading-relaxed text-gray-300">
          {TONE_SAMPLES[selectedTone]}
        </p>
      </div>
    </div>
  );
}

function PhotoEnhancementStep() {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon-purple">
        Photo Enhancement
      </h3>
      <p className="text-sm text-gray-400">
        AI cleans up photos: white balance, background removal, sharpening, and watermark overlay.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Before */}
        <div className="rounded-lg border border-border bg-surface-lighter p-4">
          <p className="mb-3 font-mono text-xs font-semibold text-gray-500">BEFORE</p>
          <div className="flex aspect-video items-center justify-center rounded-md bg-surface text-gray-600">
            <div className="text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-surface-lighter text-2xl">
                &#128247;
              </div>
              <p className="font-mono text-xs">Original photo</p>
              <p className="font-mono text-[10px] text-gray-700">Low light, cluttered bg</p>
            </div>
          </div>
        </div>

        {/* After */}
        <div className="rounded-lg border border-neon-green/30 bg-neon-green/5 p-4">
          <p className="mb-3 font-mono text-xs font-semibold text-neon-green">AFTER</p>
          <div className="flex aspect-video items-center justify-center rounded-md bg-surface text-gray-300">
            <div className="text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-neon-green/10 text-2xl">
                &#10024;
              </div>
              <p className="font-mono text-xs">Enhanced photo</p>
              <p className="font-mono text-[10px] text-neon-green/70">Clean bg, corrected WB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhancement Score */}
      <div className="flex items-center gap-4 rounded-lg border border-border bg-surface-lighter px-4 py-3">
        <span className="font-mono text-sm text-gray-400">Enhancement Score:</span>
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon"
              style={{ width: "87%" }}
            />
          </div>
        </div>
        <span className="font-mono text-sm font-bold text-neon-green">87%</span>
      </div>
    </div>
  );
}

function PreviewStep({ selectedTone }) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon-purple">
        Preview
      </h3>
      <p className="text-sm text-gray-400">
        Review your listing before publishing across platforms.
      </p>

      <div className="rounded-lg border border-border bg-surface-lighter p-5 space-y-4">
        <h4 className="font-display text-base font-bold text-gray-100">
          Dell OptiPlex 7050 SFF — Upgraded Budget Gaming PC
        </h4>
        <div className="flex gap-2">
          <span className="rounded-full bg-neon-green/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon-green">
            GTX 1650 LP
          </span>
          <span className="rounded-full bg-neon/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon">
            16 GB RAM
          </span>
          <span className="rounded-full bg-neon-purple/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon-purple">
            256 GB SSD
          </span>
        </div>
        <p className="font-mono text-sm leading-relaxed text-gray-400">
          {TONE_SAMPLES[selectedTone]}
        </p>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="font-mono text-lg font-bold text-neon-green">$295</span>
          <span className="font-mono text-xs text-gray-500">5 photos attached</span>
        </div>
      </div>
    </div>
  );
}

function PublishStep({ selectedPlatforms, setSelectedPlatforms }) {
  const togglePlatform = (name) => {
    setSelectedPlatforms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon-purple">
        Publish
      </h3>
      <p className="text-sm text-gray-400">
        Select platforms to publish your listing. API integrations auto-post; browser mode opens a prefilled form.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((platform) => {
          const selected = selectedPlatforms.includes(platform.name);
          return (
            <button
              key={platform.name}
              onClick={() => togglePlatform(platform.name)}
              className={`flex items-center justify-between rounded-lg border p-4 text-left transition-all ${
                selected
                  ? "border-neon-purple/40 bg-neon-purple/10"
                  : "border-border bg-surface-lighter hover:border-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-5 items-center justify-center rounded border text-xs transition-all ${
                    selected
                      ? "border-neon-purple bg-neon-purple text-surface font-bold"
                      : "border-gray-600 text-transparent"
                  }`}
                >
                  {selected ? "\u2713" : ""}
                </span>
                <span
                  className={`font-mono text-sm font-semibold ${
                    selected ? "text-neon-purple" : "text-gray-400"
                  }`}
                >
                  {platform.name}
                </span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                  platform.method === "API"
                    ? "bg-neon-green/10 text-neon-green"
                    : "bg-neon-yellow/10 text-neon-yellow"
                }`}
              >
                {platform.method}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatusStep() {
  const invested = 347;
  const sell = 420;
  const profit = sell - invested;
  const roi = Math.round((profit / invested) * 100);

  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon-purple">
        Status — P&L Summary
      </h3>
      <p className="text-sm text-gray-400">
        Track your flip from investment to profit realisation.
      </p>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface-lighter p-4 text-center">
          <p className="font-mono text-[11px] text-gray-500">Invested</p>
          <p className="mt-1 font-mono text-xl font-bold text-neon-red">${invested}</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-lighter p-4 text-center">
          <p className="font-mono text-[11px] text-gray-500">Sell Price</p>
          <p className="mt-1 font-mono text-xl font-bold text-neon">${sell}</p>
        </div>
        <div className="rounded-lg border border-neon-green/30 bg-neon-green/5 p-4 text-center">
          <p className="font-mono text-[11px] text-gray-500">Profit</p>
          <p className="mt-1 font-mono text-xl font-bold text-neon-green">${profit}</p>
        </div>
        <div className="rounded-lg border border-neon-yellow/30 bg-neon-yellow/5 p-4 text-center">
          <p className="font-mono text-[11px] text-gray-500">ROI</p>
          <p className="mt-1 font-mono text-xl font-bold text-neon-yellow">{roi}%</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <h4 className="font-mono text-sm font-semibold text-gray-300">Timeline</h4>
        {[
          { date: "Mar 3", event: "Purchased base unit", amount: "-$120", color: "neon-red" },
          { date: "Mar 5", event: "Parts ordered (GPU, RAM, SSD)", amount: "-$69", color: "neon-red" },
          { date: "Mar 8", event: "All parts arrived", amount: "", color: "neon" },
          { date: "Mar 9", event: "Build completed + benchmarked", amount: "-$0", color: "neon-green" },
          { date: "Mar 10", event: "Listed on 3 platforms", amount: "", color: "neon-purple" },
          { date: "Mar 12", event: "Sold on FB Marketplace", amount: "+$420", color: "neon-green" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-border/50 bg-surface-lighter px-4 py-2.5">
            <span className="w-14 shrink-0 font-mono text-[11px] text-gray-500">{item.date}</span>
            <span className={`size-2 shrink-0 rounded-full bg-${item.color}`} />
            <span className="flex-1 font-mono text-sm text-gray-300">{item.event}</span>
            {item.amount && (
              <span
                className={`font-mono text-sm font-bold ${
                  item.amount.startsWith("+") ? "text-neon-green" : "text-neon-red"
                }`}
              >
                {item.amount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Context AI Tab ──────────────────────────────────────────── */

function ContextAITab({ contextInput, setContextInput }) {
  const [isRecording, setIsRecording] = useState(false);

  const TAG_COLORS = {
    market: "bg-neon-green/10 text-neon-green",
    preference: "bg-neon-purple/10 text-neon-purple",
    client: "bg-neon/10 text-neon",
  };

  const IMPACT_COLORS = {
    high: "text-neon-red",
    medium: "text-neon-yellow",
    low: "text-gray-500",
  };

  return (
    <div className="space-y-10">
      {/* Voice + Text Input */}
      <div className="space-y-5">
        <h3 className="font-display text-lg font-bold tracking-wide text-neon">
          Context AI Input
        </h3>
        <p className="text-sm text-gray-400">
          Feed the AI context about your clients, market observations, and preferences. It learns and applies this across all modules.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Voice Button */}
          <button
            onClick={() => setIsRecording((prev) => !prev)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-6 py-4 font-mono text-sm font-semibold transition-all sm:w-48 ${
              isRecording
                ? "border-neon-red/40 bg-neon-red/10 text-neon-red animate-pulse"
                : "border-neon/30 bg-neon/10 text-neon hover:bg-neon/20"
            }`}
          >
            <span className="text-xl">{isRecording ? "\u23F9" : "\u{1F3A4}"}</span>
            {isRecording ? "Stop Recording" : "Record Voice"}
          </button>

          {/* Text Area */}
          <textarea
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            placeholder="Type context here... e.g. 'Client prefers Corsair RAM, budget under $400, needs it by Friday'"
            rows={3}
            className="flex-1 resize-none rounded-xl border border-border bg-surface-lighter px-4 py-3 font-mono text-sm text-gray-300 placeholder-gray-600 outline-none transition-all focus:border-neon/30"
          />
        </div>
      </div>

      {/* Quick Templates */}
      <div className="space-y-3">
        <h4 className="font-mono text-sm font-semibold text-gray-300">Quick Templates</h4>
        <div className="flex flex-wrap gap-2">
          {QUICK_TEMPLATES.map((tpl) => (
            <button
              key={tpl}
              onClick={() => setContextInput(tpl)}
              className="rounded-lg border border-border bg-surface-lighter px-3 py-2 font-mono text-xs text-gray-400 transition-all hover:border-neon/30 hover:text-gray-200"
            >
              {tpl}
            </button>
          ))}
        </div>
      </div>

      {/* AI Memory Bank */}
      <div className="space-y-4">
        <h4 className="font-display text-base font-bold tracking-wide text-neon">
          AI Memory Bank
        </h4>
        <div className="space-y-2">
          {AI_MEMORY.map((mem) => (
            <div
              key={mem.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-lighter px-4 py-3"
            >
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${TAG_COLORS[mem.tag]}`}
              >
                {mem.tag}
              </span>
              <span className="flex-1 font-mono text-sm text-gray-300">{mem.insight}</span>
              <span
                className={`font-mono text-[11px] font-semibold ${IMPACT_COLORS[mem.impact]}`}
              >
                {mem.impact.toUpperCase()}
              </span>
              <span className="rounded-md bg-surface px-2 py-0.5 font-mono text-[10px] text-gray-500">
                {mem.applied}x applied
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* How It's Applied */}
      <div className="space-y-4">
        <h4 className="font-display text-base font-bold tracking-wide text-neon">
          How Context Is Applied
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {AI_MODULES.map((mod) => (
            <div
              key={mod.module}
              className={`rounded-lg border p-4 transition-all border-${mod.color}/20 bg-${mod.color}/5`}
            >
              <h5 className={`font-display text-sm font-bold tracking-wide text-${mod.color}`}>
                {mod.module}
              </h5>
              <p className="mt-2 font-mono text-xs leading-relaxed text-gray-400">
                Uses: {mod.data}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════ */

export default function FlipMode() {
  /* Sub-tab state */
  const [activeSubTab, setActiveSubTab] = useState("Pricing");

  /* Pipeline state */
  const [pipelineStep, setPipelineStep] = useState(0);
  const [budget, setBudget] = useState(300);
  const [conditionFilter, setConditionFilter] = useState("Mix");
  const [componentActions, setComponentActions] = useState({});

  /* Listing state */
  const [listingStep, setListingStep] = useState(0);
  const [selectedTone, setSelectedTone] = useState("Natural");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["eBay"]);

  /* Context AI state */
  const [contextInput, setContextInput] = useState("");

  return (
    <div className="min-h-screen pb-20">
      {/* ───── Header ───── */}
      <section className="mb-8">
        <h1 className="neon-text font-display text-3xl font-bold tracking-widest text-neon sm:text-4xl">
          Flip Mode
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-sm text-gray-400">
          End-to-end flip pipeline: source, build, list, sell. Powered by Context AI that learns your market.
        </p>
      </section>

      {/* ───── Sub-Tab Navigation ───── */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {SUB_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`rounded-lg border px-5 py-2.5 font-mono text-sm font-semibold transition-all ${
              activeSubTab === tab
                ? "border-neon/40 bg-neon/15 text-neon shadow-[0_0_16px_rgba(0,240,255,0.12)]"
                : "border-border bg-surface-light text-gray-500 hover:border-gray-500 hover:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ───── Tab Content ───── */}
      {activeSubTab === "Pricing" && <PricingTab />}

      {activeSubTab === "Pipeline" && (
        <PipelineTab
          pipelineStep={pipelineStep}
          setPipelineStep={setPipelineStep}
          budget={budget}
          setBudget={setBudget}
          conditionFilter={conditionFilter}
          setConditionFilter={setConditionFilter}
          componentActions={componentActions}
          setComponentActions={setComponentActions}
        />
      )}

      {activeSubTab === "Listing" && (
        <ListingTab
          listingStep={listingStep}
          setListingStep={setListingStep}
          selectedTone={selectedTone}
          setSelectedTone={setSelectedTone}
          selectedPlatforms={selectedPlatforms}
          setSelectedPlatforms={setSelectedPlatforms}
        />
      )}

      {activeSubTab === "Context AI" && (
        <ContextAITab contextInput={contextInput} setContextInput={setContextInput} />
      )}
    </div>
  );
}
