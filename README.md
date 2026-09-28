# toolshop-tests

Playwright and TypeScript automation suite for Practice Software Testing (Toolshop), run locally via Docker.

## Feature Domains

1. **Authentication** (User, TOTP): login, logout, token refresh, forgot password, change password, TOTP setup and verify.
2. **User accounts** (User, Favorite): register, `/users/me`, user CRUD and search (admin), favorites.
3. **Catalog** (Product, Product Spec, Brand, Category, Image): browsing, filtering, search, related products, specs. Reads are public and used by everyone. Creates, updates, and deletes are admin work.
4. **Checkout** (Cart, Payment, Postcode, Invoice create): cart operations, payment check, address lookup, `POST /invoices` and `/invoices/guest`.
5. **Orders** (Invoice): invoice list, detail, search, status changes, PDF download and PDF status.
6. **Customer messages** (Contact): send message, attach file, reply, status changes.
7. **Reporting** (Report, Stream): admin sales reports and the live sales stream.

## Risk Scoring

Based on [risk rubric](documentation/risk-rubric.md). Sorted by risk score. Ties are broken by dependency order, since each area needs the ones above it for test setup.

| Feature Domain    | Likelihood | Impact | Risk |
| ----------------- | ---------- | ------ | ---- |
| Authentication    | 3          | 3      | 9    |
| Catalog           | 3          | 3      | 9    |
| Checkout          | 3          | 3      | 9    |
| Orders            | 3          | 3      | 9    |
| Customer messages | 3          | 3      | 9    |
| User accounts     | 2          | 3      | 6    |
| Reporting         | 3          | 2      | 6    |

### Justification

- **Authentication (9):** L3 for token lifecycle, TOTP two-step setup, and lockout state. I3 because it blocks every authenticated feature and handles credentials.
- **Catalog (9):** L3 for combined filters, sorting, and a parsed price range string. I3 because every user depends on it, checkout depends on it, and its prices feed invoice totals.
- **Checkout (9):** L3 for a multi-step flow, total calculations, and five payment methods. I3 for money and card data.
- **Orders (9):** L3 for async PDF generation on the queue worker, role-scoped results, and status transition rules. I3 because invoices display full card numbers (which should be masked).
- **Customer messages (9):** L3 for input validation, file uploads, status rules, and email depending on the queue worker. I3 because uploads are attack surface (no auth in `/messages/{messageId}/attach-file`) and role-scoped visibility protects user privacy.
- **User accounts (6):** L2 for full CRUD with moderate validation on registration. I3 because it holds personal data that an authorization failure would expose.
- **Reporting (6):** L3 for aggregation logic and a streaming endpoint. I2 because failures affect internal business data, not customer data or transactions.
