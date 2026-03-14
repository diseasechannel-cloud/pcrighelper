// Данные маркетплейса для прототипа UpgradePC.ru

export const MARKET_LISTINGS = [
  {
    id: 'lot-1',
    title: 'Dell OptiPlex 7050 SFF',
    platform: 'Avito',
    price: 9500,
    specs: { cpu: 'i5-7500', ram: '8GB DDR4', storage: '256GB SSD', gpu: 'Intel HD 630' },
    goodBones: 82,
    upgradeROI: 35,
    upgradePath: 'Добавить GTX 1660 LP → продать за 25 500₽',
    image: null,
    location: 'Москва',
    daysListed: 3,
  },
  {
    id: 'lot-2',
    title: 'HP EliteDesk 800 G3',
    platform: 'Avito',
    price: 7600,
    specs: { cpu: 'i7-7700', ram: '16GB DDR4', storage: '512GB SSD', gpu: 'Intel HD 630' },
    goodBones: 91,
    upgradeROI: 48,
    upgradePath: 'Добавить RX 6400 LP → продать за 30 000₽',
    image: null,
    location: 'Санкт-Петербург',
    daysListed: 1,
  },
  {
    id: 'lot-3',
    title: 'Сборка на Xeon E5-2678 v3',
    platform: 'Avito',
    price: 14400,
    specs: { cpu: 'Xeon E5-2678 v3', ram: '32GB DDR4 ECC', storage: '500GB HDD', gpu: 'GTX 750 Ti' },
    goodBones: 68,
    upgradeROI: 22,
    upgradePath: 'Добавить SSD + GTX 1060 → продать за 28 000₽',
    image: null,
    location: 'Екатеринбург',
    daysListed: 5,
  },
  {
    id: 'lot-4',
    title: 'Lenovo ThinkCentre M900',
    platform: 'Youla',
    price: 6000,
    specs: { cpu: 'i5-6500', ram: '8GB DDR4', storage: '500GB HDD', gpu: 'Intel HD 530' },
    goodBones: 74,
    upgradeROI: 40,
    upgradePath: 'Добавить SSD + GTX 1650 LP → продать за 22 000₽',
    image: null,
    location: 'Новосибирск',
    daysListed: 2,
  },
  {
    id: 'lot-5',
    title: 'Игровой ПК — GTX 1070 + i7-6700',
    platform: 'OLX',
    price: 22400,
    specs: { cpu: 'i7-6700', ram: '16GB DDR4', storage: '1TB SSD', gpu: 'GTX 1070 8GB' },
    goodBones: 85,
    upgradeROI: 18,
    upgradePath: 'Чистка + новые вентиляторы → продать за 33 500₽',
    image: null,
    location: 'Казань',
    daysListed: 4,
  },
]

export const FLIP_NICHES = [
  { name: 'Бюджетный гейминг (8 000–24 000₽)', demand: 90, supply: 75, opportunity: 85 },
  { name: 'Офисный апгрейд (4 000–12 000₽)', demand: 70, supply: 90, opportunity: 45 },
  { name: 'Стриминг-сетап (24 000–48 000₽)', demand: 65, supply: 40, opportunity: 78 },
  { name: 'Рабочая станция (40 000–120 000₽)', demand: 45, supply: 25, opportunity: 82 },
  { name: 'Ретро-гейминг (6 400–16 000₽)', demand: 55, supply: 60, opportunity: 50 },
]

export const PRICING_TIERS = {
  consumer: [
    { name: 'Бесплатный', price: 0, features: ['Базовый скан ПК', '3 сравнения/мес', 'Бенчмарки сообщества'] },
    { name: 'Плюс', price: 399, features: ['Безлимитные сканы', 'ИИ-рекомендации апгрейда', 'Уведомления о ценах', 'Экспорт конфигов'] },
    { name: 'Про', price: 799, features: ['Всё из Плюс', 'Дашборд бенчмарков', 'Шеринг сборок', 'Приоритетная поддержка'] },
    { name: 'Ультимейт', price: 1199, features: ['Всё из Про', 'ИИ-ассистент в чате', 'Свои тесты', 'Ранний доступ'] },
  ],
  flipper: [
    { name: 'Флиппер', price: 2299, features: ['Сканер рынка', '5 объявлений/мес', 'Базовые ИИ-описания', 'Калькулятор ROI'] },
    { name: 'Флиппер Про', price: 4699, features: ['Безлимит объявлений', 'Мультиплатформ-публикация', 'ИИ-улучшение фото', 'Аналитика рынка', 'Приоритетный парсинг'] },
    { name: 'Бизнес', price: '3%', commission: true, features: ['Комиссия за продажу', 'ИИ-агент (поиск + листинг)', 'Авто-публикация на все площадки', 'Полная аналитика', 'Выделенная поддержка'], unlockRule: '1 месяц Про или 2 месяца Флиппер' },
  ],
}

export const XEON_SWAPS = [
  { xeon: 'Xeon E5-2678 v3', socket: 'LGA2011-3', board: 'Huananzhi X99-TF', ramType: 'DDR4 ECC', totalCost: 6800, perfScore: 72, notes: '12C/24T, отлично для рабочих станций' },
  { xeon: 'Xeon E5-2680 v4', socket: 'LGA2011-3', board: 'Machinist X99-RS9', ramType: 'DDR4 ECC', totalCost: 7600, perfScore: 78, notes: '14C/28T, лучший выбор для рендера' },
  { xeon: 'Xeon E5-2670 v2', socket: 'LGA2011', board: 'Huananzhi X79-M Plus', ramType: 'DDR3 ECC', totalCost: 4400, perfScore: 58, notes: '10C/20T, старый, но очень дешёвый' },
  { xeon: 'Xeon X5460', socket: 'LGA771→775 мод', board: 'Любая LGA775 плата', ramType: 'DDR2/DDR3', totalCost: 1200, perfScore: 28, notes: 'Классический мод, ещё тянет базовые задачи' },
  { xeon: 'Xeon E3-1240 v3', socket: 'LGA1150', board: 'Любая H81/B85/H97', ramType: 'DDR3', totalCost: 3200, perfScore: 48, notes: 'Аналог i7-4770 без встроенной графики' },
]
