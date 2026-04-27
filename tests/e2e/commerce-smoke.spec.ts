import { expect, test } from "@playwright/test";

test("commerce smoke: home -> catalog -> product -> cart -> checkout -> account", async ({ page }) => {
  await page.goto("/ru");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/ru/catalog");
  await expect(page).toHaveURL(/\/ru\/catalog/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const firstProduct = page.locator('a[href^="/ru/product/"]').first();
  await expect(firstProduct).toBeVisible();
  await firstProduct.click();

  await expect(page).toHaveURL(/\/ru\/product\//);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const addToCart = page.getByRole("button").filter({ hasText: /корзин|добав|add/i }).first();
  await expect(addToCart).toBeVisible();
  await addToCart.click();

  await page.goto("/ru/cart");
  await expect(page).toHaveURL(/\/ru\/cart/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/ru/checkout");
  await expect(page).toHaveURL(/\/ru\/checkout/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/ru/account");
  await expect(page).toHaveURL(/\/ru\/account/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
