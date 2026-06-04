import { expect, test } from "@playwright/test";

test("catalog loads within budget", async ({ page }) => {
  await page.goto("/ru/catalog");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const timing = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    return nav ? nav.domContentLoadedEventEnd - nav.startTime : 0;
  });
  expect(timing).toBeLessThan(8000);
});

test("article page renders", async ({ page }) => {
  await page.goto("/ru/articles/rattan-thickness-furniture");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
