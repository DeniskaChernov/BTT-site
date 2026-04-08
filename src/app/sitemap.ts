import { products } from "@/data/products";
import type { MetadataRoute } from "next";

const base = "https://bententrade.uz";
const locales = ["ru", "uz", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/catalog",
    "/wholesale",
    "/export",
    "/about",
    "/contacts",
    "/faq",
    "/articles",
    "/blog",
    "/cart",
    "/checkout",
    "/account",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const p of staticPaths) {
      entries.push({
        url: `${base}/${locale}${p}`,
        lastModified: new Date(),
        changeFrequency: p === "" ? "weekly" : "monthly",
        priority: p === "" ? 1 : 0.7,
      });
    }
    for (const prod of products) {
      entries.push({
        url: `${base}/${locale}/product/${prod.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
