import { ProductDetail } from "@/components/product/ProductDetail";
import { getProductBySlug, getRelated, products } from "@/data/products";
import { getPricePerKgForQty, isTwistedRattan } from "@/lib/pricing";
import { productMainImage } from "@/lib/product-media";
import { buildAlternates, SITE_ORIGIN } from "@/lib/seo";
import type { Locale } from "@/types/product";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return products.flatMap((p) =>
    (["ru", "uz", "en"] as const).map((locale) => ({
      locale,
      slug: p.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return {};
  const name = p.names[locale as Locale];
  const description = p.short[locale as Locale];
  const alternates = buildAlternates(locale, `/product/${slug}`);
  const relImage = productMainImage(p);
  const absImage = relImage.startsWith("http")
    ? relImage
    : `${SITE_ORIGIN}${relImage.startsWith("/") ? relImage : `/${relImage}`}`;
  return {
    title: name,
    description,
    alternates,
    openGraph: {
      title: name,
      description,
      url: alternates.canonical,
      images: [{ url: absImage, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: [absImage],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCatalog = await getTranslations({ locale, namespace: "catalog" });
  const tab = product.category;
  const categoryLabel = tCatalog(`tabs_${tab}` as "tabs_material" | "tabs_planter" | "tabs_new");

  const relImage = productMainImage(product);
  const absImage = relImage.startsWith("http")
    ? relImage
    : `${SITE_ORIGIN}${relImage.startsWith("/") ? relImage : `/${relImage}`}`;

  const productUrl = `${SITE_ORIGIN}/${locale}/product/${product.slug}`;
  const catalogUrl = `${SITE_ORIGIN}/${locale}/catalog`;
  const categoryUrl = `${catalogUrl}?tab=${tab}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tNav("home"),
        item: `${SITE_ORIGIN}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("catalog"),
        item: catalogUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryLabel,
        item: categoryUrl,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.names[locale as Locale],
        item: productUrl,
      },
    ],
  };

  const bulkQty = isTwistedRattan(product) ? 400 : 500;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.names[locale as Locale],
    sku: product.sku,
    description: product.short[locale as Locale],
    brand: { "@type": "Brand", name: "Bententrade" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "UZS",
      lowPrice: getPricePerKgForQty(product, bulkQty),
      highPrice: getPricePerKgForQty(product, 5),
      offerCount: 3,
      availability: product.stock === "in_stock" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    },
    url: productUrl,
    image: absImage,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} related={getRelated(slug)} />
    </>
  );
}
