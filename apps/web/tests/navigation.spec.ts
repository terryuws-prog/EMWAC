import { test, expect } from "@playwright/test";

test("main platform routes render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /environmental monitoring, clarified/i })).toBeVisible();

  await page.getByRole("link", { name: /open dashboard/i }).click();
  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible();

  await page.getByRole("link", { name: /sites/i }).click();
  await expect(page.getByRole("heading", { name: /sites/i })).toBeVisible();

  await page.getByRole("link", { name: /analytics/i }).click();
  await expect(page.getByRole("heading", { name: /analytics/i })).toBeVisible();
});
