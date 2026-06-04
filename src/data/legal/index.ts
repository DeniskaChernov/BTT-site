import type { Locale } from "@/types/product";

export type { LegalDoc, LegalDocSlug, LegalSection } from "./types";
export { COOKIES_DOC } from "./cookies";
export { PRIVACY_DOC } from "./privacy";
export { TERMS_DOC } from "./terms";

const LOCALES: Locale[] = ["ru", "uz", "en"];

export function toLegalLocale(locale: string): Locale {
  return LOCALES.includes(locale as Locale) ? (locale as Locale) : "ru";
}

/** Возвращает локализованное значение; при неизвестной локали — RU. */
export function pickLocaleValue<T>(map: Record<Locale, T>, locale: string): T {
  return map[toLegalLocale(locale)];
}
