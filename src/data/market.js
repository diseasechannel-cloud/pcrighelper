// Mock market/flip data for UpgradeRig.com prototype

export const MARKET_LISTINGS = [
  {
    id: 'lot-1',
    title: 'Dell OptiPlex 7050 SFF',
    platform: 'eBay',
    price: 120,
    specs: { cpu: 'i5-7500', ram: '8GB DDR4', storage: '256GB SSD', gpu: 'Intel HD 630' },
    goodBones: 82,
    upgradeROI: 35,
    upgradePath: 'Add GTX 1660 LP → sell $320',
    image: null,
    location: 'Dallas, TX',
    daysListed: 3,
  },
  {
    id: 'lot-2',
    title: 'HP EliteDesk 800 G3',
    platform: 'FB Marketplace',
    price: 95,
    specs: { cpu: 'i7-7700', ram: '16GB DDR4', storage: '512GB SSD', gpu: 'Intel HD 630' },
    goodBones: 91,
    upgradeROI: 48,
    upgradePath: 'Add RX 6400 LP → sell $380',
    image: null,
    location: 'Phoenix, AZ',
    daysListed: 1,
  },
  {
    id: 'lot-3',
    title: 'Custom Build - Xeon E5-2678 v3',
    platform: 'Avito',
    price: 180,
    specs: { cpu: 'Xeon E5-2678 v3', ram: '32GB DDR4 ECC', storage: '500GB HDD', gpu: 'GTX 750 Ti' },
    goodBones: 68,
    upgradeROI: 22,
    upgradePath: 'Add SSD + GTX 1060 → sell $350',
    image: null,
    location: 'Moscow, RU',
    daysListed: 5,
  },
  {
    id: 'lot-4',
    title: 'Lenovo ThinkCentre M900',
    platform: 'Craigslist',
    price: 75,
    specs: { cpu: 'i5-6500', ram: '8GB DDR4', storage: '500GB HDD', gpu: 'Intel HD 530' },
    goodBones: 74,
    upgradeROI: 40,
    upgradePath: 'Add SSD + GTX 1650 LP → sell $280',
    image: null,
    location: 'Chicago, IL',
    daysListed: 2,
  },
  {
    id: 'lot-5',
    title: 'Gaming PC - GTX 1070 + i7-6700',
    platform: 'OfferUp',
    price: 280,
    specs: { cpu: 'i7-6700', ram: '16GB DDR4', storage: '1TB SSD', gpu: 'GTX 1070 8GB' },
    goodBones: 85,
    upgradeROI: 18,
    upgradePath: 'Clean up + new fans → sell $420',
    image: null,
    location: 'Seattle, WA',
    daysListed: 4,
  },
]

export const FLIP_NICHES = [
  { name: 'Budget Gaming ($100-300)', demand: 90, supply: 75, opportunity: 85 },
  { name: 'Office Refresh ($50-150)', demand: 70, supply: 90, opportunity: 45 },
  { name: 'Streaming Setup ($300-600)', demand: 65, supply: 40, opportunity: 78 },
  { name: 'Workstation ($500-1500)', demand: 45, supply: 25, opportunity: 82 },
  { name: 'Retro Gaming ($80-200)', demand: 55, supply: 60, opportunity: 50 },
]

export const PRICING_TIERS = {
  consumer: [
    { name: 'Free', price: 0, features: ['Basic rig scan', '3 comparisons/month', 'Community benchmarks'] },
    { name: 'Plus', price: 5, features: ['Unlimited scans', 'AI upgrade recommendations', 'Price alerts', 'Export configs'] },
    { name: 'Pro', price: 10, features: ['Everything in Plus', 'Benchmark dashboard', 'Build sharing', 'Priority support'] },
    { name: 'Ultimate', price: 15, features: ['Everything in Pro', 'AI assistant chat', 'Custom benchmark suites', 'Early access'] },
  ],
  flipper: [
    { name: 'Flipper', price: 29, features: ['Market scanner', '5 listings/month', 'Basic AI descriptions', 'ROI calculator'] },
    { name: 'Flipper Pro', price: 59, features: ['Unlimited listings', 'Multi-platform publish', 'AI photo enhancement', 'Market insights', 'Priority parsing'] },
    { name: 'Enterprise', price: '3%', commission: true, features: ['Commission per sale', 'AI agent (sourcing + listing)', 'Auto-publish all platforms', 'Full analytics', 'Dedicated support'], unlockRule: '1 month Pro or 2 months Flipper' },
  ],
}

export const XEON_SWAPS = [
  { xeon: 'Xeon E5-2678 v3', socket: 'LGA2011-3', board: 'Huananzhi X99-TF', ramType: 'DDR4 ECC', totalCost: 85, perfScore: 72, notes: '12C/24T, great for workstation builds' },
  { xeon: 'Xeon E5-2680 v4', socket: 'LGA2011-3', board: 'Machinist X99-RS9', ramType: 'DDR4 ECC', totalCost: 95, perfScore: 78, notes: '14C/28T, best value for rendering' },
  { xeon: 'Xeon E5-2670 v2', socket: 'LGA2011', board: 'Huananzhi X79-M Plus', ramType: 'DDR3 ECC', totalCost: 55, perfScore: 58, notes: '10C/20T, older but dirt cheap' },
  { xeon: 'Xeon X5460', socket: 'LGA771→775 mod', board: 'Any LGA775 board', ramType: 'DDR2/DDR3', totalCost: 15, perfScore: 28, notes: 'Classic mod, still works for basic tasks' },
  { xeon: 'Xeon E3-1240 v3', socket: 'LGA1150', board: 'Any H81/B85/H97', ramType: 'DDR3', totalCost: 40, perfScore: 48, notes: 'i7-4770 equivalent without iGPU' },
]
