export type Locale = "ru" | "uz" | "en";

export type ApplicationFilter = "outdoor" | "indoor" | "both";
export type StockFilter = "in_stock" | "on_order";
export type CategoryTab = "material" | "planter" | "new";

export type Product = {
  id: string;
  slug: string;
  sku: string;
  category: CategoryTab;
  names: Record<Locale, string>;
  short: Record<Locale, string>;
  bullets: Record<Locale, string[]>;
  application: ApplicationFilter;
  hardness: "soft" | "medium" | "rigid";
  thicknessMm: number;
  colorKey: string;
  shape: "round" | "flat" | "oval" | "half_round";
  stock: StockFilter;
  /** UZS per kg */
  priceUz: { t12: number; t5: number; t10: number };
  imageSeed: string;
  /** low stock hint for scarcity (optional, real business should sync) */
  lowStock?: boolean;
};
