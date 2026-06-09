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
  /** Добавление в корзину (дублирует dataLayer `add_to_cart` для GTM). payload: `{ sku, slug, qtyKg, source }` */
  CartAdd: "add_to_cart",
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
  /** Отправка формы checkout. payload: `{ lines, ship }` */
  StartCheckout: "start_checkout",
  /** Успешное создание заявки на заказ. payload: `{ value, currency, sku, utm? }` */
  OrderSubmit: "purchase",
  /** Просмотр PDP. payload: `{ sku, slug, value?, currency? }` */
  ViewPdp: "view_pdp",
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
  [BTT_EVENTS.CartAdd]: {
    sku: string;
    slug: string;
    qtyKg: number;
    source: "catalog_card" | "pdp" | "catalog";
    value?: number;
    currency?: string;
  };
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
  [BTT_EVENTS.StartCheckout]: {
    lines?: string[];
    ship?: string;
    from?: string;
    sku?: string;
  };
  [BTT_EVENTS.OrderSubmit]: {
    value: number;
    currency: string;
    sku: string[];
    utm?: Record<string, string>;
  };
  [BTT_EVENTS.ViewPdp]: {
    sku: string;
    slug: string;
    value?: number;
    currency?: string;
  };
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

/** Пушит событие в `window.dataLayer` (GTM). См. `docs/analytics-funnel.md`. */
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

/** Google Consent Mode v2 — вызывается из CookieConsent после выбора пользователя. */
export function updateAnalyticsConsent(granted: boolean): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "consent_update",
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}
