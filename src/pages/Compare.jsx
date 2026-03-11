import { useState, useMemo } from 'react'
import { COMPARE_GPUS } from '../data/benchmarks.js'

const GPU_NAMES = Object.keys(COMPARE_GPUS)

const SPEC_ROWS = [
  { key: 'brand', label: 'Brand', compare: false },
  { key: 'cores', label: 'Cores', compare: true, higherBetter: true },
  { key: 'baseClock', label: 'Base Clock', compare: true, higherBetter: true, parseNum: (v) => parseInt(v) },
  { key: 'boostClock', label: 'Boost Clock', compare: true, higherBetter: true, parseNum: (v) => parseInt(v) },
  { key: 'vram', label: 'VRAM', compare: true, higherBetter: true, parseNum: (v) => parseInt(v) },
  { key: 'tdp', label: 'TDP', compare: true, higherBetter: false, unit: 'W' },
  { key: 'process', label: 'Process', compare: true, higherBetter: false, parseNum: (v) => parseInt(v) },
  { key: 'price', label: 'Price', compare: true, higherBetter: false, unit: '$' },
]

const PERF_METRICS = [
  { key: 'gaming1080p', label: 'Gaming 1080p' },
  { key: 'gaming1440p', label: 'Gaming 1440p' },
  { key: 'gaming4k', label: 'Gaming 4K' },
  { key: 'rayTracing', label: 'Ray Tracing' },
  { key: 'productivity', label: 'Productivity' },
  { key: 'efficiency', label: 'Efficiency' },
]

function getWinner(row, valA, valB) {
  if (!row.compare) return null
  const numA = row.parseNum ? row.parseNum(String(valA)) : Number(valA)
  const numB = row.parseNum ? row.parseNum(String(valB)) : Number(valB)
  if (numA === numB) return null
  if (row.higherBetter) return numA > numB ? 'a' : 'b'
  return numA < numB ? 'a' : 'b'
}

function formatSpec(key, val) {
  if (key === 'price') return `$${val}`
  if (key === 'tdp') return `${val}W`
  if (key === 'cores') return val.toLocaleString()
  return val
}

// Hexagonal radar chart using SVG
function RadarChart({ gpuA, gpuB, nameA, nameB }) {
  const cx = 150
  const cy = 150
  const radius = 110
  const levels = 5
  const metrics = PERF_METRICS

  const angleStep = (2 * Math.PI) / metrics.length
  const startAngle = -Math.PI / 2

  function getPoint(index, value) {
    const angle = startAngle + index * angleStep
    const r = (value / 100) * radius
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  function makePolygonPoints(gpu) {
    return metrics
      .map((m, i) => {
        const p = getPoint(i, gpu[m.key])
        return `${p.x},${p.y}`
      })
      .join(' ')
  }

  const gridLevels = Array.from({ length: levels }, (_, i) => ((i + 1) / levels))

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 300 300" className="w-full max-w-md">
        {/* Grid hexagons */}
        {gridLevels.map((lvl) => (
          <polygon
            key={lvl}
            points={metrics
              .map((_, i) => {
                const angle = startAngle + i * angleStep
                const r = lvl * radius
                return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
              })
              .join(' ')}
            fill="none"
            stroke="#30363d"
            strokeWidth="0.5"
          />
        ))}

        {/* Axis lines */}
        {metrics.map((_, i) => {
          const angle = startAngle + i * angleStep
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + radius * Math.cos(angle)}
              y2={cy + radius * Math.sin(angle)}
              stroke="#30363d"
              strokeWidth="0.5"
            />
          )
        })}

        {/* GPU A polygon (cyan) */}
        <polygon
          points={makePolygonPoints(gpuA)}
          fill="rgba(0, 240, 255, 0.15)"
          stroke="#00f0ff"
          strokeWidth="2"
        />

        {/* GPU B polygon (purple) */}
        <polygon
          points={makePolygonPoints(gpuB)}
          fill="rgba(191, 90, 242, 0.15)"
          stroke="#bf5af2"
          strokeWidth="2"
        />

        {/* Data points */}
        {metrics.map((m, i) => {
          const pA = getPoint(i, gpuA[m.key])
          const pB = getPoint(i, gpuB[m.key])
          return (
            <g key={m.key}>
              <circle cx={pA.x} cy={pA.y} r="3" fill="#00f0ff" />
              <circle cx={pB.x} cy={pB.y} r="3" fill="#bf5af2" />
            </g>
          )
        })}

        {/* Axis labels */}
        {metrics.map((m, i) => {
          const angle = startAngle + i * angleStep
          const labelR = radius + 20
          const x = cx + labelR * Math.cos(angle)
          const y = cy + labelR * Math.sin(angle)
          return (
            <text
              key={m.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-400 text-[9px]"
            >
              {m.label}
            </text>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-6 mt-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-neon inline-block" />
          <span className="text-gray-300">{nameA}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-neon-purple inline-block" />
          <span className="text-gray-300">{nameB}</span>
        </div>
      </div>
    </div>
  )
}

export default function Compare() {
  const [gpuAName, setGpuAName] = useState('RTX 3070 Ti')
  const [gpuBName, setGpuBName] = useState('RX 6800')

  const gpuA = COMPARE_GPUS[gpuAName]
  const gpuB = COMPARE_GPUS[gpuBName]

  // Generate AI verdict
  const verdict = useMemo(() => {
    if (!gpuA || !gpuB) return ''

    const parts = []

    // Gaming comparison
    const gamingDiff1080 = gpuA.gaming1080p - gpuB.gaming1080p
    if (gamingDiff1080 !== 0) {
      const better = gamingDiff1080 > 0 ? gpuAName : gpuBName
      const pct = Math.abs(gamingDiff1080)
      parts.push(`${better}: better by ${pct}% in gaming at 1080p`)
    }

    // TDP comparison
    const tdpDiff = gpuA.tdp - gpuB.tdp
    if (tdpDiff !== 0) {
      const higher = tdpDiff > 0 ? gpuAName : gpuBName
      parts.push(`but ${higher} draws +${Math.abs(tdpDiff)}W TDP`)
    }

    // VRAM comparison
    const vramA = parseInt(gpuA.vram)
    const vramB = parseInt(gpuB.vram)
    if (vramA !== vramB) {
      const better = vramA > vramB ? gpuAName : gpuBName
      parts.push(`${better}: +${Math.abs(vramA - vramB)}GB VRAM`)
    }

    // Efficiency
    const effDiff = gpuA.efficiency - gpuB.efficiency
    if (effDiff !== 0) {
      const better = effDiff > 0 ? gpuAName : gpuBName
      parts.push(`${better}: superior efficiency`)
    }

    // Price / value
    const priceDiff = gpuA.price - gpuB.price
    if (priceDiff !== 0) {
      const cheaper = priceDiff > 0 ? gpuBName : gpuAName
      parts.push(`${cheaper}: better value at $${Math.min(gpuA.price, gpuB.price)}`)
    }

    // Ray tracing
    const rtDiff = gpuA.rayTracing - gpuB.rayTracing
    if (rtDiff !== 0) {
      const better = rtDiff > 0 ? gpuAName : gpuBName
      parts.push(`${better}: stronger ray tracing (+${Math.abs(rtDiff)}%)`)
    }

    return parts.join('. ') + '.'
  }, [gpuA, gpuB, gpuAName, gpuBName])

  if (!gpuA || !gpuB) {
    return <div className="text-gray-400 text-center py-12">Select two GPUs to compare.</div>
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-neon neon-text tracking-wider">
          Compare GPUs
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-mono">Side-by-side component analysis</p>
      </div>

      {/* Selector Header */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-mono uppercase tracking-wider">
            Component A
          </label>
          <select
            value={gpuAName}
            onChange={(e) => setGpuAName(e.target.value)}
            className="w-full bg-surface-light border border-border rounded-lg px-4 py-3 text-neon font-display text-lg focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/30 appearance-none cursor-pointer"
          >
            {GPU_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1 font-mono uppercase tracking-wider">
            Component B
          </label>
          <select
            value={gpuBName}
            onChange={(e) => setGpuBName(e.target.value)}
            className="w-full bg-surface-light border border-border rounded-lg px-4 py-3 text-neon-purple font-display text-lg focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/30 appearance-none cursor-pointer"
          >
            {GPU_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VS divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border" />
        <span className="font-display text-neon-yellow text-sm tracking-widest">VS</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Specs Table */}
      <div className="bg-surface-light border border-border rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 bg-surface-lighter px-4 py-2 border-b border-border">
          <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">Spec</span>
          <span className="text-xs text-neon font-mono uppercase tracking-wider text-center">
            {gpuAName}
          </span>
          <span className="text-xs text-neon-purple font-mono uppercase tracking-wider text-center">
            {gpuBName}
          </span>
        </div>
        {SPEC_ROWS.map((row) => {
          const valA = gpuA[row.key]
          const valB = gpuB[row.key]
          const winner = getWinner(row, valA, valB)
          return (
            <div
              key={row.key}
              className="grid grid-cols-3 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-surface-lighter/50 transition-colors"
            >
              <span className="text-gray-400 text-sm font-mono">{row.label}</span>
              <span
                className={`text-center text-sm font-mono ${
                  winner === 'a' ? 'text-neon-green font-bold' : 'text-gray-300'
                }`}
              >
                {formatSpec(row.key, valA)}
              </span>
              <span
                className={`text-center text-sm font-mono ${
                  winner === 'b' ? 'text-neon-green font-bold' : 'text-gray-300'
                }`}
              >
                {formatSpec(row.key, valB)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Performance Bars */}
      <div>
        <h2 className="font-display text-lg text-gray-200 mb-4 tracking-wider">
          Performance Benchmarks
        </h2>
        <div className="space-y-5">
          {PERF_METRICS.map((metric) => {
            const valA = gpuA[metric.key]
            const valB = gpuB[metric.key]
            return (
              <div key={metric.key}>
                <div className="text-sm text-gray-400 font-mono mb-2">{metric.label}</div>
                <div className="grid grid-cols-2 gap-3">
                  {/* Bar A (left, cyan) */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-surface-lighter rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-neon/80 to-neon transition-all duration-500"
                        style={{ width: `${valA}%` }}
                      />
                    </div>
                    <span className="text-neon text-sm font-mono w-10 text-right">{valA}%</span>
                  </div>
                  {/* Bar B (right, purple) */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-surface-lighter rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-neon-purple/80 to-neon-purple transition-all duration-500"
                        style={{ width: `${valB}%` }}
                      />
                    </div>
                    <span className="text-neon-purple text-sm font-mono w-10 text-right">
                      {valB}%
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Radar Chart */}
      <div>
        <h2 className="font-display text-lg text-gray-200 mb-4 tracking-wider">
          Radar Comparison
        </h2>
        <div className="bg-surface-light border border-border rounded-xl p-6">
          <RadarChart gpuA={gpuA} gpuB={gpuB} nameA={gpuAName} nameB={gpuBName} />
        </div>
      </div>

      {/* AI Verdict */}
      <div className="relative rounded-xl overflow-hidden">
        {/* Neon border glow */}
        <div className="absolute inset-0 rounded-xl border border-neon/60 shadow-[0_0_15px_rgba(0,240,255,0.3),inset_0_0_15px_rgba(0,240,255,0.05)]" />
        <div className="relative bg-surface-light/90 backdrop-blur rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-neon-yellow text-sm">&#9889;</span>
            <h3 className="font-display text-neon-yellow text-sm tracking-widest uppercase">
              AI Verdict
            </h3>
          </div>
          <p className="text-gray-300 font-mono text-sm leading-relaxed">{verdict}</p>
        </div>
      </div>
    </div>
  )
}
