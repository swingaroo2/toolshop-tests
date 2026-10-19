import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { AUTH_FILES } from "../constants/auth-files";
import { requireEnv } from "../utils/env";

const ROLES = ["customer", "admin"] as const;

for (const role of ROLES) {
  setup(`log in as ${role}`, async ({ request }) => {
    const upper = role.toUpperCase();
    const email = requireEnv(`EMAIL_${upper}`);
    const password = requireEnv(`PASSWORD_${upper}`);
    const baseUrl = requireEnv("UI_URL");

    const response = await request.post("/users/login", {
      data: { email, password },
    });
    expect(response.status()).toBe(200);
    const { access_token } = await response.json();
    expect(access_token).toBeTruthy();

    const state = {
      cookies: [],
      origins: [
        {
          origin: new URL(baseUrl).origin,
          localStorage: [{ name: "auth-token", value: access_token }],
        },
      ],
    };
    fs.mkdirSync(path.dirname(AUTH_FILES[role]), { recursive: true });
    fs.writeFileSync(AUTH_FILES[role], JSON.stringify(state, null, 2));
  });
}
