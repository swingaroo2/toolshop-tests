import { test, expect } from "../../../fixtures";

test(
  "saved admin session opens the dashboard",
  { tag: "@functional" },
  async ({ adminDashboardPage }) => {
    await adminDashboardPage.goto();
    await expect(adminDashboardPage.salesHeading).toBeVisible();
  },
);
