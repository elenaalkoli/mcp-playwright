# MW Test Consultancy — Playwright Tests

Small E2E test suite for MW Test Consultancy using Playwright Test.
- Page Object Model; embedded HTML/RSS fixtures for offline/CI runs.

Requirements
- Node.js (v16+), npm

Run
- Install: npm install
- Run all tests: npm test
- Run a single file: npx playwright test tests/basic-tests.spec.ts --reporter=list

Structure
- `tests/` — tests and page-objects
- `playwright.config.ts` — config (baseURL, timeouts)
