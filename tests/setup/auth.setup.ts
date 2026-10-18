import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { AUTH_FILES } from "../constants/auth-files";

setup("log in as customer", async ({ request }) => {
  const email = process.env.EMAIL_CUSTOMER;
  const password = process.env.PASSWORD_CUSTOMER;
  const baseUrl = process.env.UI_URL;
  expect(email, "EMAIL_CUSTOMER must be set in .env").toBeTruthy();
  expect(password, "PASSWORD_CUSTOMER must be set in .env").toBeTruthy();
  expect(baseUrl, "UI_URL must be set in .env").toBeTruthy();

  const response = await request.post("/users/login", {
    data: { email, password },
  });
  expect(response.status()).toBe(200);

  const { access_token } = await response.json();
  expect(access_token).toBeTruthy();

  // The web app reads its JWT from localStorage under "auth-token".
  const state = {
    cookies: [],
    origins: [
      {
        origin: new URL(baseUrl!).origin,
        localStorage: [{ name: "auth-token", value: access_token }],
      },
    ],
  };
  fs.mkdirSync(path.dirname(AUTH_FILES.customer), { recursive: true });
  fs.writeFileSync(AUTH_FILES.customer, JSON.stringify(state, null, 2));
});
