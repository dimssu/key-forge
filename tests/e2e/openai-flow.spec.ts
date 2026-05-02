import { test, expect } from "@playwright/test";

test("openai test page renders, lists snippets, exposes JSON-LD", async ({ page }) => {
  await page.goto("/test/openai-api-key");
  await expect(page.getByRole("heading", { level: 1, name: /test your openai api key/i })).toBeVisible();
  // FAQ + How-to + SoftwareApp + Breadcrumb
  const ldCount = await page.locator('script[type="application/ld+json"]').count();
  expect(ldCount).toBeGreaterThanOrEqual(4);
  // Snippet tabs render after the registry resolves
  await expect(page.getByRole("tab", { name: /cURL/ })).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("tab", { name: /Python/ })).toBeVisible();
});
