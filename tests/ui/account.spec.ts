import { test, expect } from "@playwright/test";
import { AUTH_FILES } from "../constants/auth-files";

test.use({ storageState: AUTH_FILES.customer });

test("customer reaches account page while logged in", async ({ page }) => {
  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "My account" })).toBeVisible();
  await expect(page).toHaveURL("/account");
});
