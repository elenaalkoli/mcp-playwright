# MW Test Consultancy — Playwright Tests

E2E test suite for MW Test Consultancy using Playwright Test.

- Uses Page Object Model
- Runs against the real site configured via `playwright.config.ts`
- No local HTML/RSS fixtures are used anymore

Requirements

- Node.js (v16+)
- npm

Run

- Install dependencies: `npm install`
- Run all tests: `npm test`
- Run a single file: `npx playwright test tests/basic-tests.spec.ts --reporter=list`

Structure

- `tests/` — test files and page object classes
- `tests/page-objects/` — reusable page objects for homepage, books, tools, article, pagination
- `playwright.config.ts` — Playwright configuration including `baseURL`, browsers, and timeouts
