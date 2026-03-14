import { SAMPLE_RIG, UPGRADE_PATHS } from '../data/components.js'

const STATUS_COLORS = {
  ok: { bg: 'bg-neon-green/10', border: 'border-neon-green/40', dot: 'bg-neon-green', text: 'text-neon-green', label: 'Норма' },
  weak: { bg: 'bg-neon-yellow/10', border: 'border-neon-yellow/40', dot: 'bg-neon-yellow', text: 'text-neon-yellow', label: 'Слабый' },
  bottleneck: { bg: 'bg-neon-red/10', border: 'border-neon-red/40', dot: 'bg-neon-red', text: 'text-neon-red', label: 'Узкое место' },
}

const COMPONENT_ICONS = {
  cpu: '⚡',
  gpu: '🎮',
  ram: '📊',
  storage: '💾',
  psu: '🔌',
}

function scoreColor(score) {
  if (score >= 70) return 'text-neon-green'
  if (score >= 50) return 'text-neon-yellow'
  return 'text-neon-red'
}

function scoreStroke(score) {
  if (score >= 70) return '#39ff14'
  if (score >= 50) return '#ffe600'
  return '#ff3131'
}

function barColor(score) {
  if (score >= 70) return 'bg-neon-green'
  if (score >= 50) return 'bg-neon-yellow'
  return 'bg-neon-red'
}

function barGlow(score) {
  if (score >= 70) return 'shadow-[0_0_8px_rgba(57,255,20,0.4)]'
  if (score >= 50) return 'shadow-[0_0_8px_rgba(255,230,0,0.4)]'
  return 'shadow-[0_0_8px_rgba(255,49,49,0.4)]'
}

const TIER_STYLES = {
  'Базовый': { accent: 'neon-yellow', border: 'border-neon-yellow/30', glow: 'hover:shadow-[0_0_20px_rgba(255,230,0,0.15)]' },
  'Оптимальный': { accent: 'neon-green', border: 'border-neon-green/30', glow: 'hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]' },
  'Новая сборка': { accent: 'neon-purple', border: 'border-neon-purple/30', glow: 'hover:shadow-[0_0_20px_rgba(191,90,242,0.15)]' },
}

function BalanceRing({ score }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const stroke = scoreStroke(score)

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke="#30363d"
            strokeWidth="8"
          />
          <circle
            cx="50" cy="50" r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="score-ring"
            style={{ filter: `drop-shadow(0 0 6px ${stroke})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-4xl font-bold ${scoreColor(score)}`}>
            {score}
          </span>
          <span className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-1">
            Баланс
          </span>
        </div>
      </div>
    </div>
  )
}

function ComponentRow({ label, component }) {
  const s = STATUS_COLORS[component.status]
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${s.bg} ${s.border}`}>
      <span className="text-lg">{COMPONENT_ICONS[label]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-display uppercase tracking-wider text-gray-400">
            {label}
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>
        <p className="text-sm text-gray-200 font-mono truncate">{component.name}</p>
      </div>
      <span className={`font-display font-bold text-sm ${scoreColor(component.score)}`}>
        {component.score}
      </span>
    </div>
  )
}

function ComponentBar({ label, component }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-gray-400 uppercase tracking-wider">{label}</span>
        <span className={`font-bold ${scoreColor(component.score)}`}>{component.score}/100</span>
      </div>
      <div className="h-3 bg-surface-lighter rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor(component.score)} ${barGlow(component.score)} transition-all duration-1000`}
          style={{ width: `${component.score}%` }}
        />
      </div>
    </div>
  )
}

function UpgradeCard({ path }) {
  const style = TIER_STYLES[path.tier]
  const accentText = `text-${style.accent}`
  const accentBorder = style.border

  return (
    <div
      className={`flex flex-col bg-surface-light border ${accentBorder} rounded-xl p-5 transition-shadow duration-300 ${style.glow}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className={`font-display text-sm font-bold uppercase tracking-wider ${accentText}`}>
            {path.tier}
          </h3>
          <p className="text-gray-400 text-xs font-mono">{path.label}</p>
        </div>
        <span className={`font-display text-xl font-bold ${accentText}`}>
          {path.price.toLocaleString('ru-RU')}&nbsp;₽
        </span>
      </div>

      <p className="text-gray-500 text-xs font-mono mb-4">{path.description}</p>

      {/* Changes */}
      <div className="flex-1 space-y-2 mb-4">
        {path.changes.map((c, i) => (
          <div key={i} className="bg-surface/60 rounded-lg px-3 py-2 border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-display uppercase tracking-wider text-gray-500">
                {c.component}
              </span>
              <span className="text-[10px] font-mono font-bold text-neon-green">{c.gain}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono mt-0.5">
              <span className="text-neon-red/70 line-through">{c.from}</span>
              <span className="text-gray-600">&rarr;</span>
              <span className="text-gray-200">{c.to}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sell current estimate */}
      {path.sellCurrent && (
        <div className="text-[10px] font-mono text-gray-500 mb-3 flex items-center gap-1">
          <span className="text-neon-purple">&#9679;</span>
          Продать текущий ПК: ~{path.sellCurrent.toLocaleString('ru-RU')}&nbsp;₽ &rarr; итого ~{(path.price - path.sellCurrent).toLocaleString('ru-RU')}&nbsp;₽
        </div>
      )}

      {/* Performance gain */}
      <div className="border-t border-border/50 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
            Общий прирост
          </span>
          <span className={`font-display font-bold text-sm ${accentText}`}>
            +{path.perfGain}%
          </span>
        </div>
        <div className="h-1.5 bg-surface-lighter rounded-full mt-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full bg-${style.accent}`}
            style={{ width: `${Math.min(path.perfGain, 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function SellTradePanel() {
  const estimatedValue = 12000
  const low = 9600
  const high = 14800
  const range = 20000
  const lowPct = (low / range) * 100
  const highPct = (high / range) * 100
  const midPct = (estimatedValue / range) * 100

  return (
    <div className="bg-surface-light border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neon neon-text">
            Продать или обменять
          </h2>
          <p className="text-gray-500 text-xs font-mono mt-1">
            Оценка стоимости текущего ПК на вторичке
          </p>
        </div>
        <span className="font-display text-3xl font-bold text-neon-green">
          ~{estimatedValue.toLocaleString('ru-RU')}&nbsp;₽
        </span>
      </div>

      {/* Confidence interval bar */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
          <span>0&nbsp;₽</span>
          <span>{range.toLocaleString('ru-RU')}&nbsp;₽</span>
        </div>
        <div className="relative h-4 bg-surface-lighter rounded-full overflow-hidden">
          {/* Confidence interval range */}
          <div
            className="absolute top-0 h-full bg-neon-green/15 rounded-full"
            style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }}
          />
          {/* Estimated value marker */}
          <div
            className="absolute top-0 h-full w-1 bg-neon-green rounded-full shadow-[0_0_8px_rgba(57,255,20,0.6)]"
            style={{ left: `${midPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-gray-500">Мин: <span className="text-neon-yellow">{low.toLocaleString('ru-RU')}&nbsp;₽</span></span>
          <span className="text-gray-400">Оценка: <span className="text-neon-green font-bold">{estimatedValue.toLocaleString('ru-RU')}&nbsp;₽</span></span>
          <span className="text-gray-500">Макс: <span className="text-neon-yellow">{high.toLocaleString('ru-RU')}&nbsp;₽</span></span>
        </div>
      </div>

      <button className="w-full py-2.5 rounded-lg bg-neon-green/10 border border-neon-green/40 text-neon-green font-display text-sm font-bold uppercase tracking-wider hover:bg-neon-green/20 hover:shadow-[0_0_20px_rgba(57,255,20,0.15)] transition-all duration-300 cursor-pointer">
        Разместить объявление
      </button>
    </div>
  )
}

export default function RigScan() {
  const rig = SAMPLE_RIG
  const components = ['cpu', 'gpu', 'ram', 'storage', 'psu']

  return (
    <div className="min-h-screen bg-surface pcb-bg px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page header */}
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-neon neon-text uppercase tracking-widest">
            Скан ПК
          </h1>
          <p className="text-gray-500 font-mono text-sm">
            Диагностика и аналитика апгрейда
          </p>
        </div>

        {/* Top section: Rig Profile + Balance Index */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Rig Profile */}
          <div className="lg:col-span-2 bg-surface-light border border-border rounded-xl p-6 neon-glow">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neon neon-text mb-4">
              Профиль текущего ПК
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {components.map((key) => (
                <ComponentRow key={key} label={key} component={rig[key]} />
              ))}
            </div>
          </div>

          {/* Balance Index */}
          <div className="bg-surface-light border border-border rounded-xl p-6 flex flex-col items-center justify-center">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neon neon-text mb-4">
              Индекс баланса
            </h2>
            <BalanceRing score={rig.balanceIndex} />
            <p className="text-gray-500 text-xs font-mono text-center mt-3">
              {rig.balanceIndex < 50
                ? 'Серьёзный дисбаланс. Ключевые компоненты ограничивают общую производительность.'
                : rig.balanceIndex < 75
                  ? 'Умеренный дисбаланс. Некоторые компоненты стоит обновить.'
                  : 'Хорошо сбалансированный ПК. Мелкие улучшения ещё возможны.'}
            </p>
          </div>
        </div>

        {/* Component Breakdown */}
        <div className="bg-surface-light border border-border rounded-xl p-6">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neon neon-text mb-5">
            Разбор по компонентам
          </h2>
          <div className="space-y-4">
            {components.map((key) => (
              <ComponentBar key={key} label={key} component={rig[key]} />
            ))}
          </div>
        </div>

        {/* Upgrade Paths */}
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-neon neon-text mb-4">
            Пути апгрейда
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {UPGRADE_PATHS.map((path) => (
              <UpgradeCard key={path.tier} path={path} />
            ))}
          </div>
        </div>

        {/* Sell or Trade Panel */}
        <SellTradePanel />
      </div>
    </div>
  )
}
