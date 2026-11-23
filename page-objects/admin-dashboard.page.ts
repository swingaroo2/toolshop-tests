import { type Locator, type Page } from "@playwright/test";

export class AdminDashboardPage {
  readonly salesHeading: Locator;
  readonly latestOrdersHeading: Locator;
  readonly ordersTable: Locator;
  readonly pagination: Locator;

  constructor(private readonly page: Page) {
    this.salesHeading = page.getByRole("heading", {
      name: "Sales over the years",
      level: 1,
    });
    this.latestOrdersHeading = page.getByRole("heading", {
      name: "Latest orders",
      level: 2,
    });
    this.ordersTable = page.getByRole("table");
    this.pagination = page
      .getByRole("navigation")
      .filter({ has: page.getByRole("button", { name: "Previous" }) });
  }

  async goto(): Promise<void> {
    await this.page.goto("/admin/dashboard");
  }

  async goToPage(pageNumber: number): Promise<void> {
    await this.pagination
      .getByRole("button", { name: `Page-${pageNumber}` })
      .click();
  }

  async goToNextPage(): Promise<void> {
    await this.pagination.getByRole("button", { name: "Next" }).click();
  }

  async goToPreviousPage(): Promise<void> {
    await this.pagination.getByRole("button", { name: "Previous" }).click();
  }

  async editOrder(invoiceNumber: string): Promise<void> {
    const orderRow = this.ordersTable
      .getByRole("row")
      .filter({ has: this.page.getByText(invoiceNumber, { exact: true }) });

    await orderRow.getByRole("link", { name: "Edit" }).click();
  }
}