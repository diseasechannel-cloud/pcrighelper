import { useState } from 'react'
import { BENCHMARK_GAMES, BENCHMARK_SCORES, THERMAL_DATA, SCORE_DISTRIBUTION } from '../data/benchmarks.js'

/* ─── Mini Score Ring (SVG) ─── */
function ScoreRing({ value, max = 100, label, color = '#00f0ff', size = 80 }) {
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / max) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#21262d" strokeWidth="6" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
          transform="rotate(-90 40 40)"
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
        <text x="40" y="44" textAnchor="middle" fill={color} fontSize="16" fontFamily="Orbitron" fontWeight="700">
          {value}
        </text>
      </svg>
      <span className="text-[11px] text-gray-400 font-mono uppercase tracking-wider">{label}</span>
    </div>
  )
}

/* ─── FPS Cell Color ─── */
function fpsColor(fps) {
  if (fps > 90) return { bg: 'bg-neon-green/15', text: 'text-neon-green', border: 'border-neon-green/30' }
  if (fps >= 60) return { bg: 'bg-neon-yellow/15', text: 'text-neon-yellow', border: 'border-neon-yellow/30' }
  if (fps >= 30) return { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' }
  return { bg: 'bg-neon-red/15', text: 'text-neon-red', border: 'border-neon-red/30' }
}

/* ─── Productivity Data ─── */
const PRODUCTIVITY_TASKS = [
  { name: 'Video Editing (DaVinci)', score: 72, percentile: 68, color: '#bf5af2' },
  { name: '3D Rendering (Blender)', score: 58, percentile: 55, color: '#00f0ff' },
  { name: 'Code Compilation', score: 81, percentile: 79, color: '#39ff14' },
  { name: 'AI / ML Workloads', score: 45, percentile: 42, color: '#ffe600' },
]

/* ─── Tabs ─── */
const TABS = ['Gaming', 'Productivity', 'Thermals']

/* ═══════════════════════════════════════════════════════════════════ */
export default function Benchmark() {
  const [activeTab, setActiveTab] = useState('Gaming')

  return (
    <div className="space-y-6">
      {/* ── Page Title ── */}
      <div>
        <h1 className="font-display text-2xl text-neon neon-text tracking-wide">Benchmark Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1 font-mono">Performance profiling &amp; thermal analysis</p>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  Hardware Profile Header                                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="bg-surface-light border border-border rounded-xl p-6 neon-glow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left — Hardware Name */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-1">Active Hardware Profile</p>
            <h2 className="font-display text-xl text-white tracking-wide">
              RTX 3070 Ti <span className="text-neon">+</span> Ryzen 5 5600X
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[11px] bg-neon/10 text-neon border border-neon/20 rounded px-2 py-0.5 font-mono">
                8 GB GDDR6X
              </span>
              <span className="text-[11px] bg-neon-purple/10 text-neon-purple border border-neon-purple/20 rounded px-2 py-0.5 font-mono">
                6C / 12T
              </span>
              <span className="text-[11px] bg-neon-green/10 text-neon-green border border-neon-green/20 rounded px-2 py-0.5 font-mono">
                32 GB DDR4
              </span>
            </div>
          </div>

          {/* Right — Score Rings */}
          <div className="flex items-center gap-6">
            <ScoreRing value={42} label="1% Low FPS" color="#ff3131" />
            <ScoreRing value={BENCHMARK_SCORES.gaming} label="Avg FPS" color="#00f0ff" />
            <ScoreRing value={BENCHMARK_SCORES.thermals} label="Efficiency" color="#39ff14" />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  Tab Bar                                                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-1 bg-surface-light border border-border rounded-lg p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-mono transition-all ${
              activeTab === tab
                ? 'bg-neon/10 text-neon border border-neon/30 neon-glow'
                : 'text-gray-400 hover:text-gray-200 hover:bg-surface-lighter border border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/*  Tab Content                                              */}
      {/* ══════════════════════════════════════════════════════════ */}

      {/* ── Gaming Tab ── */}
      {activeTab === 'Gaming' && (
        <div className="space-y-6">
          {/* FPS Heatmap */}
          <div className="bg-surface-light border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display text-sm text-white tracking-wide">FPS Heatmap</h3>
              <span className="text-[10px] text-gray-500 font-mono">Ultra Settings · DLSS Off</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-medium">Game</th>
                    <th className="text-center px-4 py-3 font-medium">Genre</th>
                    <th className="text-center px-4 py-3 font-medium">1080p</th>
                    <th className="text-center px-4 py-3 font-medium">1440p</th>
                    <th className="text-center px-4 py-3 font-medium">4K</th>
                  </tr>
                </thead>
                <tbody>
                  {BENCHMARK_GAMES.map((game, i) => {
                    const c1080 = fpsColor(game.fps1080p)
                    const c1440 = fpsColor(game.fps1440p)
                    const c4k = fpsColor(game.fps4k)
                    return (
                      <tr
                        key={game.name}
                        className={`border-t border-border/50 hover:bg-surface-lighter/50 transition-colors ${
                          i % 2 === 0 ? 'bg-surface/30' : ''
                        }`}
                      >
                        <td className="px-5 py-3 text-white font-medium">{game.name}</td>
                        <td className="px-4 py-3 text-center text-gray-500 text-xs">{game.genre}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-3 py-1 rounded border ${c1080.bg} ${c1080.text} ${c1080.border} text-xs font-bold min-w-[52px]`}>
                            {game.fps1080p}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-3 py-1 rounded border ${c1440.bg} ${c1440.text} ${c1440.border} text-xs font-bold min-w-[52px]`}>
                            {game.fps1440p}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-3 py-1 rounded border ${c4k.bg} ${c4k.text} ${c4k.border} text-xs font-bold min-w-[52px]`}>
                            {game.fps4k}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="px-5 py-3 border-t border-border/50 flex items-center gap-4 text-[10px] text-gray-500 font-mono">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-green" /> &gt;90 FPS</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-yellow" /> 60–90</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> 30–60</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-neon-red" /> &lt;30</span>
            </div>
          </div>

          {/* Score Distribution — Box Plot */}
          <div className="bg-surface-light border border-border rounded-xl p-5">
            <h3 className="font-display text-sm text-white tracking-wide mb-4">Score Distribution</h3>
            <p className="text-[11px] text-gray-500 font-mono mb-5">
              Your gaming score vs. all tested rigs in the UpgradeRig database
            </p>

            {(() => {
              const dist = SCORE_DISTRIBUTION.gaming
              const p5  = dist.find(d => d.percentile === 5).score
              const p25 = dist.find(d => d.percentile === 25).score
              const p50 = dist.find(d => d.percentile === 50).score
              const p75 = dist.find(d => d.percentile === 75).score
              const p95 = dist.find(d => d.percentile === 95).score
              const yours = SCORE_DISTRIBUTION.yourScore

              return (
                <div className="relative">
                  {/* Scale labels */}
                  <div className="flex justify-between text-[10px] text-gray-600 font-mono mb-2 px-1">
                    {[0, 25, 50, 75, 100].map(v => <span key={v}>{v}</span>)}
                  </div>

                  {/* Track */}
                  <div className="relative h-14 bg-surface rounded-lg border border-border/50 overflow-hidden">
                    {/* Whisker line (P5 to P95) */}
                    <div
                      className="absolute top-1/2 h-[2px] bg-gray-600 -translate-y-1/2"
                      style={{ left: `${p5}%`, width: `${p95 - p5}%` }}
                    />

                    {/* Whisker caps */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-[2px] h-5 bg-gray-500" style={{ left: `${p5}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-[2px] h-5 bg-gray-500" style={{ left: `${p95}%` }} />

                    {/* IQR box (P25 to P75) */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-9 rounded border border-neon/30 bg-neon/10"
                      style={{ left: `${p25}%`, width: `${p75 - p25}%` }}
                    />

                    {/* Median line */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-[3px] h-9 bg-neon rounded-full"
                      style={{ left: `${p50}%`, boxShadow: '0 0 8px #00f0ff88' }}
                    />

                    {/* Your Score marker */}
                    <div
                      className="absolute -top-1 flex flex-col items-center"
                      style={{ left: `${yours}%`, transform: 'translateX(-50%)' }}
                    >
                      <span className="text-[10px] font-display text-neon-green font-bold whitespace-nowrap">
                        You: {yours}
                      </span>
                      <div className="w-[2px] h-3 bg-neon-green" />
                      <div
                        className="w-3 h-3 rounded-full bg-neon-green border-2 border-surface"
                        style={{ boxShadow: '0 0 8px #39ff1488' }}
                      />
                    </div>
                  </div>

                  {/* Percentile Labels */}
                  <div className="relative h-5 mt-1">
                    <span className="absolute text-[9px] text-gray-600 font-mono" style={{ left: `${p5}%`, transform: 'translateX(-50%)' }}>P5</span>
                    <span className="absolute text-[9px] text-gray-600 font-mono" style={{ left: `${p25}%`, transform: 'translateX(-50%)' }}>P25</span>
                    <span className="absolute text-[9px] text-neon/70 font-mono font-bold" style={{ left: `${p50}%`, transform: 'translateX(-50%)' }}>P50</span>
                    <span className="absolute text-[9px] text-gray-600 font-mono" style={{ left: `${p75}%`, transform: 'translateX(-50%)' }}>P75</span>
                    <span className="absolute text-[9px] text-gray-600 font-mono" style={{ left: `${p95}%`, transform: 'translateX(-50%)' }}>P95</span>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* ── Productivity Tab ── */}
      {activeTab === 'Productivity' && (
        <div className="bg-surface-light border border-border rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm text-white tracking-wide">Productivity Benchmarks</h3>
            <span className="text-[10px] text-gray-500 font-mono">Overall: {BENCHMARK_SCORES.productivity}/100</span>
          </div>

          {PRODUCTIVITY_TASKS.map((task) => (
            <div key={task.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300 font-mono">{task.name}</span>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: task.color }}
                  >
                    {task.score}/100
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono bg-surface-lighter px-2 py-0.5 rounded">
                    Top {100 - task.percentile}%
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="relative h-6 bg-surface rounded-md border border-border/50 overflow-hidden">
                {/* Fill */}
                <div
                  className="absolute inset-y-0 left-0 rounded-md transition-all duration-700"
                  style={{
                    width: `${task.score}%`,
                    background: `linear-gradient(90deg, ${task.color}33, ${task.color}88)`,
                    boxShadow: `0 0 12px ${task.color}44`,
                  }}
                />
                {/* Percentile marker */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-white/40"
                  style={{ left: `${task.percentile}%` }}
                  title={`${task.percentile}th percentile`}
                />
                <div
                  className="absolute -top-0.5 text-[8px] text-gray-400 font-mono"
                  style={{ left: `${task.percentile}%`, transform: 'translateX(-50%)' }}
                >
                  ▼
                </div>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-border/50">
            {PRODUCTIVITY_TASKS.map((task) => (
              <div key={task.name} className="bg-surface rounded-lg border border-border/50 p-3 text-center">
                <div className="text-lg font-display font-bold" style={{ color: task.color }}>
                  {task.score}
                </div>
                <div className="text-[10px] text-gray-500 font-mono mt-1">{task.name.split('(')[0].trim()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Thermals Tab ── */}
      {activeTab === 'Thermals' && (
        <div className="space-y-6">
          {/* Thermal Chart */}
          <div className="bg-surface-light border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm text-white tracking-wide">Temperature Over Time</h3>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-[2px] bg-neon rounded" /> CPU
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-[2px] bg-neon-red rounded" /> GPU
                </span>
              </div>
            </div>

            {(() => {
              const svgW = 600
              const svgH = 250
              const padL = 40
              const padR = 20
              const padT = 20
              const padB = 35
              const chartW = svgW - padL - padR
              const chartH = svgH - padT - padB

              const minTemp = 20
              const maxTemp = 100
              const throttleTemp = 85

              const xStep = chartW / (THERMAL_DATA.length - 1)
              const yScale = (temp) => padT + chartH - ((temp - minTemp) / (maxTemp - minTemp)) * chartH
              const xScale = (i) => padL + i * xStep

              const cpuPoints = THERMAL_DATA.map((d, i) => `${xScale(i)},${yScale(d.cpuTemp)}`).join(' ')
              const gpuPoints = THERMAL_DATA.map((d, i) => `${xScale(i)},${yScale(d.gpuTemp)}`).join(' ')

              const maxCpu = Math.max(...THERMAL_DATA.map(d => d.cpuTemp))
              const maxGpu = Math.max(...THERMAL_DATA.map(d => d.gpuTemp))
              const idleCpu = THERMAL_DATA[0].cpuTemp
              const idleGpu = THERMAL_DATA[0].gpuTemp

              return (
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
                  {/* Grid lines */}
                  {[20, 40, 60, 80, 100].map(temp => (
                    <g key={temp}>
                      <line
                        x1={padL} y1={yScale(temp)} x2={svgW - padR} y2={yScale(temp)}
                        stroke="#21262d" strokeWidth="1"
                      />
                      <text x={padL - 6} y={yScale(temp) + 4} textAnchor="end" fill="#484f58" fontSize="10" fontFamily="JetBrains Mono">
                        {temp}°
                      </text>
                    </g>
                  ))}

                  {/* Throttle threshold */}
                  <line
                    x1={padL} y1={yScale(throttleTemp)} x2={svgW - padR} y2={yScale(throttleTemp)}
                    stroke="#ff3131" strokeWidth="1" strokeDasharray="6 3" opacity="0.6"
                  />
                  <text x={svgW - padR + 4} y={yScale(throttleTemp) + 3} fill="#ff3131" fontSize="9" fontFamily="JetBrains Mono" opacity="0.8">
                    THROTTLE
                  </text>

                  {/* CPU area fill */}
                  <polygon
                    points={`${xScale(0)},${yScale(minTemp)} ${cpuPoints} ${xScale(THERMAL_DATA.length - 1)},${yScale(minTemp)}`}
                    fill="url(#cpuGrad)" opacity="0.15"
                  />
                  {/* GPU area fill */}
                  <polygon
                    points={`${xScale(0)},${yScale(minTemp)} ${gpuPoints} ${xScale(THERMAL_DATA.length - 1)},${yScale(minTemp)}`}
                    fill="url(#gpuGrad)" opacity="0.1"
                  />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00f0ff" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gpuGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff3131" />
                      <stop offset="100%" stopColor="#ff3131" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* CPU Line */}
                  <polyline
                    points={cpuPoints}
                    fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px #00f0ff88)' }}
                  />
                  {/* GPU Line */}
                  <polyline
                    points={gpuPoints}
                    fill="none" stroke="#ff3131" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px #ff313188)' }}
                  />

                  {/* Data points */}
                  {THERMAL_DATA.map((d, i) => (
                    <g key={i}>
                      <circle cx={xScale(i)} cy={yScale(d.cpuTemp)} r="3.5" fill="#00f0ff" stroke="#0d1117" strokeWidth="1.5" />
                      <circle cx={xScale(i)} cy={yScale(d.gpuTemp)} r="3.5" fill="#ff3131" stroke="#0d1117" strokeWidth="1.5" />
                    </g>
                  ))}

                  {/* X axis labels */}
                  {THERMAL_DATA.map((d, i) => (
                    <text
                      key={i}
                      x={xScale(i)} y={svgH - 8}
                      textAnchor="middle" fill="#484f58" fontSize="10" fontFamily="JetBrains Mono"
                    >
                      {d.time}
                    </text>
                  ))}

                  {/* Max temp annotations */}
                  <text
                    x={xScale(THERMAL_DATA.length - 1) + 2}
                    y={yScale(maxCpu) - 8}
                    fill="#00f0ff" fontSize="10" fontFamily="JetBrains Mono" fontWeight="700"
                  >
                    {maxCpu}°C
                  </text>
                  <text
                    x={xScale(THERMAL_DATA.length - 1) + 2}
                    y={yScale(maxGpu) + 14}
                    fill="#ff3131" fontSize="10" fontFamily="JetBrains Mono" fontWeight="700"
                  >
                    {maxGpu}°C
                  </text>
                </svg>
              )
            })()}
          </div>

          {/* Thermal Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'CPU Idle', value: `${THERMAL_DATA[0].cpuTemp}°C`, color: 'text-neon', sub: 'Ambient load' },
              { label: 'GPU Idle', value: `${THERMAL_DATA[0].gpuTemp}°C`, color: 'text-neon-red', sub: 'Ambient load' },
              { label: 'CPU Max', value: `${Math.max(...THERMAL_DATA.map(d => d.cpuTemp))}°C`, color: 'text-neon', sub: '30 min stress' },
              { label: 'GPU Max', value: `${Math.max(...THERMAL_DATA.map(d => d.gpuTemp))}°C`, color: 'text-neon-red', sub: '30 min stress' },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-light border border-border rounded-lg p-4 text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono mb-1">{stat.label}</p>
                <p className={`text-xl font-display font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-gray-600 font-mono mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Thermal Verdict */}
          <div className="bg-neon-green/5 border border-neon-green/20 rounded-xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-neon-green/15 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-neon-green text-sm">✓</span>
            </div>
            <div>
              <p className="text-sm text-neon-green font-display font-bold tracking-wide">Thermals Within Safe Range</p>
              <p className="text-xs text-gray-400 font-mono mt-1">
                Peak temperatures stay well below the 85°C throttle threshold.
                Your cooling solution is adequate for sustained workloads.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
