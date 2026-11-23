import { test, expect } from "../../../fixtures";
import { requireEnv } from "../../utils/env";

// Start unauthenticated so the test exercises the real login form.
test.use({ storageState: { cookies: [], origins: [] } });

test(
  "customer logs in and reaches account page",
  { tag: "@functional" },
  async ({ page, myAccountPage }) => {
    const email = requireEnv("EMAIL_CUSTOMER");
    const password = requireEnv("PASSWORD_CUSTOMER");

    await page.goto("/auth/login");
    await page.getByRole("textbox", { name: "Email address" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill(password);
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("/account");
    await expect(myAccountPage.title).toBeVisible();
  },
);
