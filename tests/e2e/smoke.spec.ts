import { expect, test } from "@playwright/test";

test("health check menyatakan aplikasi dan database siap", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ status: "ok" });
});

test("halaman publik utama dapat dibuka langsung", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /belanja kreatif/i })).toBeVisible();

  await page.goto("/catalog");
  await expect(page.getByRole("heading", { level: 1, name: "Katalog Karya" })).toBeVisible();
  await expect(page.getByText("Notebook Harian", { exact: true }).first()).toBeVisible();

  await page.goto("/catalog/notebook-harian");
  await expect(page.getByRole("heading", { level: 1, name: "Notebook Harian" })).toBeVisible();
});

test("checkout tamu diarahkan ke login, bukan 404", async ({ page }) => {
  await page.goto("/checkout");
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
  await expect(page.getByRole("heading", { level: 1, name: /masuk/i })).toBeVisible();
});
