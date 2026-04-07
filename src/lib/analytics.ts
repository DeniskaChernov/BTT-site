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

export function trackEvent(
  event: string,
  payload?: AnalyticsPayload
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
