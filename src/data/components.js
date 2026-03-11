// Mock component database for UpgradeRig.com prototype

export const CPUS = [
  { id: 'cpu-1', name: 'AMD Ryzen 5 5600X', brand: 'AMD', cores: 6, threads: 12, baseClock: 3.7, boostClock: 4.6, tdp: 65, price: 159, rating: 92, socket: 'AM4', image: null },
  { id: 'cpu-2', name: 'Intel Core i5-12400F', brand: 'Intel', cores: 6, threads: 12, baseClock: 2.5, boostClock: 4.4, tdp: 65, price: 149, rating: 88, socket: 'LGA1700', image: null },
  { id: 'cpu-3', name: 'AMD Ryzen 7 5800X', brand: 'AMD', cores: 8, threads: 16, baseClock: 3.8, boostClock: 4.7, tdp: 105, price: 229, rating: 90, socket: 'AM4', image: null },
  { id: 'cpu-4', name: 'Intel Core i7-12700K', brand: 'Intel', cores: 12, threads: 20, baseClock: 3.6, boostClock: 5.0, tdp: 125, price: 309, rating: 93, socket: 'LGA1700', image: null },
  { id: 'cpu-5', name: 'AMD Ryzen 9 5900X', brand: 'AMD', cores: 12, threads: 24, baseClock: 3.7, boostClock: 4.8, tdp: 105, price: 349, rating: 95, socket: 'AM4', image: null },
  { id: 'cpu-6', name: 'Xeon E5-2678 v3', brand: 'Intel', cores: 12, threads: 24, baseClock: 2.5, boostClock: 3.3, tdp: 120, price: 35, rating: 72, socket: 'LGA2011-3', legacy: true, image: null },
  { id: 'cpu-7', name: 'Xeon E5-2680 v4', brand: 'Intel', cores: 14, threads: 28, baseClock: 2.4, boostClock: 3.3, tdp: 120, price: 45, rating: 74, socket: 'LGA2011-3', legacy: true, image: null },
  { id: 'cpu-8', name: 'Intel Core i5-4590', brand: 'Intel', cores: 4, threads: 4, baseClock: 3.3, boostClock: 3.7, tdp: 84, price: 20, rating: 55, socket: 'LGA1150', legacy: true, image: null },
]

export const GPUS = [
  { id: 'gpu-1', name: 'NVIDIA RTX 3060 12GB', brand: 'NVIDIA', vram: 12, tdp: 170, price: 279, rating: 85, image: null },
  { id: 'gpu-2', name: 'NVIDIA RTX 3070 Ti', brand: 'NVIDIA', vram: 8, tdp: 290, price: 449, rating: 91, image: null },
  { id: 'gpu-3', name: 'AMD RX 6800', brand: 'AMD', vram: 16, tdp: 250, price: 399, rating: 89, image: null },
  { id: 'gpu-4', name: 'NVIDIA RTX 4060', brand: 'NVIDIA', vram: 8, tdp: 115, price: 299, rating: 87, image: null },
  { id: 'gpu-5', name: 'AMD RX 6600 XT', brand: 'AMD', vram: 8, tdp: 160, price: 229, rating: 82, image: null },
  { id: 'gpu-6', name: 'NVIDIA GTX 1660 Super', brand: 'NVIDIA', vram: 6, tdp: 125, price: 149, rating: 75, image: null, used: true },
  { id: 'gpu-7', name: 'NVIDIA GTX 1060 3GB', brand: 'NVIDIA', vram: 3, tdp: 120, price: 65, rating: 58, legacy: true, image: null },
  { id: 'gpu-8', name: 'AMD RX 580 8GB', brand: 'AMD', vram: 8, tdp: 185, price: 55, rating: 60, legacy: true, image: null },
]

export const RAM = [
  { id: 'ram-1', name: 'Corsair Vengeance 16GB DDR4-3200', brand: 'Corsair', capacity: 16, speed: 3200, type: 'DDR4', price: 45, rating: 88 },
  { id: 'ram-2', name: 'G.Skill Ripjaws V 32GB DDR4-3600', brand: 'G.Skill', capacity: 32, speed: 3600, type: 'DDR4', price: 75, rating: 92 },
  { id: 'ram-3', name: 'Kingston Fury 16GB DDR5-5600', brand: 'Kingston', capacity: 16, speed: 5600, type: 'DDR5', price: 65, rating: 85 },
  { id: 'ram-4', name: 'Samsung 16GB DDR3-1600 ECC', brand: 'Samsung', capacity: 16, speed: 1600, type: 'DDR3', price: 12, rating: 65, legacy: true },
]

export const STORAGE = [
  { id: 'sto-1', name: 'Samsung 970 EVO Plus 1TB', brand: 'Samsung', capacity: 1000, type: 'NVMe', price: 79, rating: 95 },
  { id: 'sto-2', name: 'WD Blue SN570 500GB', brand: 'WD', capacity: 500, type: 'NVMe', price: 39, rating: 82 },
  { id: 'sto-3', name: 'Kingston A400 480GB', brand: 'Kingston', capacity: 480, type: 'SATA SSD', price: 29, rating: 72 },
  { id: 'sto-4', name: 'Seagate Barracuda 2TB', brand: 'Seagate', capacity: 2000, type: 'HDD', price: 49, rating: 68 },
]

export const PSU = [
  { id: 'psu-1', name: 'Corsair RM750x', brand: 'Corsair', wattage: 750, efficiency: '80+ Gold', price: 99, rating: 94 },
  { id: 'psu-2', name: 'EVGA SuperNOVA 650 G6', brand: 'EVGA', wattage: 650, efficiency: '80+ Gold', price: 79, rating: 90 },
  { id: 'psu-3', name: 'Thermaltake Smart 500W', brand: 'Thermaltake', wattage: 500, efficiency: '80+ White', price: 39, rating: 65 },
]

export const CASES = [
  { id: 'case-1', name: 'NZXT H510', brand: 'NZXT', formFactor: 'ATX', price: 69, rating: 85 },
  { id: 'case-2', name: 'Corsair 4000D Airflow', brand: 'Corsair', formFactor: 'ATX', price: 89, rating: 92 },
  { id: 'case-3', name: 'Dell OptiPlex SFF', brand: 'Dell', formFactor: 'SFF', price: 25, rating: 55, used: true },
]

export const COMPONENT_CATEGORIES = [
  { key: 'cpu', label: 'CPU', icon: '⚡' },
  { key: 'gpu', label: 'GPU', icon: '🎮' },
  { key: 'ram', label: 'RAM', icon: '📊' },
  { key: 'storage', label: 'Storage', icon: '💾' },
  { key: 'psu', label: 'PSU', icon: '🔌' },
  { key: 'case', label: 'Case', icon: '🖥️' },
]

// Sample current rig for Rig Scan demo
export const SAMPLE_RIG = {
  cpu: { name: 'Intel Core i5-4590', score: 45, status: 'bottleneck' },
  gpu: { name: 'NVIDIA GTX 1060 3GB', score: 52, status: 'weak' },
  ram: { name: '8GB DDR3 1600MHz', score: 30, status: 'bottleneck' },
  storage: { name: 'Seagate 1TB HDD', score: 25, status: 'bottleneck' },
  psu: { name: 'Generic 450W', score: 40, status: 'ok' },
  balanceIndex: 38,
}

export const UPGRADE_PATHS = [
  {
    tier: 'Basic',
    label: 'Quick Fix',
    price: 80,
    description: 'Fix the worst bottleneck',
    changes: [{ component: 'RAM', from: '8GB DDR3', to: '16GB DDR3', gain: '+25% multitask' }],
    perfGain: 18,
  },
  {
    tier: 'Sweet Spot',
    label: 'Balanced Upgrade',
    price: 320,
    description: 'Best price-to-performance',
    changes: [
      { component: 'GPU', from: 'GTX 1060 3GB', to: 'GTX 1660 Super 6GB', gain: '+75% FPS' },
      { component: 'RAM', from: '8GB DDR3', to: '16GB DDR3', gain: '+25% multitask' },
      { component: 'Storage', from: '1TB HDD', to: '480GB SSD', gain: '+300% boot' },
    ],
    perfGain: 65,
  },
  {
    tier: 'New Build',
    label: 'Start Fresh',
    price: 900,
    description: 'Sell current rig, build new',
    changes: [
      { component: 'CPU', from: 'i5-4590', to: 'Ryzen 5 5600X', gain: '+180% CPU' },
      { component: 'GPU', from: 'GTX 1060 3GB', to: 'RTX 3060 12GB', gain: '+150% FPS' },
      { component: 'RAM', from: '8GB DDR3', to: '16GB DDR4 3200', gain: '+120%' },
      { component: 'Storage', from: '1TB HDD', to: '1TB NVMe', gain: '+500%' },
    ],
    perfGain: 210,
    sellCurrent: 150,
  },
]
