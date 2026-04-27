import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/ru/cart", "/ru/checkout", "/ru/account", "/uz/cart", "/uz/checkout", "/uz/account", "/en/cart", "/en/checkout", "/en/account"],
    },
    sitemap: "https://bententrade.uz/sitemap.xml",
  };
}
