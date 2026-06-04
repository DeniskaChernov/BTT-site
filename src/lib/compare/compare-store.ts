const STORAGE_KEY = "btt_compare_v1";
const MAX_COMPARE = 3;

export function readCompareSkus(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === "string").slice(0, MAX_COMPARE);
  } catch {
    return [];
  }
}

export function writeCompareSkus(skus: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(skus.slice(0, MAX_COMPARE)));
}

export function toggleCompareSku(sku: string): string[] {
  const current = readCompareSkus();
  const idx = current.indexOf(sku);
  if (idx >= 0) {
    const next = current.filter((s) => s !== sku);
    writeCompareSkus(next);
    return next;
  }
  const next =
    current.length >= MAX_COMPARE ? [...current.slice(1), sku] : [...current, sku];
  writeCompareSkus(next);
  return next;
}

export const COMPARE_MAX = MAX_COMPARE;
