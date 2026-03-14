import { useState } from "react";
import { REGIONS, ANTI_FRAUD_SIGNALS } from "../data/regions";

/* ──────────────────────── Constants ──────────────────────── */

const TABS = ["Регионы", "Сравнение", "Тарифы", "Антифрод"];

const regionKeys = Object.keys(REGIONS);
const priorityKeys = regionKeys.filter((k) => REGIONS[k].priority);
const nonPriorityKeys = regionKeys.filter((k) => !REGIONS[k].priority);

const RADAR_AXES = ["Импорт", "Объём рынка", "Маржа", "Конкуренция", "Объём флипов"];

/** Normalise a region's raw data into 0–100 scores for the 5 radar axes. */
function radarScores(key) {
  const r = REGIONS[key];
  return {
    "Импорт": Math.max(0, 100 - r.importDuty * 2 - r.vat),
    "Объём рынка": r.marketSize,
    "Маржа": r.margin * 3,
    "Конкуренция": 100 - r.marketSize * 0.5,
    "Объём флипов": r.flipVolume,
  };
}

/* ──────────────── Anti-Fraud Scenarios ──────────────── */

const SCENARIOS = [
  {
    id: "honest",
    label: "Честный пользователь",
    verdict: "ДОВЕРЕН",
    trust: 100,
    verdictColor: "text-neon-green",
    badgeBg: "bg-neon-green/20 border-neon-green/40",
    signals: [
      { status: "green" },
      { status: "green" },
      { status: "green" },
      { status: "green" },
      { status: "green" },
      { status: "green" },
    ],
  },
  {
    id: "ru-kz-cheat",
    label: "РФ\u2192КЗ обман",
    verdict: "ЗАБЛОКИРОВАН",
    trust: 18,
    verdictColor: "text-neon-red",
    badgeBg: "bg-neon-red/20 border-neon-red/40",
    signals: [
      { status: "red", note: "Казахстан" },
      { status: "red", note: "IP из РФ" },
      { status: "red", note: "+7 РФ" },
      { status: "yellow", note: "₸" },
      { status: "yellow", note: "ru-RU" },
      { status: "red", note: "Карта РФ" },
    ],
  },
  {
    id: "vpn-fake",
    label: "VPN+подмена",
    verdict: "ЗАБЛОКИРОВАН",
    trust: 12,
    verdictColor: "text-neon-red",
    badgeBg: "bg-neon-red/20 border-neon-red/40",
    signals: [
      { status: "red", note: "Нет объявлений" },
      { status: "red", note: "VPN обнаружен" },
      { status: "red", note: "VoIP номер" },
      { status: "red", note: "Крипто" },
      { status: "yellow", note: "ru-RU" },
      { status: "red", note: "Предоплата" },
    ],
  },
  {
    id: "relocation",
    label: "Переезд (легит)",
    verdict: "НА ПРОВЕРКЕ",
    trust: 62,
    verdictColor: "text-neon-yellow",
    badgeBg: "bg-neon-yellow/20 border-neon-yellow/40",
    signals: [
      { status: "green", note: "Объявл. в КЗ" },
      { status: "yellow", note: "IP из РФ" },
      { status: "green", note: "+7 КЗ" },
      { status: "yellow", note: "₽" },
      { status: "green", note: "ru-RU" },
      { status: "yellow", note: "Карта РФ" },
    ],
  },
];

const statusColor = {
  green: "bg-neon-green",
  yellow: "bg-neon-yellow",
  red: "bg-neon-red",
};

const statusBorder = {
  green: "border-neon-green/40",
  yellow: "border-neon-yellow/40",
  red: "border-neon-red/40",
};

const statusText = {
  green: "text-neon-green",
  yellow: "text-neon-yellow",
  red: "text-neon-red",
};

/* ──────────────────────── Radar Chart (SVG) ──────────────────────── */

function RadarChart({ scoresA, scoresB, labelA, labelB }) {
  const cx = 150,
    cy = 150,
    R = 110;
  const n = RADAR_AXES.length;

  /** Convert axis index + value (0-100) to x,y on the SVG. */
  function point(i, value) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (value / 100) * R;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function polygon(scores, color, fillOpacity) {
    const pts = RADAR_AXES.map((a, i) => point(i, scores[a]).join(",")).join(" ");
    return (
      <polygon
        points={pts}
        fill={color}
        fillOpacity={fillOpacity}
        stroke={color}
        strokeWidth="2"
      />
    );
  }

  // Grid rings
  const rings = [20, 40, 60, 80, 100];

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[340px] mx-auto">
      {/* Grid rings */}
      {rings.map((v) => {
        const pts = Array.from({ length: n }, (_, i) => point(i, v).join(",")).join(" ");
        return (
          <polygon
            key={v}
            points={pts}
            fill="none"
            stroke="#30363d"
            strokeWidth="1"
            opacity="0.5"
          />
        );
      })}

      {/* Axis lines */}
      {RADAR_AXES.map((_, i) => {
        const [ex, ey] = point(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={ex} y2={ey} stroke="#30363d" strokeWidth="1" />;
      })}

      {/* Data polygons */}
      {polygon(scoresA, "#00f0ff", 0.2)}
      {polygon(scoresB, "#bf5af2", 0.2)}

      {/* Axis labels */}
      {RADAR_AXES.map((label, i) => {
        const [lx, ly] = point(i, 120);
        return (
          <text
            key={label}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-gray-400 text-[10px] font-mono"
          >
            {label}
          </text>
        );
      })}

      {/* Legend */}
      <rect x="8" y="272" width="10" height="10" rx="2" fill="#00f0ff" fillOpacity="0.6" />
      <text x="22" y="281" className="fill-neon text-[10px] font-mono">
        {labelA}
      </text>
      <rect x="150" y="272" width="10" height="10" rx="2" fill="#bf5af2" fillOpacity="0.6" />
      <text x="164" y="281" className="fill-neon-purple text-[10px] font-mono">
        {labelB}
      </text>
    </svg>
  );
}

/* ──────────────────────── Tab: Regions ──────────────────────── */

function RegionsTab({ selectedRegion, setSelectedRegion }) {
  return (
    <div className="space-y-8">
      {/* Priority Markets */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-neon/10 text-neon text-xs font-display uppercase tracking-wider border border-neon/30">
            Приоритетные рынки
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {priorityKeys.map((key) => (
            <RegionCard
              key={key}
              rKey={key}
              region={REGIONS[key]}
              selected={selectedRegion === key}
              onSelect={() => setSelectedRegion(selectedRegion === key ? null : key)}
            />
          ))}
        </div>
      </div>

      {/* Other Markets */}
      <div>
        <h3 className="text-sm text-gray-500 font-display uppercase tracking-wider mb-4">
          Остальные рынки
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nonPriorityKeys.map((key) => (
            <RegionCard
              key={key}
              rKey={key}
              region={REGIONS[key]}
              selected={selectedRegion === key}
              onSelect={() => setSelectedRegion(selectedRegion === key ? null : key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function RegionCard({ rKey, region, selected, onSelect }) {
  const r = region;
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
        selected
          ? "border-neon bg-neon/5 shadow-[0_0_24px_rgba(0,240,255,0.12)]"
          : "border-border bg-surface-light hover:border-neon/30 hover:bg-surface-lighter"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{r.flag}</span>
          <span className="font-display text-white text-sm">{r.name}</span>
          <span className="text-xs text-gray-500 font-mono">{r.currency}</span>
        </div>
        {r.priority && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/30">
            Приоритет
          </span>
        )}
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-3">
        <div className="text-gray-500">
          Пошлина <span className="text-white font-mono">{r.importDuty}%</span>
        </div>
        <div className="text-gray-500">
          НДС <span className="text-white font-mono">{r.vat}%</span>
        </div>
        <div className="text-gray-500">
          Ср. чек <span className="text-neon-green font-mono">{r.currency}{r.avgFlipCheck}</span>
        </div>
        <div className="text-gray-500">
          Маржа <span className="text-neon-green font-mono">{r.margin}%</span>
        </div>
        <div className="text-gray-500">
          Флиппер <span className="text-white font-mono">{r.currency}{r.subPrice.flipper}/мес</span>
        </div>
        <div className="text-gray-500">
          Про <span className="text-neon font-mono">{r.currency}{r.subPrice.pro}/мес</span>
        </div>
      </div>

      {/* Platforms */}
      <div className="flex flex-wrap gap-1 mb-2">
        {r.platforms.map((p) => (
          <span
            key={p}
            className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-gray-400 font-mono"
          >
            {p}
          </span>
        ))}
      </div>

      {/* Popular hardware */}
      <div className="text-[10px] text-gray-500 mb-2 space-y-0.5">
        <div>
          <span className="text-neon-purple">GPU:</span>{" "}
          {r.popularGPU.join(", ")}
        </div>
        <div>
          <span className="text-neon-purple">CPU:</span>{" "}
          {r.popularCPU.join(", ")}
        </div>
      </div>

      {/* Notes */}
      <p className="text-[10px] text-gray-600 italic leading-relaxed">{r.notes}</p>
    </button>
  );
}

/* ──────────────────────── Tab: Compare ──────────────────────── */

function CompareTab({ regionA, setRegionA, regionB, setRegionB }) {
  const rA = REGIONS[regionA];
  const rB = REGIONS[regionB];
  const scoresA = radarScores(regionA);
  const scoresB = radarScores(regionB);

  const metrics = [
    { label: "Импортная пошлина", a: `${rA.importDuty}%`, b: `${rB.importDuty}%`, delta: rB.importDuty - rA.importDuty, suffix: "pp", lower: true },
    { label: "НДС", a: `${rA.vat}%`, b: `${rB.vat}%`, delta: rB.vat - rA.vat, suffix: "pp", lower: true },
    { label: "Средний чек флипа", a: `${rA.currency}${rA.avgFlipCheck}`, b: `${rB.currency}${rB.avgFlipCheck}`, delta: rB.avgFlipCheck - rA.avgFlipCheck, suffix: "", lower: false },
    { label: "Маржа", a: `${rA.margin}%`, b: `${rB.margin}%`, delta: rB.margin - rA.margin, suffix: "pp", lower: false },
    { label: "Объём рынка", a: rA.marketSize, b: rB.marketSize, delta: rB.marketSize - rA.marketSize, suffix: "", lower: false },
    { label: "Объём флипов", a: rA.flipVolume, b: rB.flipVolume, delta: rB.flipVolume - rA.flipVolume, suffix: "", lower: false },
    { label: "Подписка Флиппер", a: `${rA.currency}${rA.subPrice.flipper}`, b: `${rB.currency}${rB.subPrice.flipper}`, delta: rB.subPrice.flipper - rA.subPrice.flipper, suffix: "", lower: true },
    { label: "Подписка Про", a: `${rA.currency}${rA.subPrice.pro}`, b: `${rB.currency}${rB.subPrice.pro}`, delta: rB.subPrice.pro - rA.subPrice.pro, suffix: "", lower: true },
  ];

  function RegionSelect({ value, onChange, id }) {
    return (
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-surface-light border border-border rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-neon focus:outline-none"
      >
        {regionKeys.map((k) => (
          <option key={k} value={k}>
            {REGIONS[k].flag} {REGIONS[k].name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dropdowns */}
      <div className="flex flex-wrap items-center gap-4 justify-center">
        <div className="flex items-center gap-2">
          <label htmlFor="regionA" className="text-xs text-neon font-display uppercase">Регион A</label>
          <RegionSelect id="regionA" value={regionA} onChange={setRegionA} />
        </div>
        <span className="text-gray-500 font-display">vs</span>
        <div className="flex items-center gap-2">
          <label htmlFor="regionB" className="text-xs text-neon-purple font-display uppercase">Регион B</label>
          <RegionSelect id="regionB" value={regionB} onChange={setRegionB} />
        </div>
      </div>

      {/* Radar chart */}
      <div className="bg-surface-light border border-border rounded-xl p-6">
        <RadarChart
          scoresA={scoresA}
          scoresB={scoresB}
          labelA={rA.name}
          labelB={rB.name}
        />
      </div>

      {/* Side-by-side table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-gray-500 font-display text-xs uppercase">
              <th className="text-left py-2 pr-4">Метрика</th>
              <th className="text-right py-2 px-4 text-neon">{rA.flag} {rA.name}</th>
              <th className="text-right py-2 px-4 text-neon-purple">{rB.flag} {rB.name}</th>
              <th className="text-right py-2 pl-4">Дельта</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {metrics.map((m) => {
              const d = m.delta;
              const positive = m.lower ? d < 0 : d > 0;
              const negative = m.lower ? d > 0 : d < 0;
              return (
                <tr key={m.label} className="border-b border-border/50 hover:bg-surface-lighter/50">
                  <td className="py-2 pr-4 text-gray-400 font-display text-xs">{m.label}</td>
                  <td className="py-2 px-4 text-right text-white">{m.a}</td>
                  <td className="py-2 px-4 text-right text-white">{m.b}</td>
                  <td
                    className={`py-2 pl-4 text-right ${
                      d === 0
                        ? "text-gray-500"
                        : positive
                          ? "text-neon-green"
                          : negative
                            ? "text-neon-red"
                            : "text-gray-400"
                    }`}
                  >
                    {d === 0 ? "—" : `${d > 0 ? "+" : ""}${d}${m.suffix}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ──────────────────────── Tab: Pricing ──────────────────────── */

function PricingTab() {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-gray-500 font-display text-xs uppercase">
              <th className="text-left py-2">Регион</th>
              <th className="text-center py-2">Флаг</th>
              <th className="text-right py-2">Флиппер</th>
              <th className="text-right py-2">Про</th>
              <th className="text-right py-2">Ср. чек</th>
              <th className="text-right py-2 whitespace-nowrap">Подписка % от чека</th>
              <th className="py-2 pl-6 text-left min-w-[180px]">Доступность</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {regionKeys.map((key) => {
              const r = REGIONS[key];
              const subPct = ((r.subPrice.flipper / r.avgFlipCheck) * 100).toFixed(1);
              const barWidth = Math.min(100, (r.subPrice.flipper / r.avgFlipCheck) * 100 * 5);
              const barColor =
                subPct < 5
                  ? "bg-neon-green"
                  : subPct < 8
                    ? "bg-neon-yellow"
                    : "bg-neon-red";

              return (
                <tr key={key} className="border-b border-border/50 hover:bg-surface-lighter/50">
                  <td className="py-2.5 text-white font-display text-xs">{r.name}</td>
                  <td className="py-2.5 text-center text-lg">{r.flag}</td>
                  <td className="py-2.5 text-right text-neon-green">
                    {r.currency}{r.subPrice.flipper}
                  </td>
                  <td className="py-2.5 text-right text-neon">
                    {r.currency}{r.subPrice.pro}
                  </td>
                  <td className="py-2.5 text-right text-white">
                    {r.currency}{r.avgFlipCheck}
                  </td>
                  <td className="py-2.5 text-right text-gray-300">{subPct}%</td>
                  <td className="py-2.5 pl-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-surface border border-border overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor} transition-all duration-500`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 w-10 text-right">{subPct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-600 text-center italic">
        {"\u00AB"}Подписка в % от чека{"\u00BB"} = стоимость подписки Флиппер / средний чек флипа. Чем ниже, тем лучше — один флип покрывает больше месяцев.
      </p>
    </div>
  );
}

/* ──────────────────────── Tab: Anti-Fraud ──────────────────────── */

function AntiFraudTab({ selectedScenario, setSelectedScenario }) {
  const scenario = SCENARIOS.find((s) => s.id === selectedScenario);

  return (
    <div className="space-y-8">
      {/* Signal weights */}
      <div>
        <h3 className="font-display text-sm uppercase tracking-wider text-gray-400 mb-4">
          Сигналы верификации
        </h3>
        <div className="space-y-3">
          {ANTI_FRAUD_SIGNALS.map((sig) => (
            <div key={sig.name} className="flex items-center gap-4">
              <div className="w-36 text-xs font-display text-white shrink-0">{sig.name}</div>
              <div className="flex-1 h-3 rounded-full bg-surface border border-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-neon transition-all duration-700"
                  style={{ width: `${sig.weight}%` }}
                />
              </div>
              <span className="text-xs font-mono text-neon w-10 text-right">{sig.weight}%</span>
              <span className="text-[10px] text-gray-500 w-48 hidden sm:block">{sig.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Simulator */}
      <div>
        <h3 className="font-display text-sm uppercase tracking-wider text-gray-400 mb-4">
          Симулятор сценариев
        </h3>

        {/* Scenario buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`px-4 py-2 rounded-lg text-xs font-display uppercase tracking-wider border transition-all cursor-pointer ${
                selectedScenario === sc.id
                  ? `${sc.badgeBg} ${sc.verdictColor} border`
                  : "bg-surface-light border-border text-gray-400 hover:border-neon/30 hover:text-white"
              }`}
            >
              {sc.label}
            </button>
          ))}
        </div>

        {/* Scenario result */}
        {scenario && (
          <div className="bg-surface-light border border-border rounded-xl p-5 space-y-4">
            {/* Verdict header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-display text-white text-sm">{scenario.label}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider border ${scenario.badgeBg} ${scenario.verdictColor}`}
                >
                  {scenario.verdict}
                </span>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-500 uppercase font-display">Уровень доверия</div>
                <div className={`text-2xl font-display font-bold ${scenario.verdictColor}`}>
                  {scenario.trust}%
                </div>
              </div>
            </div>

            {/* Per-signal breakdown */}
            <div className="space-y-2">
              {ANTI_FRAUD_SIGNALS.map((sig, i) => {
                const s = scenario.signals[i];
                return (
                  <div
                    key={sig.name}
                    className={`flex items-center gap-3 p-2 rounded-lg border ${statusBorder[s.status]} bg-surface`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full shrink-0 ${statusColor[s.status]}`}
                    />
                    <span className="text-xs font-display text-white w-32 shrink-0">
                      {sig.name}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-surface-lighter overflow-hidden">
                      <div
                        className={`h-full rounded-full ${statusColor[s.status]} transition-all duration-500`}
                        style={{ width: `${sig.weight}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-mono w-8 text-right ${statusText[s.status]}`}>
                      {sig.weight}%
                    </span>
                    {s.note && (
                      <span className={`text-[10px] font-mono ${statusText[s.status]} w-20 text-right`}>
                        {s.note}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────── Main Component ──────────────────────── */

export default function Regions() {
  const [activeTab, setActiveTab] = useState("Регионы");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [compareRegionA, setCompareRegionA] = useState("ru");
  const [compareRegionB, setCompareRegionB] = useState("kz");
  const [selectedScenario, setSelectedScenario] = useState("honest");

  return (
    <div className="min-h-screen bg-surface text-gray-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold neon-text mb-2">
            Регионы и Антифрод
          </h1>
          <p className="text-sm text-gray-500 font-mono">
            Региональные тарифы, аналитика рынков и сигналы предотвращения мошенничества
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-8 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-display uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? "text-neon border-b-2 border-neon bg-neon/5"
                  : "text-gray-500 hover:text-white border-b-2 border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "Регионы" && (
          <RegionsTab selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
        )}
        {activeTab === "Сравнение" && (
          <CompareTab
            regionA={compareRegionA}
            setRegionA={setCompareRegionA}
            regionB={compareRegionB}
            setRegionB={setCompareRegionB}
          />
        )}
        {activeTab === "Тарифы" && <PricingTab />}
        {activeTab === "Антифрод" && (
          <AntiFraudTab
            selectedScenario={selectedScenario}
            setSelectedScenario={setSelectedScenario}
          />
        )}
      </div>
    </div>
  );
}
