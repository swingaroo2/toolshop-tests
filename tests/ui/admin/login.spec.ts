import { test, expect } from "@playwright/test";
import { requireEnv } from "../../utils/env";

// Start unauthenticated so the test exercises the real login form.
test.use({ storageState: { cookies: [], origins: [] } });

test("admin logs in and lands on the dashboard", async ({ page }) => {
  const email = requireEnv("EMAIL_ADMIN");
  const password = requireEnv("PASSWORD_ADMIN");

  await page.goto("/auth/login");
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/admin\/dashboard$/);
  await expect(
    page.getByRole("heading", { name: "Sales over the years" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Latest orders" }),
  ).toBeVisible();
});
