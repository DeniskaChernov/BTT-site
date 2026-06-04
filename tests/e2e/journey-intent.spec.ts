import { expect, test } from "@playwright/test";

test("journey param applies on catalog", async ({ page }) => {
  await page.goto("/ru/catalog?journey=production");
  await expect(page).toHaveURL(/journey=production/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("articles hub loads with for-you or grid", async ({ page }) => {
  await page.goto("/ru/articles");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("ul").first()).toBeVisible();
});
