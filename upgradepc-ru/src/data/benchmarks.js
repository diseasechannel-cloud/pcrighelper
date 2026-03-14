// Данные бенчмарков для прототипа UpgradePC.ru

export const BENCHMARK_GAMES = [
  { name: 'Cyberpunk 2077', fps1080p: 62, fps1440p: 45, fps4k: 28, genre: 'RPG' },
  { name: 'Fortnite', fps1080p: 144, fps1440p: 110, fps4k: 65, genre: 'Батл-рояль' },
  { name: 'GTA V', fps1080p: 95, fps1440p: 72, fps4k: 45, genre: 'Экшн' },
  { name: 'CS2', fps1080p: 220, fps1440p: 165, fps4k: 90, genre: 'Шутер' },
  { name: 'Elden Ring', fps1080p: 58, fps1440p: 42, fps4k: 25, genre: 'RPG' },
  { name: 'Valorant', fps1080p: 280, fps1440p: 210, fps4k: 130, genre: 'Шутер' },
  { name: 'RDR2', fps1080p: 55, fps1440p: 38, fps4k: 22, genre: 'Экшн' },
  { name: 'Minecraft RT', fps1080p: 85, fps1440p: 60, fps4k: 35, genre: 'Песочница' },
]

export const BENCHMARK_SCORES = {
  gaming: 78,
  productivity: 65,
  thermals: 72,
}

export const THERMAL_DATA = [
  { time: '0м', cpuTemp: 35, gpuTemp: 32 },
  { time: '5м', cpuTemp: 58, gpuTemp: 55 },
  { time: '10м', cpuTemp: 68, gpuTemp: 65 },
  { time: '15м', cpuTemp: 72, gpuTemp: 70 },
  { time: '20м', cpuTemp: 74, gpuTemp: 72 },
  { time: '30м', cpuTemp: 75, gpuTemp: 73 },
]

// Распределение очков — для box plot
export const SCORE_DISTRIBUTION = {
  gaming: [
    { percentile: 5, score: 25 },
    { percentile: 10, score: 35 },
    { percentile: 25, score: 52 },
    { percentile: 50, score: 68 },
    { percentile: 75, score: 82 },
    { percentile: 90, score: 91 },
    { percentile: 95, score: 96 },
  ],
  yourScore: 78,
}

// Данные для сравнения
export const COMPARE_GPUS = {
  'RTX 3070 Ti': {
    brand: 'NVIDIA',
    cores: 6144,
    baseClock: '1580 МГц',
    boostClock: '1770 МГц',
    vram: '8GB GDDR6X',
    tdp: 290,
    process: '8нм',
    price: 35700,
    gaming1080p: 92,
    gaming1440p: 85,
    gaming4k: 58,
    rayTracing: 78,
    productivity: 72,
    efficiency: 65,
  },
  'RX 6800': {
    brand: 'AMD',
    cores: 3840,
    baseClock: '1700 МГц',
    boostClock: '2105 МГц',
    vram: '16GB GDDR6',
    tdp: 250,
    process: '7нм',
    price: 31700,
    gaming1080p: 88,
    gaming1440p: 83,
    gaming4k: 55,
    rayTracing: 58,
    productivity: 68,
    efficiency: 78,
  },
}
