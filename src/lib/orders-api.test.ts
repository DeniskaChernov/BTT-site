import { products } from "@/data/products";
import { lineItemTotalUz } from "@/lib/pricing";
import { describe, expect, it } from "vitest";
import {
  validateCreateOrderBody,
  validateOrderAgainstCatalog,
  type CreateOrderBody,
} from "./orders-api";

function lineForProduct(
  slug: string,
  qtyKg: number,
): { sku: string; slug: string; name: string; qtyKg: number; lineTotalUz: number } {
  const p = products.find((x) => x.slug === slug);
  if (!p) throw new Error(`missing product ${slug}`);
  const lineTotalUz = lineItemTotalUz(p, qtyKg);
  return {
    sku: p.sku,
    slug: p.slug,
    name: p.names.ru,
    qtyKg,
    lineTotalUz,
  };
}

function validBody(overrides: Partial<CreateOrderBody> = {}): CreateOrderBody {
  const line = lineForProduct(products[0]!.slug, 5);
  return {
    totalUz: line.lineTotalUz,
    lines: [line],
    pay: "payme",
    ship: "courier",
    customerName: "Тест",
    phone: "+998 90 000 00 00",
    address: "",
    ...overrides,
  };
}

describe("validateCreateOrderBody", () => {
  it("accepts a well-formed payload", () => {
    const b = validBody();
    const r = validateCreateOrderBody(b);
    expect(r).not.toBe("Invalid payload");
    if (typeof r === "string") throw new Error(r);
    expect(r.customerName).toBe("Тест");
  });

  it("rejects wrong qty step", () => {
    const line = lineForProduct(products[0]!.slug, 7);
    line.qtyKg = 1.37;
    const r = validateCreateOrderBody({
      ...validBody(),
      lines: [line],
    });
    expect(r).toBe("Invalid line");
  });

  it("returns 422 candidates for invalid pay/ship strings", () => {
    const b = validBody({ pay: "visa" as "payme" });
    expect(validateCreateOrderBody(b)).toBe("Invalid pay method");
    const b2 = validBody({ ship: "drone" as "courier" });
    expect(validateCreateOrderBody(b2)).toBe("Invalid shipping");
  });

  it("accepts telegram as pay method", () => {
    const r = validateCreateOrderBody(validBody({ pay: "telegram" }));
    expect(r).not.toBe("Invalid payload");
    if (typeof r === "string") throw new Error(r);
    expect(r.pay).toBe("telegram");
  });
});

describe("validateOrderAgainstCatalog", () => {
  it("passes for catalog-consistent totals", () => {
    expect(validateOrderAgainstCatalog(validBody())).toBe(true);
  });

  it("rejects tampered line total", () => {
    const b = validBody();
    b.lines[0]!.lineTotalUz += 10_000;
    expect(validateOrderAgainstCatalog(b)).toBe("Line total mismatch");
  });

  it("rejects tampered order total", () => {
    const b = validBody();
    b.totalUz += 500;
    expect(validateOrderAgainstCatalog(b)).toBe("Order total mismatch");
  });

  it("rejects wrong sku for slug", () => {
    const b = validBody();
    b.lines[0]!.sku = "FAKE-SKU";
    expect(validateOrderAgainstCatalog(b)).toBe("SKU mismatch");
  });

  it("rejects unknown slug", () => {
    const b = validBody();
    b.lines[0]!.slug = "no-such-product";
    expect(validateOrderAgainstCatalog(b)).toBe("Invalid product");
  });

  it("rejects on-order material below 5kg", () => {
    const onOrder = products.find(
      (p) => p.stock === "on_order" && p.category === "material",
    );
    if (!onOrder) {
      throw new Error("expected at least one on_order material in fixtures");
    }
    const lowQty = 1;
    const b = validBody({
      lines: [
        {
          sku: onOrder.sku,
          slug: onOrder.slug,
          name: onOrder.names.ru,
          qtyKg: lowQty,
          lineTotalUz: lineItemTotalUz(onOrder, lowQty),
        },
      ],
      totalUz: lineItemTotalUz(onOrder, lowQty),
    });
    expect(validateOrderAgainstCatalog(b)).toBe("Minimum preorder quantity is 5 kg");
  });

  it("sums multiple lines against totalUz", () => {
    const slug = products[0]!.slug;
    const a = lineForProduct(slug, 1);
    const bLine = lineForProduct(slug, 2.5);
    const body = validBody({
      lines: [a, bLine],
      totalUz: a.lineTotalUz + bLine.lineTotalUz,
    });
    expect(validateOrderAgainstCatalog(body)).toBe(true);
  });
});
