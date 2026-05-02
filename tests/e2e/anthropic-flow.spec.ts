import { test, expect } from "@playwright/test";

test("anthropic test page renders breadcrumbs, related providers, FAQ", async ({ page }) => {
  await page.goto("/test/anthropic-api-key");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Anthropic");
  await expect(page.getByRole("navigation", { name: /breadcrumb/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^FAQ$/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /test other providers/i })).toBeVisible();
});
