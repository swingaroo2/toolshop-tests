import { type Locator, type Page } from "@playwright/test";

export class MyAccountPage {
  readonly title: Locator;
  readonly favorites: Locator;
  readonly profile: Locator;
  readonly invoices: Locator;
  readonly messages: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByRole("heading", { name: "My account", level: 1 });
    this.favorites = page.getByRole("button", {
      name: "Favorites",
      exact: true,
    });
    this.profile = page.getByRole("button", { name: "Profile", exact: true });
    this.invoices = page.getByRole("button", { name: "Invoices", exact: true });
    this.messages = page.getByRole("button", { name: "Messages", exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto("/account");
  }

  async openFavorites(): Promise<void> {
    await this.favorites.click();
  }

  async openProfile(): Promise<void> {
    await this.profile.click();
  }

  async openInvoices(): Promise<void> {
    await this.invoices.click();
  }

  async openMessages(): Promise<void> {
    await this.messages.click();
  }
}
