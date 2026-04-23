export type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: AnalyticsPayload[];
  }
}

/** UTM по умолчанию для кампаний из Instagram (можно переопределить query) */
export function readUtmFromSearch(search: string): Record<string, string> {
  const q = search.startsWith("?") ? search.slice(1) : search;
  const p = new URLSearchParams(q);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];
  const out: Record<string, string> = {};
  keys.forEach((k) => {
    const v = p.get(k);
    if (v) out[k.replace("utm_", "")] = v;
  });
  return out;
}

/**
 * Словарь имён событий воронки продаж. Использовать вместо сырых строк,
 * чтобы опечатки ловились TypeScript, а GTM-триггеры собирались по документации.
 *
 * Формат: snake_case с префиксом зоны (`hero_`, `segment_`, `catalog_`,
 * `card_`, `pdp_`, `help_widget_`, `lead_`).
 */
export const BTT_EVENTS = {
  /** Клик по CTA в hero-экране главной. payload: `{ cta: 'stock' | 'pick' }` */
  HeroCtaClick: "hero_cta_click",
  /** Клик по карточке сегментации на главной. payload: `{ segment }` */
  SegmentCardClick: "segment_card_click",
  /** Клик по карточке «Примеры использования». payload: `{ type }` */
  ExampleCardClick: "example_card_click",
  /** Клик по CTA «Коллективные заказы». payload: `{ source }` */
  CollectiveCtaClick: "collective_cta_click",
  /** Клик по пресету «Выберите по задаче» над каталогом. payload: `{ preset }` */
  CatalogUsecaseClick: "catalog_usecase_click",
  /** Изменение фильтра в каталоге. payload: `{ key, value }` */
  CatalogFilterApply: "catalog_filter_apply",
  /** Сброс фильтров. payload: `{ source?: 'sidebar' | 'active_chips' }` */
  CatalogFilterReset: "catalog_filter_reset",
  /** Изменение сортировки. payload: `{ mode }` */
  CatalogSortChange: "catalog_sort_change",
  /** Клик по «Подобрать материал» в карточке каталога. payload: `{ sku, slug }` */
  CardPickClick: "card_pick_click",
  /** Клик по каналу связи на странице товара. payload: `{ channel, sku? }` */
  PdpHelpClick: "pdp_help_click",
  /** Открыт/закрыт floating-widget помощи. payload: `{ state }` */
  HelpWidgetToggle: "help_widget_toggle",
  /** Клик по каналу в floating-widget. payload: `{ channel }` */
  HelpWidgetChannel: "help_widget_channel_click",
  /** Успешная отправка заявки через LeadForm. payload: `{ kind, source? }` */
  LeadSubmit: "lead_submit",
  /** Ошибка отправки заявки через LeadForm. payload: `{ kind, source?, reason }` */
  LeadError: "lead_error",
} as const;

export type BttEventName = (typeof BTT_EVENTS)[keyof typeof BTT_EVENTS];

/** Типизированные payload'ы по каждому событию из `BTT_EVENTS`. */
export type BttEventPayloads = {
  [BTT_EVENTS.HeroCtaClick]: { cta: "stock" | "pick" };
  [BTT_EVENTS.SegmentCardClick]: {
    segment: "master" | "production" | "pick";
  };
  [BTT_EVENTS.ExampleCardClick]: {
    type: "furniture" | "planter" | "chairs" | "decor";
  };
  [BTT_EVENTS.CollectiveCtaClick]: { source: string };
  [BTT_EVENTS.CatalogUsecaseClick]: {
    preset: "furniture" | "planter" | "universal";
  };
  [BTT_EVENTS.CatalogFilterApply]: { key: string; value: string };
  [BTT_EVENTS.CatalogFilterReset]: { source?: "sidebar" | "active_chips" };
  [BTT_EVENTS.CatalogSortChange]: { mode: string };
  [BTT_EVENTS.CardPickClick]: { sku: string; slug: string };
  [BTT_EVENTS.PdpHelpClick]: {
    channel: "phone" | "whatsapp" | "telegram";
    sku?: string;
  };
  [BTT_EVENTS.HelpWidgetToggle]: { state: "open" | "close" };
  [BTT_EVENTS.HelpWidgetChannel]: {
    channel: "phone" | "whatsapp" | "telegram";
  };
  [BTT_EVENTS.LeadSubmit]: { kind: string; source?: string };
  [BTT_EVENTS.LeadError]: { kind: string; source?: string; reason: string };
};

/**
 * Типобезопасная версия `trackEvent` для событий воронки (`BTT_EVENTS`).
 * Предпочтительно использовать её в новых местах — TypeScript проверит имя и payload.
 */
export function trackBttEvent<K extends BttEventName>(
  event: K,
  payload: BttEventPayloads[K],
): void {
  trackEvent(event, payload as AnalyticsPayload);
}

/**
 * Пушит событие в `window.dataLayer` (GTM).
 *
 * Квиз на главной (воронка):
 * - `quiz_start` — нажата кнопка входа в подбор
 * - `quiz_complete` — пройдены все шаги (`needQuote`, `recommendedCount` в payload)
 * - `quiz_result_view` — показ блока с SKU (если не ушли в заявку КП)
 * - `quiz_add_to_cart` — добавление из карточки подбора (`sku`, `kg`, …)
 * - `quiz_checkout` — переход по «1-клик» на оформление
 * - `quote_submit` — отправка лида из ветки КП
 *
 * CTR «подбор → корзина»: `quiz_add_to_cart` / `quiz_complete`, где `needQuote === false`
 * (в GTM — фильтр по полю в объекте dataLayer). Альтернатива: отношение к `quiz_result_view`.
 *
 * Воронка продаж (новые CTA): см. `BTT_EVENTS` и `trackBttEvent` — предпочтительный путь
 * для типобезопасного трекинга новых точек.
 *
 * Продакт-события PDP/корзины/чекаута (сохраняются без изменений):
 * - `view_pdp` — `{ sku, slug, value, currency }`
 * - `add_to_cart` — `{ sku, value, currency, qtyKg? }`
 * - `start_checkout` — `{ from, sku? }`
 */
export function trackEvent(
  event: string,
  payload?: AnalyticsPayload,
): void {
  const body = { event, ...payload, ts: Date.now() };
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(body);
    if (process.env.NODE_ENV === "development") {
      console.info("[analytics]", body);
    }
  }
}
