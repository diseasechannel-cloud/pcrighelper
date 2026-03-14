import { useState } from "react";
import { XEON_SWAPS } from "../data/market.js";

/* ──────────────────────── Static Data ──────────────────────── */

const SLEEPER_BUILDS = [
  {
    name: "Бюджетный зверь",
    totalCost: 14400,
    useCase: "1080p гейминг, киберспорт, лёгкий стриминг",
    components: [
      { part: "Процессор", value: "Xeon E5-2678 v3 (12C/24T)" },
      { part: "Плата", value: "Huananzhi X99-TF" },
      { part: "ОЗУ", value: "32GB DDR4 ECC" },
      { part: "Видеокарта", value: "RX 580 8GB" },
      { part: "Накопитель", value: "256GB SSD (повторное использование)" },
    ],
    perfIndicator: 72,
    accent: "neon-green",
  },
  {
    name: "Офисный слипер",
    totalCost: 9600,
    useCase: "Лёгкий гейминг, офисная работа, медиацентр",
    components: [
      { part: "Процессор", value: "i5-4590 (4C/4T)" },
      { part: "Плата", value: "Любая H81/B85 плата" },
      { part: "ОЗУ", value: "16GB DDR3" },
      { part: "Видеокарта", value: "GTX 1060 6GB" },
      { part: "Накопитель", value: "128GB SSD (повторное использование)" },
    ],
    perfIndicator: 55,
    accent: "neon-yellow",
  },
  {
    name: "Рабочая станция",
    totalCost: 20000,
    useCase: "3D рендер, видеомонтаж, CAD",
    components: [
      { part: "Процессор", value: "Xeon E5-2680 v4 (14C/28T)" },
      { part: "Плата", value: "Machinist X99-RS9" },
      { part: "ОЗУ", value: "64GB DDR4 ECC" },
      { part: "Видеокарта", value: "GTX 1070 8GB" },
      { part: "Накопитель", value: "512GB NVMe" },
    ],
    perfIndicator: 82,
    accent: "neon",
  },
];

const SCENARIOS = [
  {
    title: "Дешёвый апгрейд",
    tagline: "Продлите жизнь ПК на 2 года за менее чем 8 000₽",
    accent: "neon-green",
    costEstimate: "4 800–8 000₽",
    profitEstimate: null,
    steps: [
      "Определите текущую платформу (сокет, чипсет, тип ОЗУ)",
      "Найдите лучший CPU для вашей платы на AliExpress",
      "Увеличьте ОЗУ до максимума (обычно 1 200–2 000₽ за DDR3/DDR4)",
      "Добавьте SSD, если всё ещё на HDD (1 600₽ за 240GB)",
      "Нанесите свежую термопасту и очистите от пыли (400₽)",
      "Разгоните, если плата поддерживает (бесплатная производительность)",
    ],
  },
  {
    title: "Флип-режим",
    tagline: "Купить старое железо, почистить, продать с прибылью",
    accent: "neon-yellow",
    costEstimate: "6 400–16 000₽ вложение",
    profitEstimate: "4 000–12 000₽ прибыль с флипа",
    steps: [
      "Найдите дешёвые офисные ПК (Dell OptiPlex, HP EliteDesk) за 4 000–6 400₽",
      "Тщательно очистите корпус, замените термопасту",
      "Добавьте бюджетную GPU (GTX 1060/RX 580) за 3 200–4 800₽",
      "Установите свежий SSD с Windows (2 000₽)",
      "Прогоните бенчмарки и сделайте скриншоты для объявления",
      "Разместите на Avito/OLX как «Игровой ПК» за 20 000–28 000₽",
    ],
  },
  {
    title: "Сервер → Рабочая станция",
    tagline: "Превращаем списанные серверы в мощные рабочие станции",
    accent: "neon",
    costEstimate: "8 000–24 000₽",
    profitEstimate: "Эквивалент новой станции за 64 000₽+",
    steps: [
      "Найдите списанные стоечные серверы (Dell R720, HP DL380) за 6 400–12 000₽",
      "Извлеките CPU, ОЗУ и накопители — продайте шасси на запчасти",
      "Купите китайскую X99/X79 ATX-плату (3 200–4 800₽) для Xeon-ов",
      "Установите в стандартный ATX-корпус с нормальным охлаждением (2 400₽)",
      "Добавьте подходящую GPU (Quadro/GTX) в зависимости от задач",
      "Настройте под ваши нужды: рендеринг, виртуалки, NAS или dev-сервер",
    ],
  },
];

const TABS = [
  { key: "xeon", label: "Гайд по Xeon-свапам" },
  { key: "sleeper", label: "Слипер-сборки" },
  { key: "scenarios", label: "Сценарии" },
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
          Серверные CPU в обычных платах = безумная выгода
        </h3>
        <p className="mt-2 font-mono text-sm leading-relaxed text-gray-400">
          Процессоры Xeon из списанных серверов можно сочетать с дешёвыми
          китайскими материнскими платами за долю стоимости аналогичного
          потребительского железа. Эти связки дают многоядерную производительность
          на уровне современных mid-range CPU за 10-20% цены.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border bg-surface-lighter">
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Модель Xeon
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Сокет
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Совместимая плата
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Тип ОЗУ
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Общая стоимость
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Оценка произв.
              </th>
              <th className="px-4 py-3 font-display text-xs font-semibold uppercase tracking-wider text-gray-500">
                Примечания
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
                    {row.totalCost.toLocaleString('ru-RU')}&nbsp;₽
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
              {build.totalCost.toLocaleString('ru-RU')}&nbsp;₽
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
                Производительность
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
              Стоимость: {scenario.costEstimate}
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
          Архив Legacy
        </h1>
        <p className="mt-4 max-w-2xl font-mono text-lg text-gray-400">
          Свапы Xeon, слипер-сборки и стратегии для выжимания максимума из
          старого железа.
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
