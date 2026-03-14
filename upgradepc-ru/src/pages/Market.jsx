import { useState } from 'react'
import { MARKET_LISTINGS, FLIP_NICHES } from '../data/market.js'

const PLATFORM_COLORS = {
  'eBay': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'FB Marketplace': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Avito': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'OLX': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Youla': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
}

function getScoreColor(score) {
  if (score > 80) return 'text-neon-green'
  if (score >= 60) return 'text-neon-yellow'
  return 'text-neon-red'
}

function getScoreBg(score) {
  if (score > 80) return 'bg-neon-green/20 border-neon-green/40'
  if (score >= 60) return 'bg-neon-yellow/20 border-neon-yellow/40'
  return 'bg-neon-red/20 border-neon-red/40'
}

export default function Market() {
  const [autoScan, setAutoScan] = useState(false)
  const [platformFilter, setPlatformFilter] = useState('All')
  const [sortBy, setSortBy] = useState('roi')
  const [buyPrice, setBuyPrice] = useState('')
  const [upgradeCost, setUpgradeCost] = useState('')
  const [sellPrice, setSellPrice] = useState('')

  const sortedNiches = [...FLIP_NICHES].sort((a, b) => b.opportunity - a.opportunity)

  const platforms = ['All', ...new Set(MARKET_LISTINGS.map((l) => l.platform))]

  const filteredListings = MARKET_LISTINGS
    .filter((l) => platformFilter === 'All' || l.platform === platformFilter)
    .sort((a, b) => {
      if (sortBy === 'roi') return b.upgradeROI - a.upgradeROI
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'bones') return b.goodBones - a.goodBones
      if (sortBy === 'days') return a.daysListed - b.daysListed
      return 0
    })

  const profit = sellPrice && buyPrice ? Number(sellPrice) - Number(buyPrice) - Number(upgradeCost || 0) : null
  const roi = profit !== null && Number(buyPrice) + Number(upgradeCost || 0) > 0
    ? ((profit / (Number(buyPrice) + Number(upgradeCost || 0))) * 100).toFixed(1)
    : null

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold neon-text tracking-wide">
          ОптиФайндер — Радар рынка
        </h1>
        <p className="text-gray-400 mt-1 font-mono text-sm">
          Сканируем маркетплейсы в поисках недооценённых ПК с потенциалом перепродажи
        </p>
      </div>

      {/* Niche Scanner */}
      <section className="bg-surface border border-border rounded-xl p-6">
        <h2 className="font-display text-lg text-neon mb-4 tracking-wide">Сканер ниш</h2>
        <div className="space-y-3">
          {sortedNiches.map((niche) => (
            <div key={niche.name} className="flex items-center gap-4">
              <span className="text-sm text-gray-300 font-mono w-56 shrink-0 truncate">
                {niche.name}
              </span>

              {/* Demand / Supply bars */}
              <div className="flex-1 flex items-center gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-cyan-400 uppercase tracking-wider w-14">Спрос</span>
                    <div className="flex-1 h-2 bg-surface-lighter rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neon rounded-full transition-all"
                        style={{ width: `${niche.demand}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-500 w-8 text-right">{niche.demand}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider w-14">Предложение</span>
                    <div className="flex-1 h-2 bg-surface-lighter rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-600 rounded-full transition-all"
                        style={{ width: `${niche.supply}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-500 w-8 text-right">{niche.supply}</span>
                  </div>
                </div>
              </div>

              {/* Opportunity Badge */}
              <span
                className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full border ${getScoreBg(niche.opportunity)} ${getScoreColor(niche.opportunity)}`}
              >
                {niche.opportunity}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Auto-Scan Toggle + Filters */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Auto-Scan */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            className={`relative w-12 h-6 rounded-full transition-colors ${
              autoScan ? 'bg-neon/30 border border-neon/60' : 'bg-surface-lighter border border-border'
            }`}
            onClick={() => setAutoScan(!autoScan)}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
                autoScan ? 'left-6 bg-neon shadow-[0_0_8px_rgba(0,240,255,0.6)]' : 'left-0.5 bg-gray-500'
              }`}
            />
          </div>
          <div>
            <span className="text-sm text-gray-200 font-display">Авто-сканирование</span>
            <span className="text-xs text-gray-500 ml-2 font-mono">
              сканировать площадки каждые 15 мин
            </span>
          </div>
        </label>

        <div className="ml-auto flex items-center gap-3">
          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-surface-light border border-border rounded-lg px-3 py-1.5 text-sm text-gray-300 font-mono focus:border-neon/50 focus:outline-none"
          >
            {platforms.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-surface-light border border-border rounded-lg px-3 py-1.5 text-sm text-gray-300 font-mono focus:border-neon/50 focus:outline-none"
          >
            <option value="roi">Сорт: ROI</option>
            <option value="price">Сорт: Цена</option>
            <option value="bones">Сорт: Кач-во базы</option>
            <option value="days">Сорт: Дней в листинге</option>
          </select>
        </div>
      </div>

      {/* Listing Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-surface border border-border rounded-xl p-5 hover:border-neon/30 transition-colors group"
          >
            {/* Header: title + platform */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-display text-sm text-gray-100 font-semibold leading-tight">
                {listing.title}
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${
                  PLATFORM_COLORS[listing.platform] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}
              >
                {listing.platform}
              </span>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold font-mono text-neon mb-3">
              {listing.price.toLocaleString('ru-RU')}&nbsp;₽
            </div>

            {/* Specs */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-surface-lighter rounded-lg px-2 py-1.5 text-center">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">CPU</div>
                <div className="text-xs font-mono text-gray-300 truncate">{listing.specs.cpu}</div>
              </div>
              <div className="bg-surface-lighter rounded-lg px-2 py-1.5 text-center">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">GPU</div>
                <div className="text-xs font-mono text-gray-300 truncate">{listing.specs.gpu}</div>
              </div>
              <div className="bg-surface-lighter rounded-lg px-2 py-1.5 text-center">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">RAM</div>
                <div className="text-xs font-mono text-gray-300 truncate">{listing.specs.ram}</div>
              </div>
            </div>

            {/* Good Bones + ROI row */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${getScoreBg(listing.goodBones)}`}
              >
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Кач-во базы</span>
                <span className={`text-sm font-bold font-mono ${getScoreColor(listing.goodBones)}`}>
                  {listing.goodBones}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-neon-green">
                +{listing.upgradeROI}% ROI
              </div>
            </div>

            {/* Upgrade Path */}
            <div className="bg-neon-green/5 border border-neon-green/20 rounded-lg px-3 py-2 mb-3">
              <span className="text-[10px] text-neon-green uppercase tracking-wider">Путь апгрейда</span>
              <div className="text-sm font-mono text-gray-300 mt-0.5">{listing.upgradePath}</div>
            </div>

            {/* Location + Days */}
            <div className="flex items-center justify-between text-xs text-gray-500 font-mono mb-4">
              <span>{listing.location}</span>
              <span>{listing.daysListed}д в листинге</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 bg-neon/10 text-neon border border-neon/30 rounded-lg py-2 text-sm font-display tracking-wide hover:bg-neon/20 hover:neon-glow transition-all">
                Анализ
              </button>
              <button className="flex-1 bg-surface-lighter text-gray-300 border border-border rounded-lg py-2 text-sm font-display tracking-wide hover:border-neon-yellow/40 hover:text-neon-yellow transition-all">
                Отслеживать
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Profit Calculator */}
      <section className="bg-surface border border-border rounded-xl p-6">
        <h2 className="font-display text-lg text-neon mb-4 tracking-wide">Калькулятор прибыли</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-mono uppercase tracking-wider">Цена покупки</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">₽</span>
              <input
                type="number"
                min="0"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="0"
                className="bg-surface-light border border-border rounded-lg pl-7 pr-3 py-2 w-32 text-sm font-mono text-gray-200 focus:border-neon/50 focus:outline-none"
              />
            </div>
          </div>

          <span className="text-gray-600 text-lg pb-2">+</span>

          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-mono uppercase tracking-wider">Стоимость апгрейда</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">₽</span>
              <input
                type="number"
                min="0"
                value={upgradeCost}
                onChange={(e) => setUpgradeCost(e.target.value)}
                placeholder="0"
                className="bg-surface-light border border-border rounded-lg pl-7 pr-3 py-2 w-32 text-sm font-mono text-gray-200 focus:border-neon/50 focus:outline-none"
              />
            </div>
          </div>

          <span className="text-gray-600 text-lg pb-2">=</span>

          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-mono uppercase tracking-wider">Цена продажи</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">₽</span>
              <input
                type="number"
                min="0"
                value={sellPrice}
                onChange={(e) => setSellPrice(e.target.value)}
                placeholder="0"
                className="bg-surface-light border border-border rounded-lg pl-7 pr-3 py-2 w-32 text-sm font-mono text-gray-200 focus:border-neon/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex items-center gap-6 ml-4 pb-0.5">
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Прибыль</div>
              <div
                className={`text-xl font-bold font-mono ${
                  profit === null ? 'text-gray-600' : profit >= 0 ? 'text-neon-green' : 'text-neon-red'
                }`}
              >
                {profit === null ? '—' : `${profit >= 0 ? '+' : ''}${profit.toLocaleString('ru-RU')}\u00A0₽`}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">ROI</div>
              <div
                className={`text-xl font-bold font-mono ${
                  roi === null ? 'text-gray-600' : Number(roi) >= 0 ? 'text-neon-green' : 'text-neon-red'
                }`}
              >
                {roi === null ? '—' : `${roi}%`}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
