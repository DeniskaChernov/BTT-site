import { expect, test } from "@playwright/test";
import { products } from "@/data/products";
import { lineItemTotalUz } from "@/lib/pricing";

/**
 * Успешное создание заказа через POST /api/orders при доступной БД.
 * Локально без DATABASE_URL на сервере тест пропускается (health не сообщает db: up).
 */
test("POST /api/orders creates order when database is up", async ({ request }) => {
  const health = await request.get("/api/health?db=1").catch(() => null);
  if (health === null) {
    test.skip(true, "Dev server not running on baseURL (start npm run dev before test:e2e)");
    return;
  }
  const meta = (await health.json().catch(() => ({}))) as { ok?: boolean; db?: string };
  if (!(health.ok() && meta.db === "up")) {
    test.skip(true, "PostgreSQL not configured or unreachable for this server");
  }

  const p = products.find((x) => x.category === "material");
  if (!p) {
    throw new Error("expected at least one material product");
  }
  const qtyKg = 5;
  const lineTotalUz = lineItemTotalUz(p, qtyKg);

  const res = await request.post("/api/orders", {
    data: {
      totalUz: lineTotalUz,
      lines: [
        {
          sku: p.sku,
          slug: p.slug,
          name: p.names.ru,
          qtyKg,
          lineTotalUz,
        },
      ],
      pay: "telegram",
      ship: "pickup",
      customerName: "E2E Order Test",
      phone: "+998901112233",
      address: "",
    },
    headers: { "Content-Type": "application/json" },
  });

  expect(res.status()).toBe(200);
  const body = (await res.json()) as { id?: string; historyAccessToken?: string };
  expect(typeof body.id).toBe("string");
  expect(body.id?.length).toBeGreaterThan(5);
  if (body.historyAccessToken != null) {
    expect(typeof body.historyAccessToken).toBe("string");
    expect(body.historyAccessToken.length).toBeGreaterThan(20);
  }
});
