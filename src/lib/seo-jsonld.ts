import type { Product, Locale } from "@/types/product";
import { getPricePerKgForQty, isTwistedRattan } from "@/lib/pricing";
import { productMainImage } from "@/lib/product-media";
import { SITE_ORIGIN } from "@/lib/seo";

type CatalogItemListParams = {
  locale: string;
  catalogName: string;
  catalogUrl: string;
  products: Product[];
  maxItems?: number;
};

export function buildCatalogItemListJsonLd({
  locale,
  catalogName,
  catalogUrl,
  products,
  maxItems = 30,
}: CatalogItemListParams) {
  const loc = locale as Locale;
  const items = products.slice(0, maxItems).map((product, index) => {
    const relImage = productMainImage(product);
    const absImage = relImage.startsWith("http")
      ? relImage
      : `${SITE_ORIGIN}${relImage.startsWith("/") ? relImage : `/${relImage}`}`;
    const bulkQty = isTwistedRattan(product) ? 400 : 500;

    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.names[loc],
        sku: product.sku,
        url: `${SITE_ORIGIN}/${locale}/product/${product.slug}`,
        image: absImage,
        offers: {
          "@type": "Offer",
          priceCurrency: "UZS",
          price: getPricePerKgForQty(product, bulkQty),
          availability:
            product.stock === "in_stock"
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
        },
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: catalogName,
    url: catalogUrl,
    numberOfItems: products.length,
    itemListElement: items,
  };
}
