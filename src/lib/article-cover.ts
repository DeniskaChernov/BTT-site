import { SITE_MEDIA } from "@/lib/site-media";

/** Путь обложки для OG/JSON-LD (относительно origin). */
const COVER_BY_SLUG: Record<string, string> = {
  "rattan-thickness-furniture": SITE_MEDIA.categoryCard("btt-cat-rattan"),
  "planters-outdoor-uv-drainage": SITE_MEDIA.categoryCard("btt-cat-planter"),
  "wholesale-horeca-timelines": SITE_MEDIA.heroPanel,
  "what-is-artificial-rattan": SITE_MEDIA.categoryCard("btt-cat-twist"),
};

export function getArticleCoverPath(slug: string): string | undefined {
  return COVER_BY_SLUG[slug];
}

export function getArticleCoverAbsoluteUrl(
  slug: string,
  siteOrigin: string,
): string | undefined {
  const path = getArticleCoverPath(slug);
  if (!path) return undefined;
  return `${siteOrigin}${path.startsWith("/") ? path : `/${path}`}`;
}
