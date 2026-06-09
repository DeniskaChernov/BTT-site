/** Статика в `public/media/site/` (герой коммерции и плитки категорий). */
export const SITE_MEDIA = {
  heroPanel: "/media/site/hero-panel.webp",
  categoryCard: (seed: string) => `/media/site/${seed}.webp`,
} as const;
