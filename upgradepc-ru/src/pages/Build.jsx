import { useState, useMemo } from 'react';
import { CPUS, GPUS, RAM, STORAGE, PSU, CASES, COMPONENT_CATEGORIES } from '../data/components.js';

const CATEGORY_DATA = {
  cpu: CPUS,
  gpu: GPUS,
  ram: RAM,
  storage: STORAGE,
  psu: PSU,
  case: CASES,
};

/* ---------- helpers ---------- */

function getSpecs(categoryKey, item) {
  switch (categoryKey) {
    case 'cpu':
      return [
        `${item.cores}C / ${item.threads}T`,
        `${item.baseClock}–${item.boostClock} GHz`,
        `${item.tdp}W TDP`,
        item.socket,
      ];
    case 'gpu':
      return [
        `${item.vram} GB VRAM`,
        `${item.tdp}W TDP`,
        item.used ? 'Б/У' : item.legacy ? 'Устаревший' : 'Новый',
      ];
    case 'ram':
      return [`${item.capacity} GB`, `${item.type}-${item.speed}`, item.type];
    case 'storage':
      return [
        `${item.capacity >= 1000 ? `${item.capacity / 1000} TB` : `${item.capacity} GB`}`,
        item.type,
      ];
    case 'psu':
      return [`${item.wattage}W`, item.efficiency];
    case 'case':
      return [item.formFactor, item.used ? 'Б/У' : 'Новый'];
    default:
      return [];
  }
}

function getTdp(item, categoryKey) {
  if (categoryKey === 'cpu' || categoryKey === 'gpu') return item.tdp || 0;
  return 0;
}

function computeBottleneck(selected) {
  const cpu = selected.cpu;
  const gpu = selected.gpu;
  if (!cpu || !gpu) return null;
  const diff = Math.abs(cpu.rating - gpu.rating);
  const pct = Math.round((diff / Math.max(cpu.rating, gpu.rating)) * 100);
  const side = cpu.rating < gpu.rating ? 'CPU' : 'GPU';
  return { pct, side };
}

function checkCompatibility(selected) {
  const issues = [];
  // DDR check — DDR5 RAM needs LGA1700
  if (selected.ram && selected.cpu) {
    if (selected.ram.type === 'DDR5' && selected.cpu.socket !== 'LGA1700') {
      issues.push('DDR5 память требует процессор с сокетом LGA1700');
    }
    if (selected.ram.type === 'DDR3' && !selected.cpu.legacy) {
      issues.push('DDR3 память подходит только для устаревших платформ');
    }
  }
  // PSU headroom check
  if (selected.psu) {
    let totalTdp = 0;
    if (selected.cpu) totalTdp += selected.cpu.tdp || 0;
    if (selected.gpu) totalTdp += selected.gpu.tdp || 0;
    totalTdp += 75; // base system draw
    if (totalTdp > selected.psu.wattage) {
      issues.push(`БП слишком слабый (${selected.psu.wattage}W < ~${totalTdp}W)`);
    }
  }
  return issues;
}

/* ---------- sub-components ---------- */

function RatingBar({ rating }) {
  const color =
    rating >= 85
      ? 'bg-neon-green'
      : rating >= 70
        ? 'bg-neon'
        : rating >= 50
          ? 'bg-neon-yellow'
          : 'bg-neon-red';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-surface-lighter overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${rating}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-gray-400 w-7 text-right">{rating}</span>
    </div>
  );
}

function CompatBadge({ selected, item, categoryKey }) {
  // Quick per-card compatibility hint
  const test = { ...selected, [categoryKey]: item };
  const issues = checkCompatibility(test);
  const ok = issues.length === 0;
  return (
    <span
      className={`text-xs px-1.5 py-0.5 rounded font-mono ${
        ok
          ? 'bg-neon-green/10 text-neon-green border border-neon-green/30'
          : 'bg-neon-red/10 text-neon-red border border-neon-red/30'
      }`}
      title={ok ? 'Совместимо' : issues.join(', ')}
    >
      {ok ? '\u2713' : '\u2717'}
    </span>
  );
}

/* ---------- main component ---------- */

export default function Build() {
  const [selectedCategory, setSelectedCategory] = useState('cpu');
  const [selectedComponents, setSelectedComponents] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);

  const items = CATEGORY_DATA[selectedCategory] || [];

  /* derived */
  const totalPrice = useMemo(
    () =>
      Object.values(selectedComponents).reduce((s, c) => s + (c.price || 0), 0),
    [selectedComponents],
  );

  const totalTdp = useMemo(() => {
    let tdp = 75; // base
    Object.entries(selectedComponents).forEach(([key, c]) => {
      tdp += getTdp(c, key);
    });
    return tdp;
  }, [selectedComponents]);

  const bottleneck = useMemo(() => computeBottleneck(selectedComponents), [selectedComponents]);

  const compatIssues = useMemo(() => checkCompatibility(selectedComponents), [selectedComponents]);

  /* handlers */
  const selectComponent = (categoryKey, item) => {
    setSelectedComponents((prev) => {
      // toggle off if same item clicked
      if (prev[categoryKey]?.id === item.id) {
        const next = { ...prev };
        delete next[categoryKey];
        return next;
      }
      return { ...prev, [categoryKey]: item };
    });
  };

  const toggleExpand = (id) =>
    setExpandedCard((prev) => (prev === id ? null : id));

  /* ----- render ----- */
  return (
    <div className="min-h-screen bg-surface pcb-bg text-gray-200 flex flex-col font-mono">
      {/* header */}
      <header className="border-b border-border bg-surface-light/80 backdrop-blur px-6 py-4">
        <h1 className="font-display text-2xl tracking-wider neon-text text-neon">
          Конструктор&nbsp;ПК
        </h1>
        <p className="text-xs text-gray-500 mt-1 tracking-wide">
          Выберите компоненты для вашей сборки
        </p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ---- sidebar ---- */}
        <aside className="w-56 shrink-0 border-r border-border bg-surface-light/60 flex flex-col py-4 overflow-y-auto">
          {COMPONENT_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.key;
            const chosen = selectedComponents[cat.key];
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-3 px-5 py-3 text-left transition-colors relative group ${
                  active
                    ? 'bg-neon/10 text-neon'
                    : 'hover:bg-surface-lighter text-gray-400 hover:text-gray-200'
                }`}
              >
                {/* active indicator */}
                {active && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-neon rounded-r" />
                )}

                <span className="text-lg w-7 text-center">{cat.icon}</span>

                <span className="flex-1 text-sm font-display tracking-wide">
                  {cat.label}
                </span>

                {chosen ? (
                  <span className="text-neon-green text-sm">{'\u2713'}</span>
                ) : (
                  <span className="w-4 h-4 rounded border border-border" />
                )}

                {/* selected component name below label */}
                {chosen && (
                  <span className="absolute bottom-0.5 left-15 right-3 text-[9px] text-gray-500 truncate">
                    {chosen.name}
                  </span>
                )}
              </button>
            );
          })}

          {/* sidebar summary */}
          <div className="mt-auto px-5 pt-6 border-t border-border space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Выбрано
            </p>
            {Object.keys(selectedComponents).length === 0 && (
              <p className="text-xs text-gray-600 italic">Пока ничего</p>
            )}
            {Object.entries(selectedComponents).map(([key, comp]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-gray-400 truncate max-w-[110px]">{comp.name}</span>
                <span className="text-neon-green font-mono">{comp.price.toLocaleString('ru-RU')}&thinsp;&#8381;</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ---- main grid ---- */}
        <main className="flex-1 overflow-y-auto p-6 pb-28">
          <h2 className="font-display text-lg tracking-wide text-gray-300 mb-4">
            {COMPONENT_CATEGORIES.find((c) => c.key === selectedCategory)?.icon}{' '}
            {COMPONENT_CATEGORIES.find((c) => c.key === selectedCategory)?.label}
            <span className="text-xs text-gray-500 ml-3 font-mono">
              {items.length} шт.
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item) => {
              const isSelected = selectedComponents[selectedCategory]?.id === item.id;
              const isExpanded = expandedCard === item.id;
              const specs = getSpecs(selectedCategory, item);

              return (
                <div
                  key={item.id}
                  onClick={() => selectComponent(selectedCategory, item)}
                  className={`relative rounded-lg border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-neon neon-glow bg-neon/5'
                      : 'border-border hover:border-neon-dim bg-surface-light hover:bg-surface-lighter'
                  }`}
                >
                  {/* selected indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon text-surface flex items-center justify-center text-xs font-bold shadow-lg">
                      {'\u2713'}
                    </div>
                  )}

                  <div className="p-4 space-y-3">
                    {/* top row: brand + compat */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">
                        {item.brand}
                      </span>
                      <CompatBadge
                        selected={selectedComponents}
                        item={item}
                        categoryKey={selectedCategory}
                      />
                    </div>

                    {/* name */}
                    <h3 className="font-display text-sm tracking-wide text-gray-100 leading-snug">
                      {item.name}
                    </h3>

                    {/* specs pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {specs.map((s, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-surface-lighter text-gray-400 border border-border"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* rating */}
                    <RatingBar rating={item.rating} />

                    {/* price */}
                    <div className="flex items-end justify-between">
                      <span className="font-display text-lg text-neon-green">
                        {item.price.toLocaleString('ru-RU')}&thinsp;&#8381;
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(item.id);
                        }}
                        className="text-[10px] text-gray-500 hover:text-neon transition-colors"
                      >
                        {isExpanded ? 'Скрыть \u25B2' : 'Ещё \u25BC'}
                      </button>
                    </div>

                    {/* expanded details */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-border text-[11px] text-gray-500 space-y-1">
                        <p>ID: {item.id}</p>
                        <p>Rating: {item.rating}/100</p>
                        {item.socket && <p>Socket: {item.socket}</p>}
                        {item.legacy && (
                          <p className="text-neon-yellow">Устаревший компонент</p>
                        )}
                        {item.used && (
                          <p className="text-neon-yellow">Б/У / восстановленный</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* ---- status bar (sticky bottom) ---- */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-surface-light/95 backdrop-blur-lg px-6 py-3 flex items-center gap-6 z-50">
        {/* total price */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">Итого</span>
          <span className="font-display text-xl text-neon-green neon-text">
            {totalPrice.toLocaleString('ru-RU')}&thinsp;&#8381;
          </span>
        </div>

        {/* divider */}
        <span className="w-px h-6 bg-border" />

        {/* TDP / wattage */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">
            TDP
          </span>
          <span className="font-mono text-sm text-neon-yellow">{totalTdp}W</span>
        </div>

        <span className="w-px h-6 bg-border" />

        {/* bottleneck */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">
            Боттлнек
          </span>
          {bottleneck ? (
            <span
              className={`font-mono text-sm ${
                bottleneck.pct > 15 ? 'text-neon-red' : bottleneck.pct > 8 ? 'text-neon-yellow' : 'text-neon-green'
              }`}
            >
              {bottleneck.pct}% ({bottleneck.side})
            </span>
          ) : (
            <span className="text-xs text-gray-600 italic">Выберите CPU и GPU</span>
          )}
        </div>

        <span className="w-px h-6 bg-border" />

        {/* compatibility */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {compatIssues.length === 0 ? (
            <span className="text-xs text-neon-green flex items-center gap-1">
              {'\u2713'} Совместимо
            </span>
          ) : (
            <span className="text-xs text-neon-red truncate" title={compatIssues.join(' | ')}>
              {'\u2717'} {compatIssues[0]}
              {compatIssues.length > 1 && ` (+${compatIssues.length - 1})`}
            </span>
          )}
        </div>

        {/* action buttons */}
        <button className="px-4 py-2 rounded border border-neon/50 text-neon text-xs font-display tracking-wider hover:bg-neon/10 transition-colors">
          Поделиться
        </button>
        <button className="px-4 py-2 rounded bg-neon text-surface text-xs font-display tracking-wider font-bold hover:bg-neon/80 transition-colors neon-glow">
          Сохранить сборку
        </button>
      </div>
    </div>
  );
}
