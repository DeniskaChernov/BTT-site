import type { CategoryTab } from "@/types/product";

export type CatalogJourneyDefaults = {
  tab: CategoryTab;
  stock: "all" | "in_stock" | "on_order";
  kind: "all" | "regular" | "twisted" | "semi";
};

/** @deprecated Не применяем авто-фильтры каталога по journey — только поведенческий ранкинг. */
export function catalogDefaultsForJourney(): CatalogJourneyDefaults | null {
  return null;
}

export function shouldApplyJourneyCatalogDefaults(): boolean {
  return false;
}
