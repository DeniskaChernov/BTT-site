import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BTT_EVENTS,
  readUtmFromSearch,
  trackBttEvent,
  trackEvent,
  type AnalyticsPayload,
} from "./analytics";

describe("readUtmFromSearch", () => {
  it("parses query with or without leading ?", () => {
    expect(
      readUtmFromSearch("?utm_source=ig&utm_medium=social&utm_campaign=spring"),
    ).toEqual({
      source: "ig",
      medium: "social",
      campaign: "spring",
    });
    expect(readUtmFromSearch("utm_content=hero")).toEqual({ content: "hero" });
  });

  it("omits empty params", () => {
    expect(readUtmFromSearch("?utm_source=x")).toEqual({ source: "x" });
  });
});

type WindowWithDataLayer = {
  dataLayer?: AnalyticsPayload[];
};

describe("trackEvent / trackBttEvent", () => {
  const g = globalThis as { window?: WindowWithDataLayer };
  let hadWindow: boolean;

  beforeEach(() => {
    hadWindow = "window" in g;
    g.window = { dataLayer: undefined };
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    if (!hadWindow) {
      delete g.window;
    }
    vi.restoreAllMocks();
  });

  it("pushes event with name, payload and timestamp into dataLayer", () => {
    trackEvent("view_pdp", { sku: "RTN-HR-5-NAT" });
    expect(g.window?.dataLayer).toHaveLength(1);
    const entry = g.window?.dataLayer?.[0] as Record<string, unknown>;
    expect(entry.event).toBe("view_pdp");
    expect(entry.sku).toBe("RTN-HR-5-NAT");
    expect(typeof entry.ts).toBe("number");
  });

  it("trackBttEvent forwards to dataLayer with the correct event name", () => {
    trackBttEvent(BTT_EVENTS.HeroCtaClick, { cta: "stock" });
    const entry = g.window?.dataLayer?.[0] as Record<string, unknown>;
    expect(entry.event).toBe("hero_cta_click");
    expect(entry.cta).toBe("stock");
  });
});
