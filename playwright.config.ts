import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { AUTH_FILES } from "./tests/constants/auth-files";

dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
      use: { baseURL: process.env.API_URL },
    },
    {
      name: "api",
      testDir: "./tests/api",
      use: { baseURL: process.env.API_URL },
      dependencies: ["setup"],
    },
    {
      name: "ui-customer",
      testDir: "./tests/ui/customer",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.UI_URL,
        storageState: AUTH_FILES.customer,
      },
      dependencies: ["setup"],
    },
    {
      name: "ui-admin",
      testDir: "./tests/ui/admin",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.UI_URL,
        storageState: AUTH_FILES.admin,
      },
      dependencies: ["setup"],
    },
  ],
});
