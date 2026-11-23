# Playwright Test Automation Instructions

This repository contains automated tests written in TypeScript with `@playwright/test`. Follow these rules when you write, edit, or review test code. Each rule includes its reason so you can apply it to cases not listed here.

## Project layout

- `tests/ui/customer/`: browser tests that run signed in as a customer (project `ui-customer`)
- `tests/ui/admin/`: browser tests that run signed in as an admin (project `ui-admin`)
- `tests/api/`: API tests using the `request` fixture (project `api`)
- `tests/setup/`: `*.setup.ts` files that run first, including authentication (project `setup`)
- `tests/constants/`: shared constants and test data, including `AUTH_FILES` in `auth-files.ts`
- `tests/utils/`: shared helper functions
- `page-objects/`: page object classes, one per file, named `<page-name>.page.ts`
- `fixtures/index.ts`: custom fixtures; import `test` and `expect` from here
- `.auth/`: saved sessions (`admin.json`, `customer.json`); never commit or edit by hand
- `.env`: local secrets; `.env.example` lists the required variables

Put new files in these existing folders. Do not create new top-level folders.

## Core principles

- Test user-visible behavior. Assert on what a user sees and does: text, roles, URLs, visible state. Avoid asserting on CSS classes, internal function names, or DOM structure, because those change without changing behavior.
- Every test must pass when run alone, in any order, and in parallel. A test never depends on state left behind by another test.
- One test verifies one behavior. Name it for that behavior: `test('shows an error when the password is wrong')`.
- Keep test logic linear. Avoid `if`, `try/catch`, and loops inside a test body. A test that branches can pass without checking anything.
- Never test third-party sites or services you do not control. Mock them with `page.route()` and `route.fulfill()`.

## Locators

Choose locators in this priority order:

1. `getByRole()` with an accessible name, e.g. `page.getByRole('button', { name: 'Submit' })`
2. `getByLabel()` for form fields
3. `getByPlaceholder()`, `getByText()`, `getByAltText()`, `getByTitle()`
4. `getByTestId()` when no user-facing attribute is stable
5. CSS or XPath only as a last resort, with a comment explaining why

Rules:

- Narrow scope with chaining and filtering rather than long selectors: `page.getByRole('listitem').filter({ hasText: 'Product 2' }).getByRole('button', { name: 'Add to cart' })`.
- Avoid `.first()`, `.last()`, and `.nth()` unless order is the thing under test. Positional locators silently hit the wrong element when the page changes.
- A locator must resolve to exactly one element for actions. Fix strictness errors by making the locator more specific.
- Never use `page.$()`, `page.$$()`, or `ElementHandle`. Use `Locator` objects, which auto-wait and retry.
- If the app lacks an accessible name or test id, say so and suggest adding one to the app code. Do not work around it with a brittle selector.

## Assertions

- Use web-first assertions, which retry until the condition holds: `await expect(locator).toBeVisible()`, `toHaveText()`, `toHaveValue()`, `toHaveURL()`, `toHaveCount()`.
- Never write `expect(await locator.isVisible()).toBe(true)` or similar. It checks once and does not wait, which causes flaky tests.
- Always `await` every `expect` on a locator or page, and every Playwright action.
- Every test ends with at least one assertion on the outcome. Clicking without verifying the result is an incomplete test.
- Use `expect.soft()` only when checking several independent fields on one screen. Use hard assertions for anything later steps depend on.
- For values that are not locators (API state, computed values), use `expect.poll()` or `expect(async () => { ... }).toPass()`.

## Waiting

- Never use `page.waitForTimeout()` or any fixed sleep. Wait for a condition with a web-first assertion.
- Do not use `waitForLoadState('networkidle')`. Assert on the element that signals the page is ready.
- Do not add `{ force: true }` to actions. It skips actionability checks and hides real bugs. If an element is not actionable, find out why.
- To wait for a network call, start `page.waitForResponse()` before the action that triggers it, then await it after.
- Do not raise timeouts or retries to make a flaky test pass. Find the missing wait condition.

## Test structure

- Import `test` and `expect` from `fixtures/index.ts`, not from `@playwright/test`, so every test gets the project fixtures.
- Group related tests with `test.describe()`. Put navigation and setup shared by every test in the group in `test.beforeEach()`.
- Prefer some duplication in simple tests over shared helpers that hide what the test does.
- Wrap multi-stage flows in `await test.step('description', async () => { ... })` so reports and traces read clearly.
- Use `baseURL` from config and relative paths: `page.goto('/login')`. Never hardcode a host.
- Do not commit `test.only`. Mark known failures with `test.fixme()` or `test.skip()` plus a reason and a ticket reference.
- Tag tests in the details object: `test('...', { tag: '@smoke' }, async ({ page }) => { ... })`.
- Tag generated tests with their respective test type, such as `@functional`, `@performance`, `@security`, `@usability`, or `@accessibility`, in addition to any other applicable test type tags.

## Test names

- Name each test for the behavior it proves, not the assertion it makes.
  - Yes: "saved admin session opens the dashboard"
  - No: "admin dashboard shows its title"
- When the test fails, its name should tell a reader what broke.

## Page objects and fixtures

- Put page objects in `page-objects/`, one class per page or major component. Name files in kebab case with a `.page.ts` suffix and classes in Pascal case: `my-account.page.ts` exports `MyAccountPage`.
- Register each new page object as a fixture in `fixtures/index.ts`.
- Declare locators as `readonly` properties assigned in the constructor. Expose user actions as methods (`login(user, password)`).
- Keep assertions in the test file. Page objects describe how to interact with the page; tests decide what is correct.
- Provide page objects and shared setup to tests through fixtures using `test.extend()`. Do not instantiate them with `new` inside each test.
- Use fixtures for setup that needs teardown. Code after `await use()` runs even when the test fails.
- Do not build deep inheritance chains or a catch-all `BasePage`. Compose small component objects.

## Test data and state

- Create the data a test needs through the API (`request` fixture) or a seeding helper, not by clicking through the UI. UI setup is slow and fails for reasons unrelated to the test.
- Make created data unique per test, e.g. include `testInfo.testId` or a random suffix, so parallel workers do not collide.
- Clean up created data in fixture teardown.
- Never hardcode credentials, tokens, or environment URLs. Read them from `process.env`. When you add a variable, add its name to `.env.example` with a placeholder value.
- Put shared constants in `tests/constants/` and shared helpers in `tests/utils/`. Check both for an existing one before writing a new one.

## Authentication

- The `setup` project signs in once per role and saves each session to `.auth/`. The `ui-customer` and `ui-admin` projects load those sessions through `use.storageState` in `playwright.config.ts`.
- The folder decides the role. Put a customer scenario in `tests/ui/customer/` and an admin scenario in `tests/ui/admin/`. Do not set `storageState` to a role inside a spec file.
- Refer to session file paths through `AUTH_FILES` from `tests/constants/auth-files.ts`. Never hardcode a `.auth/` path.
- `.auth/` must stay in `.gitignore`.
- Only tests that verify the login flow itself may log in through the UI.
- For tests that need a logged-out user, use `test.use({ storageState: { cookies: [], origins: [] } })`.
- If tests modify server-side account state, use one account per parallel worker.

## Network mocking

- Register `page.route()` handlers before `page.goto()` or the triggering action.
- Mock third-party dependencies and hard-to-reproduce states (errors, empty lists, slow responses). Leave the app's own backend real in end-to-end flows unless the test says otherwise.
- Keep mock payloads small and typed. Store larger ones in `tests/constants/`.

## Configuration

Do not change `playwright.config.ts` unless the user asks. Its current behavior:

- Tests run fully parallel. CI forbids `test.only` and retries failures twice.
- Traces record on the first retry. Never set trace to `'on'` in CI; it is costly.
- Projects: `setup`, `api`, `ui-customer`, `ui-admin`. The last three depend on `setup`.
- UI projects run on Desktop Chrome with `baseURL` from `UI_URL`. The `setup` and `api` projects use `baseURL` from `API_URL`.

Do not use `test.describe.configure({ mode: 'serial' })` unless the user asks for it. Serial tests break isolation.

## Visual and accessibility checks

- For `toHaveScreenshot()`, mask or hide dynamic content (dates, avatars, ads) and disable animations. Baselines must come from the same OS and browser as CI.
- For accessibility scans, use `@axe-core/playwright` and assert `results.violations` equals `[]`.

## How to work in this repo

- Before writing a new test, read an existing spec and the relevant page object, then match their patterns.
- After writing or changing a test, run only that file in its project: `npx playwright test tests/ui/customer/file.spec.ts --project=ui-customer --reporter=line`. Fix failures before reporting the work as done.
- When a test fails, read the error and trace before changing code. Decide whether the test or the app is wrong.
- If the app appears to have a bug, report it. Never weaken, delete, or skip an assertion just to make a test pass.
- Do not add comments that restate the code. Comment only on non-obvious reasons.
- Keep `tsc --noEmit` and ESLint clean. The `@typescript-eslint/no-floating-promises` rule must pass, since a missing `await` is the most common cause of flaky tests.

## References

These are the sources for the rules above. Read them when a task needs more detail.

- Best practices: https://playwright.dev/docs/best-practices
- Locators: https://playwright.dev/docs/locators
- Assertions: https://playwright.dev/docs/test-assertions
- Fixtures: https://playwright.dev/docs/test-fixtures
- Page object models: https://playwright.dev/docs/pom
- Authentication: https://playwright.dev/docs/auth
- Mocking: https://playwright.dev/docs/mock
