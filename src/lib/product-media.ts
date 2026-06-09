import type { Product } from "@/types/product";

/** Каталог: `public/media/catalog/{file}` */
export const CATALOG_MEDIA_BASE = "/media/catalog";

/** Предпочитает WebP (см. `scripts/media-optimize.mjs`). */
function catalogAssetPath(relative: string): string {
  if (relative.startsWith("/")) {
    return relative.replace(/\.(png|jpe?g)$/i, ".webp");
  }
  const base = relative.replace(/\.(png|jpe?g|webp|avif)$/i, "");
  return `${CATALOG_MEDIA_BASE}/${base}.webp`;
}

/**
 * Главное фото карточки / PDP.
 * Если в товаре задан `gallery`, берётся первый элемент; иначе — `{imageSeed}.webp`.
 */
export function productMainImage(product: Product): string {
  const g = product.gallery?.[0]?.trim();
  if (g) return catalogAssetPath(g);
  return catalogAssetPath(product.imageSeed);
}

/** Все кадры галереи PDP. */
export function productGalleryImages(product: Product): string[] {
  if (product.gallery?.length) {
    return product.gallery.map((p) => catalogAssetPath(p));
  }
  return [productMainImage(product)];
}
