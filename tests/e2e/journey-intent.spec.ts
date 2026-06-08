import { expect, test } from "@playwright/test";

test("master path: catalog → product → cart", async ({ page }) => {
  await page.goto("/ru/catalog");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator('a[href*="/product/"]').first().click();
  await expect(page).toHaveURL(/\/product\//);
  await page.goto("/ru/cart");
  await expect(page.getByText(/Корзина пуста/)).toBeVisible();
});

test("knowledge path: articles → article", async ({ page }) => {
  await page.goto("/ru/articles");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: /читать|read/i }).first().click();
  await expect(page).toHaveURL(/\/articles\//);
});

test("production path: wholesale form", async ({ page }) => {
  await page.goto("/ru/wholesale");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("form").first()).toBeVisible();
});

test("compare page loads", async ({ page }) => {
  await page.goto("/ru/compare");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
