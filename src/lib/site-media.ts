/** Статика в `public/media/site/` (герой коммерции и плитки категорий). */
export const SITE_MEDIA = {
  heroPanel: "/media/site/hero-panel.png",
  categoryCard: (seed: string) => `/media/site/${seed}.png`,
} as const;
