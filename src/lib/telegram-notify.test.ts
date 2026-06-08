import { describe, expect, it } from "vitest";
import { formatManagerOrderTelegramHtml } from "./telegram-notify";

const baseOrder = {
  id: "ord-abc-123",
  totalUz: 360_000,
  pay: "telegram",
  ship: "courier",
  customerName: "Ali & Co",
  phone: "+998901234567",
  address: "Tashkent <center>",
  lines: [
    {
      name: "Rattan <round>",
      qtyKg: 10,
      lineTotalUz: 360_000,
    },
  ],
};

describe("formatManagerOrderTelegramHtml", () => {
  it("escapes HTML in customer and line names", () => {
    const html = formatManagerOrderTelegramHtml(baseOrder);
    expect(html).toContain("Ali &amp; Co");
    expect(html).toContain("Rattan &lt;round&gt;");
    expect(html).toContain("Tashkent &lt;center&gt;");
  });

  it("includes pay, ship, total and order id", () => {
    const html = formatManagerOrderTelegramHtml(baseOrder);
    expect(html).toContain("<code>ord-abc-123</code>");
    expect(html).toContain("Курьер");
    expect(html).toContain("Telegram / согласование");
    expect(html).toContain("10 кг");
    expect(html).toMatch(/Итого.*360/);
  });

  it("omits address block when empty", () => {
    const html = formatManagerOrderTelegramHtml({
      ...baseOrder,
      address: null,
      ship: "pickup",
      pay: "invoice",
    });
    expect(html).not.toContain("<b>Адрес:</b>");
    expect(html).toContain("Самовывоз");
    expect(html).toContain("Счёт для юрлица");
  });
});
