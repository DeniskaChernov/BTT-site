import type { JourneyType } from "@/lib/intent/types";

/** Добавляет ?journey= к внутренним ссылкам (кроме внешних и якорей). */
export function withJourneyHref(href: string, journey: JourneyType): string {
  if (journey === "unknown") return href;
  if (href.startsWith("http") || href.startsWith("#") || href.includes("journey=")) {
    return href;
  }
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  params.set("journey", journey);
  const q = params.toString();
  return q ? `${path}?${q}` : path;
}
