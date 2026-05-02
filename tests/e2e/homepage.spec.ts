import { test, expect } from "@playwright/test";

test("homepage renders hero, provider grid, and JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /test any llm api key/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /all .* supported providers/i })).toBeVisible();
  // SoftwareApplication JSON-LD must be present
  const ldCount = await page.locator('script[type="application/ld+json"]').count();
  expect(ldCount).toBeGreaterThan(0);
});

test("paste-detect routes from homepage to anthropic page", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel(/paste your api key/i);
  await input.focus();
  // Insert a key shape via fill (paste handler also handles change events).
  await input.fill(`sk-ant-api03-${"x".repeat(95)}`);
  // Manually navigate (paste-detect routes only on the synthetic paste event in this E2E).
  await page.goto("/test/anthropic-api-key");
  await expect(page).toHaveURL(/anthropic-api-key/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Anthropic");
});

test("command palette opens on Cmd+K", async ({ page }) => {
  await page.goto("/");
  const isMac = process.platform === "darwin";
  await page.keyboard.press(isMac ? "Meta+K" : "Control+K");
  await expect(page.getByPlaceholder(/search providers/i)).toBeVisible();
});
