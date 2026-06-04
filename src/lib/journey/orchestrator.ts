import type { JourneyType } from "@/lib/intent/types";
import type { CategoryTab } from "@/types/product";

export function parseJourneyParam(value: string | null | undefined): JourneyType | null {
  if (value === "master" || value === "production" || value === "knowledge") return value;
  return null;
}

export type CatalogJourneyDefaults = {
  tab: CategoryTab;
  stock: "all" | "in_stock" | "on_order";
  kind: "all" | "regular" | "twisted" | "semi";
};

export function catalogDefaultsForJourney(journey: JourneyType): CatalogJourneyDefaults | null {
  if (journey === "production") return { tab: "material", stock: "in_stock", kind: "semi" };
  if (journey === "master") return { tab: "material", stock: "in_stock", kind: "all" };
  return null;
}

export function shouldApplyJourneyCatalogDefaults(
  journey: JourneyType,
  initial: { shape: string; kind: string; source: string; tab: CategoryTab },
): boolean {
  if (journey === "unknown") return false;
  return !(
    initial.shape !== "all" ||
    initial.kind !== "all" ||
    initial.source !== "all" ||
    initial.tab !== "material"
  );
}

export function reorderByJourney<T extends { id: string }>(
  items: T[],
  journey: JourneyType,
  priorityId: Partial<Record<JourneyType, string>>,
): T[] {
  const targetId = priorityId[journey];
  if (!targetId) return items;
  const idx = items.findIndex((item) => item.id === targetId);
  if (idx <= 0) return items;
  return [items[idx]!, ...items.filter((_, i) => i !== idx)];
}
