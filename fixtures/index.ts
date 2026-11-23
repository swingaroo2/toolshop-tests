import { test as base, expect } from "@playwright/test";
import { AdminDashboardPage } from "../page-objects/admin-dashboard.page";
import { MyAccountPage } from "../page-objects/my-account.page";

type Fixtures = {
  adminDashboardPage: AdminDashboardPage;
  myAccountPage: MyAccountPage;
};

export const test = base.extend<Fixtures>({
  adminDashboardPage: async ({ page }, use) => {
    await use(new AdminDashboardPage(page));
  },
  myAccountPage: async ({ page }, use) => {
    await use(new MyAccountPage(page));
  },
});

export { expect };
