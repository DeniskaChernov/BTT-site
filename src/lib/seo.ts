import { routing } from "@/i18n/routing";

export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://bententrade.uz"
).replace(/\/$/, "");

export function localizedPath(locale: string, path = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const normalizedPath = cleanPath === "/" ? "" : cleanPath;
  return `/${locale}${normalizedPath}`;
}

export function buildAlternates(locale: string, path = "/"): {
  canonical: string;
  languages: Record<string, string>;
} {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_ORIGIN}${localizedPath(l, path)}`]),
  );
  return {
    canonical: `${SITE_ORIGIN}${localizedPath(locale, path)}`,
    languages: {
      ...languages,
      "x-default": `${SITE_ORIGIN}${localizedPath(routing.defaultLocale, path)}`,
    },
  };
}
