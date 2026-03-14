import { useState } from "react";
import { PRICING_TIERS } from "../data/market.js";

/* ══════════════════════════════════════════════════════════════
   Flip Mode — Пайплайн, Тарифы, Листинг и Контекст ИИ
   ══════════════════════════════════════════════════════════════ */

const SUB_TABS = ["Тарифы", "Пайплайн", "Листинг", "Контекст ИИ"];

/* ──────────────────────── Pipeline Data ──────────────────────── */

const PIPELINE_STEPS = [
  { key: "survey", label: "Опрос" },
  { key: "photos", label: "Фото" },
  { key: "ai-assess", label: "ИИ-оценка" },
  { key: "variant", label: "Выбор варианта" },
  { key: "parts", label: "Поиск запчастей" },
  { key: "agent", label: "ИИ-агент" },
  { key: "guide", label: "Гайд по сборке" },
];

const EXISTING_COMPONENTS = [
  { id: 1, name: "Intel i5-7500", type: "Процессор", condition: "Хорошее", value: 2800 },
  { id: 2, name: "8 GB DDR4 2400", type: "ОЗУ", condition: "Хорошее", value: 960 },
  { id: 3, name: "256 GB SATA SSD", type: "Накопитель", condition: "Удовл.", value: 1200 },
  { id: 4, name: "Intel HD 630", type: "Видеокарта", condition: "Хорошее", value: 0 },
  { id: 5, name: "300W OEM БП", type: "БП", condition: "Удовл.", value: 400 },
];

const PIPELINE_STEP_CONTENT = {
  photos: {
    title: "Захват фото",
    desc: "Сделайте 6-8 фото системника: спереди, сзади, внутренности, порты, наклейки и повреждения. Наш ИИ автоматически определит компоненты.",
    mock: ["Фото передней панели: определён Dell OptiPlex 7050 SFF", "Фото внутренностей: i5-7500 + стоковый кулер обнаружены", "Задняя панель: 4x USB 3.0, DisplayPort, VGA подтверждены", "Скан наклейки: сервис-тег найден — характеристики подтверждены"],
  },
  "ai-assess": {
    title: "ИИ-оценка",
    desc: "Анализируем потенциал апгрейда, запас по температурам, ограничения БП и рыночный спрос на базовую конфигурацию.",
    mock: ["Оценка Good Bones: 82 / 100", "Запас по температурам: достаточный для LP-видеокарты", "Ограничение БП: 300 Вт — только низкопрофильные карты", "Рыночный спрос: ВЫСОКИЙ для бюджетного гейминга в этом корпусе", "Ожидаемая прибыль с флипа: 7 600–11 200₽"],
  },
  variant: {
    title: "Выбор варианта",
    desc: "Выберите путь сборки в зависимости от целевого покупателя. У каждого варианта свои затраты на запчасти и ожидаемая цена продажи.",
    mock: [
      { name: "Бюджетный геймер", cost: 5200, sell: 23600, parts: "GTX 1650 LP + 8 GB ОЗУ" },
      { name: "Офис Про", cost: 2400, sell: 17600, parts: "16 GB ОЗУ + NVMe SSD" },
      { name: "Стриминг-стартер", cost: 8800, sell: 30400, parts: "GTX 1660 LP + 16 GB + NVMe" },
    ],
  },
  parts: {
    title: "Поиск запчастей",
    desc: "ИИ сканирует маркетплейсы в вашем регионе в поиске самых дешёвых совместимых запчастей с оповещениями о наличии.",
    mock: [
      { part: "MSI GTX 1650 LP", source: "AliExpress", price: 3360, eta: "7 дней" },
      { part: "8 GB DDR4 2400 плашка", source: "Avito", price: 720, eta: "3 дня" },
      { part: "256 GB NVMe SSD", source: "Ozon", price: 1440, eta: "2 дня" },
    ],
  },
  agent: {
    title: "ИИ-агент",
    desc: "Автономный агент ведёт переговоры с продавцами, отслеживает доставку и уведомляет, когда все запчасти прибыли.",
    mock: ["Агент договорился о GTX 1650 LP: с 3 360₽ до 3 040₽", "Отслеживание отправки: 2 из 3 запчастей отправлены", "Синхронизация сроков: все запчасти прибудут к 18 марта", "Авто-оповещение настроено на снижение цены NVMe SSD"],
  },
  guide: {
    title: "Гайд по сборке",
    desc: "Пошаговая иллюстрированная инструкция по сборке, адаптированная под ваш конкретный системник и выбранный вариант.",
    mock: ["Шаг 1: Снимите OEM-кожух (2 винта Phillips)", "Шаг 2: Установите дополнительную ОЗУ в слот B2", "Шаг 3: Установите NVMe SSD в слот M.2 (если есть) или используйте SATA", "Шаг 4: Вставьте GTX 1650 LP в PCIe x16, подключите доп. питание при необходимости", "Шаг 5: Укладка кабелей и закрытие корпуса", "Шаг 6: Установите драйверы — запустите бенчмарк — сфотографируйте для объявления"],
  },
};

/* ──────────────────────── Listing Data ──────────────────────── */

const LISTING_STEPS = ["Генерация текста", "Улучшение фото", "Предпросмотр", "Публикация", "Статус"];

const TONE_OPTIONS = ["Естественный", "Технический", "Разговорный", "Премиум"];

const TONE_SAMPLES = {
  "Естественный": "Апгрейднутый Dell OptiPlex 7050 SFF с GTX 1650 LP, 16 ГБ ОЗУ и 256 ГБ SSD. Тянет популярные игры на 1080p средне-высоких. Чистый, протестированный, готов к работе.",
  "Технический": "Dell OptiPlex 7050 SFF | i5-7500 (4C/4T, 3.4 ГГц буст) | 16 ГБ DDR4-2400 | GTX 1650 LP 4 ГБ GDDR6 (TDP 75 Вт) | 256 ГБ SATA III SSD | Win 11 Pro активирован. Бенчмарки: 8 240 Time Spy, 62 FPS средн. Fortnite 1080p Medium.",
  "Разговорный": "Крутой маленький игровой ПК! Fortnite, Valorant, Minecraft — всё летает. Тихий, компактный, поместится куда угодно. С выделенной видеокартой и увеличенной ОЗУ. Пишите!",
  "Премиум": "Профессионально восстановленная компактная игровая рабочая станция. Корпус корпоративного класса Dell с тщательно подобранными апгрейдами: выделенная графика NVIDIA, расширенная память и твердотельный накопитель. Идеально для игр, создания контента или мощного домашнего офиса. Гарантия 30 дней.",
};

const PLATFORMS = [
  { name: "Avito", method: "API" },
  { name: "OLX", method: "Браузер" },
  { name: "Youla", method: "Браузер" },
  { name: "VK Маркет", method: "API" },
];

/* ──────────────────────── Context AI Data ──────────────────────── */

const QUICK_TEMPLATES = [
  "Игровая сборка для клиента с бюджетом 32 000₽, предпочитает AMD",
  "Аналитика рынка: xeon-флипы ещё прибыльны в Q1?",
  "Предпочтения бренда: клиент хочет всё Corsair",
];

const AI_MEMORY = [
  { id: 1, insight: "Клиент Алексей предпочитает NVIDIA GPU — избегает драйверов AMD", tag: "предпочтение", impact: "high", applied: 12 },
  { id: 2, insight: "Местный рынок: GTX 1650 LP быстрее всего продаётся до 20 800₽", tag: "рынок", impact: "high", applied: 34 },
  { id: 3, insight: "Постоянный покупатель: ДмитрийPC всегда хочет Xeon-рабочие станции", tag: "клиент", impact: "medium", applied: 8 },
  { id: 4, insight: "Доставка AliExpress в РФ в среднем 12 дней (не 7)", tag: "рынок", impact: "medium", applied: 19 },
  { id: 5, insight: "Объявления на Avito с «игровой» в заголовке получают 3x просмотров", tag: "рынок", impact: "high", applied: 27 },
  { id: 6, insight: "Клиент Сергей: потолок бюджета всегда 24 000₽, не предлагать дороже", tag: "клиент", impact: "low", applied: 5 },
];

const AI_MODULES = [
  { module: "Пайплайн — Опрос", data: "Предпочтения клиента, потолки бюджетов", color: "neon" },
  { module: "Пайплайн — Поиск запчастей", data: "Сроки доставки, предпочтения брендов, региональные цены", color: "neon-green" },
  { module: "Листинг — Генерация текста", data: "Тональные предпочтения, ключевые слова из рыночных данных", color: "neon-purple" },
  { module: "Листинг — Публикация", data: "Эффективность площадок по регионам, лучшее время публикации", color: "neon-yellow" },
];

/* ══════════════════════════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════════════════════════ */

/* ── Pricing Tab ─────────────────────────────────────────────── */

function PricingTab() {
  return (
    <div className="space-y-12">
      {/* Consumer Plans */}
      <div>
        <h3 className="mb-6 font-display text-lg font-bold tracking-wide text-neon">
          Тарифы пользователей
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING_TIERS.consumer.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col rounded-xl border border-border bg-surface-light p-5 transition-all duration-300 hover:border-neon/30 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]"
            >
              <h4 className="font-display text-base font-bold tracking-wide text-gray-100">
                {tier.name}
              </h4>
              <p className="mt-1 font-mono text-2xl font-bold text-neon">
                {tier.price === 0 ? "Бесплатно" : `${tier.price.toLocaleString('ru-RU')}\u00A0₽`}
                {tier.price !== 0 && (
                  <span className="text-xs font-normal text-gray-500">/мес</span>
                )}
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-neon-green" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="mt-5 w-full rounded-lg border border-neon/20 bg-neon/10 py-2 font-mono text-sm font-semibold text-neon transition-colors hover:bg-neon/20">
                {tier.price === 0 ? "Начать бесплатно" : "Подписаться"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Flipper Plans */}
      <div>
        <h3 className="mb-6 font-display text-lg font-bold tracking-wide text-neon-green">
          Тарифы флипперов
        </h3>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRICING_TIERS.flipper.map((tier) => {
            const isEnterprise = tier.commission;
            return (
              <div
                key={tier.name}
                className={`flex flex-col rounded-xl border p-5 transition-all duration-300 ${
                  isEnterprise
                    ? "border-neon-yellow/40 bg-gradient-to-br from-surface-light to-neon-yellow/5 shadow-[0_0_30px_rgba(255,230,0,0.08)]"
                    : "border-border bg-surface-light hover:border-neon-green/30 hover:shadow-[0_0_20px_rgba(57,255,20,0.1)]"
                }`}
              >
                {isEnterprise && (
                  <span className="mb-3 inline-flex self-start rounded-full border border-neon-yellow/30 bg-neon-yellow/10 px-3 py-1 font-mono text-[11px] font-semibold text-neon-yellow">
                    Разблокировка: {tier.unlockRule}
                  </span>
                )}
                <h4
                  className={`font-display text-base font-bold tracking-wide ${
                    isEnterprise ? "text-neon-yellow" : "text-gray-100"
                  }`}
                >
                  {tier.name}
                </h4>
                <p
                  className={`mt-1 font-mono text-2xl font-bold ${
                    isEnterprise ? "text-neon-yellow" : "text-neon-green"
                  }`}
                >
                  {tier.commission ? tier.price : `${tier.price.toLocaleString('ru-RU')}\u00A0₽`}
                  <span className="text-xs font-normal text-gray-500">
                    {tier.commission ? " за продажу" : "/мес"}
                  </span>
                </p>
                <ul className="mt-4 flex-1 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                      <span
                        className={`mt-1 inline-block size-1.5 shrink-0 rounded-full ${
                          isEnterprise ? "bg-neon-yellow" : "bg-neon-green"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-5 w-full rounded-lg border py-2 font-mono text-sm font-semibold transition-colors ${
                    isEnterprise
                      ? "border-neon-yellow/30 bg-neon-yellow/10 text-neon-yellow hover:bg-neon-yellow/20"
                      : "border-neon-green/20 bg-neon-green/10 text-neon-green hover:bg-neon-green/20"
                  }`}
                >
                  {isEnterprise ? "Подать заявку" : "Подписаться"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Pipeline Tab ────────────────────────────────────────────── */

function PipelineTab({ pipelineStep, setPipelineStep, budget, setBudget, conditionFilter, setConditionFilter, componentActions, setComponentActions }) {
  return (
    <div className="space-y-8">
      {/* Stepper */}
      <div className="flex flex-wrap items-center gap-2">
        {PIPELINE_STEPS.map((step, i) => (
          <button
            key={step.key}
            onClick={() => setPipelineStep(i)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs font-semibold transition-all ${
              pipelineStep === i
                ? "border-neon/40 bg-neon/15 text-neon shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                : pipelineStep > i
                ? "border-neon-green/30 bg-neon-green/10 text-neon-green"
                : "border-border bg-surface-lighter text-gray-500 hover:border-gray-500 hover:text-gray-300"
            }`}
          >
            <span
              className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold ${
                pipelineStep === i
                  ? "bg-neon text-surface"
                  : pipelineStep > i
                  ? "bg-neon-green text-surface"
                  : "bg-surface-lighter text-gray-500"
              }`}
            >
              {pipelineStep > i ? "\u2713" : i + 1}
            </span>
            {step.label}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-xl border border-border bg-surface-light p-6">
        {pipelineStep === 0 ? (
          <SurveyStep
            budget={budget}
            setBudget={setBudget}
            conditionFilter={conditionFilter}
            setConditionFilter={setConditionFilter}
            componentActions={componentActions}
            setComponentActions={setComponentActions}
          />
        ) : (
          <GenericPipelineStep stepKey={PIPELINE_STEPS[pipelineStep].key} />
        )}
      </div>
    </div>
  );
}

function SurveyStep({ budget, setBudget, conditionFilter, setConditionFilter, componentActions, setComponentActions }) {
  const CONDITIONS = ["Только новые", "Только б/у", "Микс"];

  return (
    <div className="space-y-8">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon">
        Опрос
      </h3>
      <p className="text-sm text-gray-400">
        Задайте параметры флипа: бюджет, предпочтения по состоянию и действия с существующими компонентами.
      </p>

      {/* Budget Slider */}
      <div>
        <label className="mb-2 block font-mono text-sm text-gray-300">
          Бюджет апгрейда:&nbsp;
          <span className="text-neon font-bold">{budget.toLocaleString('ru-RU')}&nbsp;₽</span>
        </label>
        <input
          type="range"
          min={4000}
          max={160000}
          step={800}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full max-w-md accent-[#00f0ff]"
        />
        <div className="mt-1 flex max-w-md justify-between font-mono text-[10px] text-gray-600">
          <span>4 000₽</span>
          <span>40 000₽</span>
          <span>80 000₽</span>
          <span>160 000₽</span>
        </div>
      </div>

      {/* Condition Filter */}
      <div>
        <label className="mb-2 block font-mono text-sm text-gray-300">
          Фильтр состояния
        </label>
        <div className="flex gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => setConditionFilter(c)}
              className={`rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition-all ${
                conditionFilter === c
                  ? "border-neon/40 bg-neon/15 text-neon"
                  : "border-border bg-surface-lighter text-gray-500 hover:text-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Existing Components Table */}
      <div>
        <h4 className="mb-3 font-mono text-sm font-semibold text-gray-300">
          Инвентарь существующих компонентов
        </h4>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-lighter">
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Компонент</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Тип</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Состояние</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Стоимость</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Действие</th>
              </tr>
            </thead>
            <tbody>
              {EXISTING_COMPONENTS.map((comp) => (
                <tr key={comp.id} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3 font-mono text-gray-200">{comp.name}</td>
                  <td className="px-4 py-3 text-gray-400">{comp.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        comp.condition === "Хорошее"
                          ? "bg-neon-green/10 text-neon-green"
                          : "bg-neon-yellow/10 text-neon-yellow"
                      }`}
                    >
                      {comp.condition}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-300">{comp.value.toLocaleString('ru-RU')}&nbsp;₽</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {["Установить", "Оставить", "Продать"].map((action) => (
                        <button
                          key={action}
                          onClick={() =>
                            setComponentActions((prev) => ({
                              ...prev,
                              [comp.id]: action,
                            }))
                          }
                          className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-semibold transition-all ${
                            componentActions[comp.id] === action
                              ? action === "Установить"
                                ? "border border-neon/40 bg-neon/15 text-neon"
                                : action === "Оставить"
                                ? "border border-neon-purple/40 bg-neon-purple/15 text-neon-purple"
                                : "border border-neon-yellow/40 bg-neon-yellow/15 text-neon-yellow"
                              : "border border-border bg-surface-lighter text-gray-500 hover:text-gray-300"
                          }`}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GenericPipelineStep({ stepKey }) {
  const data = PIPELINE_STEP_CONTENT[stepKey];
  if (!data) return null;

  return (
    <div className="space-y-5">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon">
        {data.title}
      </h3>
      <p className="text-sm text-gray-400">{data.desc}</p>

      {/* Variant cards */}
      {stepKey === "variant" && Array.isArray(data.mock) && typeof data.mock[0] === "object" && "cost" in data.mock[0] && (
        <div className="grid gap-4 sm:grid-cols-3">
          {data.mock.map((v) => (
            <div
              key={v.name}
              className="rounded-lg border border-border bg-surface-lighter p-4 transition-all hover:border-neon-green/30"
            >
              <h4 className="font-display text-sm font-bold text-gray-100">{v.name}</h4>
              <p className="mt-1 font-mono text-xs text-gray-500">{v.parts}</p>
              <div className="mt-3 flex items-center justify-between font-mono text-xs">
                <span className="text-neon-red">-{v.cost.toLocaleString('ru-RU')}&nbsp;₽</span>
                <span className="text-neon-green">+{v.sell.toLocaleString('ru-RU')}&nbsp;₽</span>
              </div>
              <p className="mt-1 text-right font-mono text-xs font-bold text-neon">
                ROI {Math.round(((v.sell - v.cost) / v.cost) * 100)}%
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Parts table */}
      {stepKey === "parts" && Array.isArray(data.mock) && typeof data.mock[0] === "object" && "source" in data.mock[0] && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-lighter">
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Запчасть</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Источник</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Цена</th>
                <th className="px-4 py-3 font-mono text-xs font-semibold text-gray-400">Срок</th>
              </tr>
            </thead>
            <tbody>
              {data.mock.map((p) => (
                <tr key={p.part} className="border-b border-border/50 last:border-0">
                  <td className="px-4 py-3 font-mono text-gray-200">{p.part}</td>
                  <td className="px-4 py-3 text-gray-400">{p.source}</td>
                  <td className="px-4 py-3 font-mono text-neon-green">{p.price.toLocaleString('ru-RU')}&nbsp;₽</td>
                  <td className="px-4 py-3 font-mono text-gray-500">{p.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generic list output for other steps */}
      {Array.isArray(data.mock) && typeof data.mock[0] === "string" && (
        <div className="space-y-2">
          {data.mock.map((line, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-surface-lighter px-4 py-3"
            >
              <span className="mt-0.5 font-mono text-xs text-neon-green">{">"}</span>
              <span className="font-mono text-sm text-gray-300">{line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Listing Tab ─────────────────────────────────────────────── */

function ListingTab({ listingStep, setListingStep, selectedTone, setSelectedTone, selectedPlatforms, setSelectedPlatforms }) {
  return (
    <div className="space-y-8">
      {/* Listing Steps */}
      <div className="flex flex-wrap gap-2">
        {LISTING_STEPS.map((step, i) => (
          <button
            key={step}
            onClick={() => setListingStep(i)}
            className={`rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition-all ${
              listingStep === i
                ? "border-neon-purple/40 bg-neon-purple/15 text-neon-purple shadow-[0_0_12px_rgba(191,90,242,0.15)]"
                : listingStep > i
                ? "border-neon-green/30 bg-neon-green/10 text-neon-green"
                : "border-border bg-surface-lighter text-gray-500 hover:text-gray-300"
            }`}
          >
            {listingStep > i ? "\u2713 " : `${i + 1}. `}
            {step}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface-light p-6">
        {listingStep === 0 && (
          <TextGenerationStep selectedTone={selectedTone} setSelectedTone={setSelectedTone} />
        )}
        {listingStep === 1 && <PhotoEnhancementStep />}
        {listingStep === 2 && <PreviewStep selectedTone={selectedTone} />}
        {listingStep === 3 && (
          <PublishStep
            selectedPlatforms={selectedPlatforms}
            setSelectedPlatforms={setSelectedPlatforms}
          />
        )}
        {listingStep === 4 && <StatusStep />}
      </div>
    </div>
  );
}

function TextGenerationStep({ selectedTone, setSelectedTone }) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon-purple">
        Генерация текста
      </h3>
      <p className="text-sm text-gray-400">
        Выберите тон описания. ИИ создаёт оптимизированный текст для площадок.
      </p>

      {/* Tone Selector */}
      <div className="flex flex-wrap gap-2">
        {TONE_OPTIONS.map((tone) => (
          <button
            key={tone}
            onClick={() => setSelectedTone(tone)}
            className={`rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition-all ${
              selectedTone === tone
                ? "border-neon-purple/40 bg-neon-purple/15 text-neon-purple"
                : "border-border bg-surface-lighter text-gray-500 hover:text-gray-300"
            }`}
          >
            {tone}
          </button>
        ))}
      </div>

      {/* Sample Output */}
      <div className="rounded-lg border border-neon-purple/20 bg-neon-purple/5 p-4">
        <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-neon-purple/70">
          Сгенерировано — {selectedTone}
        </p>
        <p className="font-mono text-sm leading-relaxed text-gray-300">
          {TONE_SAMPLES[selectedTone]}
        </p>
      </div>
    </div>
  );
}

function PhotoEnhancementStep() {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon-purple">
        Улучшение фото
      </h3>
      <p className="text-sm text-gray-400">
        ИИ обрабатывает фото: баланс белого, удаление фона, резкость и наложение водяного знака.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Before */}
        <div className="rounded-lg border border-border bg-surface-lighter p-4">
          <p className="mb-3 font-mono text-xs font-semibold text-gray-500">ДО</p>
          <div className="flex aspect-video items-center justify-center rounded-md bg-surface text-gray-600">
            <div className="text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-surface-lighter text-2xl">
                &#128247;
              </div>
              <p className="font-mono text-xs">Оригинал фото</p>
              <p className="font-mono text-[10px] text-gray-700">Плохой свет, захламлённый фон</p>
            </div>
          </div>
        </div>

        {/* After */}
        <div className="rounded-lg border border-neon-green/30 bg-neon-green/5 p-4">
          <p className="mb-3 font-mono text-xs font-semibold text-neon-green">ПОСЛЕ</p>
          <div className="flex aspect-video items-center justify-center rounded-md bg-surface text-gray-300">
            <div className="text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-neon-green/10 text-2xl">
                &#10024;
              </div>
              <p className="font-mono text-xs">Улучшенное фото</p>
              <p className="font-mono text-[10px] text-neon-green/70">Чистый фон, скорр. баланс белого</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhancement Score */}
      <div className="flex items-center gap-4 rounded-lg border border-border bg-surface-lighter px-4 py-3">
        <span className="font-mono text-sm text-gray-400">Оценка улучшения:</span>
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon"
              style={{ width: "87%" }}
            />
          </div>
        </div>
        <span className="font-mono text-sm font-bold text-neon-green">87%</span>
      </div>
    </div>
  );
}

function PreviewStep({ selectedTone }) {
  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon-purple">
        Предпросмотр
      </h3>
      <p className="text-sm text-gray-400">
        Проверьте объявление перед публикацией.
      </p>

      <div className="rounded-lg border border-border bg-surface-lighter p-5 space-y-4">
        <h4 className="font-display text-base font-bold text-gray-100">
          Dell OptiPlex 7050 SFF — Бюджетный игровой ПК с апгрейдом
        </h4>
        <div className="flex gap-2">
          <span className="rounded-full bg-neon-green/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon-green">
            GTX 1650 LP
          </span>
          <span className="rounded-full bg-neon/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon">
            16 GB ОЗУ
          </span>
          <span className="rounded-full bg-neon-purple/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-neon-purple">
            256 GB SSD
          </span>
        </div>
        <p className="font-mono text-sm leading-relaxed text-gray-400">
          {TONE_SAMPLES[selectedTone]}
        </p>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="font-mono text-lg font-bold text-neon-green">23 600&nbsp;₽</span>
          <span className="font-mono text-xs text-gray-500">5 фото прикреплено</span>
        </div>
      </div>
    </div>
  );
}

function PublishStep({ selectedPlatforms, setSelectedPlatforms }) {
  const togglePlatform = (name) => {
    setSelectedPlatforms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon-purple">
        Публикация
      </h3>
      <p className="text-sm text-gray-400">
        Выберите площадки для публикации. API-интеграции публикуют автоматически; браузерный режим открывает предзаполненную форму.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((platform) => {
          const selected = selectedPlatforms.includes(platform.name);
          return (
            <button
              key={platform.name}
              onClick={() => togglePlatform(platform.name)}
              className={`flex items-center justify-between rounded-lg border p-4 text-left transition-all ${
                selected
                  ? "border-neon-purple/40 bg-neon-purple/10"
                  : "border-border bg-surface-lighter hover:border-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-5 items-center justify-center rounded border text-xs transition-all ${
                    selected
                      ? "border-neon-purple bg-neon-purple text-surface font-bold"
                      : "border-gray-600 text-transparent"
                  }`}
                >
                  {selected ? "\u2713" : ""}
                </span>
                <span
                  className={`font-mono text-sm font-semibold ${
                    selected ? "text-neon-purple" : "text-gray-400"
                  }`}
                >
                  {platform.name}
                </span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                  platform.method === "API"
                    ? "bg-neon-green/10 text-neon-green"
                    : "bg-neon-yellow/10 text-neon-yellow"
                }`}
              >
                {platform.method}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatusStep() {
  const invested = 27700;
  const sell = 33500;
  const profit = sell - invested;
  const roi = Math.round((profit / invested) * 100);

  return (
    <div className="space-y-6">
      <h3 className="font-display text-lg font-bold tracking-wide text-neon-purple">
        Статус — Итоги P&L
      </h3>
      <p className="text-sm text-gray-400">
        Отслеживайте флип от вложения до прибыли.
      </p>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-surface-lighter p-4 text-center">
          <p className="font-mono text-[11px] text-gray-500">Вложено</p>
          <p className="mt-1 font-mono text-xl font-bold text-neon-red">{invested.toLocaleString('ru-RU')}&nbsp;₽</p>
        </div>
        <div className="rounded-lg border border-border bg-surface-lighter p-4 text-center">
          <p className="font-mono text-[11px] text-gray-500">Цена продажи</p>
          <p className="mt-1 font-mono text-xl font-bold text-neon">{sell.toLocaleString('ru-RU')}&nbsp;₽</p>
        </div>
        <div className="rounded-lg border border-neon-green/30 bg-neon-green/5 p-4 text-center">
          <p className="font-mono text-[11px] text-gray-500">Прибыль</p>
          <p className="mt-1 font-mono text-xl font-bold text-neon-green">{profit.toLocaleString('ru-RU')}&nbsp;₽</p>
        </div>
        <div className="rounded-lg border border-neon-yellow/30 bg-neon-yellow/5 p-4 text-center">
          <p className="font-mono text-[11px] text-gray-500">ROI</p>
          <p className="mt-1 font-mono text-xl font-bold text-neon-yellow">{roi}%</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        <h4 className="font-mono text-sm font-semibold text-gray-300">Хронология</h4>
        {[
          { date: "3 мар", event: "Куплен базовый системник", amount: "-9 600\u00A0₽", color: "neon-red" },
          { date: "5 мар", event: "Запчасти заказаны (GPU, ОЗУ, SSD)", amount: "-5 520\u00A0₽", color: "neon-red" },
          { date: "8 мар", event: "Все запчасти доставлены", amount: "", color: "neon" },
          { date: "9 мар", event: "Сборка завершена + бенчмарк", amount: "", color: "neon-green" },
          { date: "10 мар", event: "Размещено на 3 площадках", amount: "", color: "neon-purple" },
          { date: "12 мар", event: "Продано на Avito", amount: "+33 500\u00A0₽", color: "neon-green" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-border/50 bg-surface-lighter px-4 py-2.5">
            <span className="w-14 shrink-0 font-mono text-[11px] text-gray-500">{item.date}</span>
            <span className={`size-2 shrink-0 rounded-full bg-${item.color}`} />
            <span className="flex-1 font-mono text-sm text-gray-300">{item.event}</span>
            {item.amount && (
              <span
                className={`font-mono text-sm font-bold ${
                  item.amount.startsWith("+") ? "text-neon-green" : "text-neon-red"
                }`}
              >
                {item.amount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Context AI Tab ──────────────────────────────────────────── */

function ContextAITab({ contextInput, setContextInput }) {
  const [isRecording, setIsRecording] = useState(false);

  const TAG_COLORS = {
    "рынок": "bg-neon-green/10 text-neon-green",
    "предпочтение": "bg-neon-purple/10 text-neon-purple",
    "клиент": "bg-neon/10 text-neon",
  };

  const IMPACT_COLORS = {
    high: "text-neon-red",
    medium: "text-neon-yellow",
    low: "text-gray-500",
  };

  return (
    <div className="space-y-10">
      {/* Voice + Text Input */}
      <div className="space-y-5">
        <h3 className="font-display text-lg font-bold tracking-wide text-neon">
          Ввод контекста ИИ
        </h3>
        <p className="text-sm text-gray-400">
          Передавайте ИИ контекст о клиентах, наблюдениях за рынком и предпочтениях. Он обучается и применяет это во всех модулях.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          {/* Voice Button */}
          <button
            onClick={() => setIsRecording((prev) => !prev)}
            className={`flex items-center justify-center gap-2 rounded-xl border px-6 py-4 font-mono text-sm font-semibold transition-all sm:w-48 ${
              isRecording
                ? "border-neon-red/40 bg-neon-red/10 text-neon-red animate-pulse"
                : "border-neon/30 bg-neon/10 text-neon hover:bg-neon/20"
            }`}
          >
            <span className="text-xl">{isRecording ? "\u23F9" : "\u{1F3A4}"}</span>
            {isRecording ? "Остановить запись" : "Запись голоса"}
          </button>

          {/* Text Area */}
          <textarea
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            placeholder="Введите контекст... например, 'Клиент предпочитает ОЗУ Corsair, бюджет до 32 000₽, нужно к пятнице'"
            rows={3}
            className="flex-1 resize-none rounded-xl border border-border bg-surface-lighter px-4 py-3 font-mono text-sm text-gray-300 placeholder-gray-600 outline-none transition-all focus:border-neon/30"
          />
        </div>
      </div>

      {/* Quick Templates */}
      <div className="space-y-3">
        <h4 className="font-mono text-sm font-semibold text-gray-300">Быстрые шаблоны</h4>
        <div className="flex flex-wrap gap-2">
          {QUICK_TEMPLATES.map((tpl) => (
            <button
              key={tpl}
              onClick={() => setContextInput(tpl)}
              className="rounded-lg border border-border bg-surface-lighter px-3 py-2 font-mono text-xs text-gray-400 transition-all hover:border-neon/30 hover:text-gray-200"
            >
              {tpl}
            </button>
          ))}
        </div>
      </div>

      {/* AI Memory Bank */}
      <div className="space-y-4">
        <h4 className="font-display text-base font-bold tracking-wide text-neon">
          Банк памяти ИИ
        </h4>
        <div className="space-y-2">
          {AI_MEMORY.map((mem) => (
            <div
              key={mem.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface-lighter px-4 py-3"
            >
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${TAG_COLORS[mem.tag]}`}
              >
                {mem.tag}
              </span>
              <span className="flex-1 font-mono text-sm text-gray-300">{mem.insight}</span>
              <span
                className={`font-mono text-[11px] font-semibold ${IMPACT_COLORS[mem.impact]}`}
              >
                {mem.impact.toUpperCase()}
              </span>
              <span className="rounded-md bg-surface px-2 py-0.5 font-mono text-[10px] text-gray-500">
                {mem.applied}x применено
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* How It's Applied */}
      <div className="space-y-4">
        <h4 className="font-display text-base font-bold tracking-wide text-neon">
          Как применяется контекст
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {AI_MODULES.map((mod) => (
            <div
              key={mod.module}
              className={`rounded-lg border p-4 transition-all border-${mod.color}/20 bg-${mod.color}/5`}
            >
              <h5 className={`font-display text-sm font-bold tracking-wide text-${mod.color}`}>
                {mod.module}
              </h5>
              <p className="mt-2 font-mono text-xs leading-relaxed text-gray-400">
                Использует: {mod.data}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════ */

export default function FlipMode() {
  /* Sub-tab state */
  const [activeSubTab, setActiveSubTab] = useState("Тарифы");

  /* Pipeline state */
  const [pipelineStep, setPipelineStep] = useState(0);
  const [budget, setBudget] = useState(24000);
  const [conditionFilter, setConditionFilter] = useState("Микс");
  const [componentActions, setComponentActions] = useState({});

  /* Listing state */
  const [listingStep, setListingStep] = useState(0);
  const [selectedTone, setSelectedTone] = useState("Естественный");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["Avito"]);

  /* Context AI state */
  const [contextInput, setContextInput] = useState("");

  return (
    <div className="min-h-screen pb-20">
      {/* ───── Header ───── */}
      <section className="mb-8">
        <h1 className="neon-text font-display text-3xl font-bold tracking-widest text-neon sm:text-4xl">
          Флип-режим
        </h1>
        <p className="mt-2 max-w-2xl font-mono text-sm text-gray-400">
          Полный пайплайн флипа: поиск, сборка, листинг, продажа. На базе контекстного ИИ, который изучает ваш рынок.
        </p>
      </section>

      {/* ───── Sub-Tab Navigation ───── */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4">
        {SUB_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`rounded-lg border px-5 py-2.5 font-mono text-sm font-semibold transition-all ${
              activeSubTab === tab
                ? "border-neon/40 bg-neon/15 text-neon shadow-[0_0_16px_rgba(0,240,255,0.12)]"
                : "border-border bg-surface-light text-gray-500 hover:border-gray-500 hover:text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ───── Tab Content ───── */}
      {activeSubTab === "Тарифы" && <PricingTab />}

      {activeSubTab === "Пайплайн" && (
        <PipelineTab
          pipelineStep={pipelineStep}
          setPipelineStep={setPipelineStep}
          budget={budget}
          setBudget={setBudget}
          conditionFilter={conditionFilter}
          setConditionFilter={setConditionFilter}
          componentActions={componentActions}
          setComponentActions={setComponentActions}
        />
      )}

      {activeSubTab === "Листинг" && (
        <ListingTab
          listingStep={listingStep}
          setListingStep={setListingStep}
          selectedTone={selectedTone}
          setSelectedTone={setSelectedTone}
          selectedPlatforms={selectedPlatforms}
          setSelectedPlatforms={setSelectedPlatforms}
        />
      )}

      {activeSubTab === "Контекст ИИ" && (
        <ContextAITab contextInput={contextInput} setContextInput={setContextInput} />
      )}
    </div>
  );
}
