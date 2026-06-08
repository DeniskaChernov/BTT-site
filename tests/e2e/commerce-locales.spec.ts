import { expect, test } from "@playwright/test";

const locales = [
  { code: "ru", cartCta: /к оформлению|оформить/i, checkoutHeading: /оформление/i },
  { code: "en", cartCta: /checkout/i, checkoutHeading: /checkout/i },
  { code: "uz", cartCta: /rasmiylashtirish/i, checkoutHeading: /buyurtma/i },
] as const;

for (const { code, cartCta, checkoutHeading } of locales) {
  test(`commerce flow (${code}): catalog -> cart sticky CTA -> checkout`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${code}/catalog`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const firstProduct = page.locator(`a[href^="/${code}/product/"]`).first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    await expect(page).toHaveURL(new RegExp(`/${code}/product/`));
    const addToCart = page
      .getByRole("button")
      .filter({ hasText: /корзин|cart|savatcha|добав|add|qo/i })
      .first();
    await expect(addToCart).toBeVisible();
    await addToCart.click();

    await page.goto(`/${code}/cart`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const stickyCheckout = page
      .locator("div.fixed.bottom-0")
      .getByRole("link", { name: cartCta });
    await expect(stickyCheckout).toBeVisible();
    await stickyCheckout.click();

    await expect(page).toHaveURL(new RegExp(`/${code}/checkout`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(checkoutHeading);
    await expect(
      page.locator("div.fixed.bottom-0").getByRole("button", { name: /.+/i }),
    ).toBeVisible();
  });
}
