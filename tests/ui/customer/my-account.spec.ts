import { test, expect } from "../../../fixtures";

test(
  "saved customer session opens the account page",
  { tag: "@functional" },
  async ({ myAccountPage }) => {
    await myAccountPage.goto();
    await expect(myAccountPage.title).toBeVisible();
  },
);
