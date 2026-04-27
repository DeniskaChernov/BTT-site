import { describe, expect, it, vi, beforeEach } from "vitest";
import { products } from "@/data/products";
import { lineItemTotalUz } from "@/lib/pricing";

const mockCreate = vi.fn();
const mockFindMany = vi.fn();

vi.mock("@/lib/db", () => ({
  prisma: {
    order: {
      create: mockCreate,
      findMany: mockFindMany,
    },
  },
}));

vi.mock("@/lib/crm-webhook", () => ({
  notifyCrmOrderCreated: vi.fn(),
}));

vi.mock("@/lib/customer-notify", () => ({
  notifyCustomerOrderEvent: vi.fn(),
}));

describe("/api/orders route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("DATABASE_URL", "postgres://example");
    vi.stubEnv("ORDER_HISTORY_TOKEN_SECRET", "test-secret-1234567890");
  });

  it("rejects GET history without access token", async () => {
    const { GET } = await import("./route");
    const res = await GET(new Request("http://localhost/api/orders?phone=%2B998901112233"));
    expect(res.status).toBe(401);
  });

  it("returns history access token after successful POST", async () => {
    const p = products.find((x) => x.category === "material");
    if (!p) throw new Error("missing test product");
    const qtyKg = 5;
    const lineTotal = lineItemTotalUz(p, qtyKg);
    const now = new Date("2026-01-01T10:00:00.000Z");
    mockCreate.mockResolvedValueOnce({
      id: "ord_1",
      createdAt: now,
      updatedAt: now,
      phone: "+998901112233",
      customerName: "Test User",
      status: "NEW",
      paymentStatus: "PENDING",
      totalUz: lineTotal,
      trackingProvider: null,
      trackingNumber: null,
      trackingUrl: null,
      paymentUrl: null,
      lines: [],
    });
    const { POST } = await import("./route");
    const res = await POST(
      new Request("http://localhost/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          totalUz: lineTotal,
          lines: [
            {
              sku: p.sku,
              slug: p.slug,
              name: p.names.ru,
              qtyKg,
              lineTotalUz: lineTotal,
            },
          ],
          pay: "telegram",
          ship: "pickup",
          customerName: "Test User",
          phone: "+998901112233",
          address: "",
        }),
      }),
    );

    expect(res.status).toBe(200);
    const payload = (await res.json()) as { historyAccessToken?: string };
    expect(typeof payload.historyAccessToken).toBe("string");
    expect(payload.historyAccessToken?.length).toBeGreaterThan(20);
  });
});
