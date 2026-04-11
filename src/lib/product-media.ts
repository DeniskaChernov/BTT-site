import type { Product } from "@/types/product";

/** Каталог: `public/media/catalog/{file}` */
export const CATALOG_MEDIA_BASE = "/media/catalog";

/**
 * Главное фото карточки / PDP.
 * Если в товаре задан `gallery`, берётся первый элемент; иначе — `{imageSeed}.png`.
 */
export function productMainImage(product: Product): string {
  const g = product.gallery?.[0]?.trim();
  if (g) return g.startsWith("/") ? g : `${CATALOG_MEDIA_BASE}/${g}`;
  return `${CATALOG_MEDIA_BASE}/${product.imageSeed}.png`;
}

/** Все кадры галереи PDP (пока обычно один файл; добавьте пути в `product.gallery`). */
export function productGalleryImages(product: Product): string[] {
  if (product.gallery?.length) {
    return product.gallery.map((p) =>
      p.startsWith("/") ? p : `${CATALOG_MEDIA_BASE}/${p}`,
    );
  }
  return [productMainImage(product)];
}
