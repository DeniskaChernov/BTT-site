import { ProductDetail } from "@/components/product/ProductDetail";
import { getProductBySlug, getRelated, products } from "@/data/products";
import { buildAlternates, SITE_ORIGIN } from "@/lib/seo";
import type { Locale } from "@/types/product";
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
  const alternates = buildAlternates(locale, `/product/${slug}`);
  return {
    title: name,
    description: p.short[locale as Locale],
    alternates,
    openGraph: { title: name, description: p.short[locale as Locale], url: alternates.canonical },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.names[locale as Locale],
    sku: product.sku,
    description: product.short[locale as Locale],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "UZS",
      lowPrice: product.priceUz.t10,
      highPrice: product.priceUz.t12,
      offerCount: 3,
      availability: product.stock === "in_stock" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    },
    url: `${SITE_ORIGIN}/${locale}/product/${product.slug}`,
    image: (product.gallery && product.gallery[0]) || "",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} related={getRelated(slug)} />
    </>
  );
}
