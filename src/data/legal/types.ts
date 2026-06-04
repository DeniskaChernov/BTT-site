import type { Locale } from "@/types/product";

export type LegalSection = {
  id: string;
  title: Record<Locale, string>;
  paragraphs: Record<Locale, string[]>;
  bullets?: Record<Locale, string[]>;
};

export type LegalDocSlug = "terms" | "privacy" | "cookies";

export type LegalDoc = {
  slug: LegalDocSlug;
  effectiveDateIso: string;
  title: Record<Locale, string>;
  kicker: Record<Locale, string>;
  lead: Record<Locale, string>;
  effectiveLabel: Record<Locale, string>;
  contact: Record<Locale, string>;
  legalNotice: Record<Locale, string>;
  tocLabel: Record<Locale, string>;
  sections: LegalSection[];
};
