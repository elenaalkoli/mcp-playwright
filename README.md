# MW Test Consultancy — Playwright Tests

UI automation suite for MW Test Consultancy built with Playwright and TypeScript.

The project demonstrates:

- Page Object Model (POM)
- Real-site E2E coverage against `https://www.mwtestconsultancy.co.uk`
- Browser matrix testing for Chromium, Firefox and WebKit
- Playwright configuration and reusable page objects

## Project Setup

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/elenaalkoli/mcp-playwright.git
cd mcp-playwright
npm install
```

### 2. Environment

The project uses `playwright.config.ts` to define the default `baseURL`.
No additional `.env` file is required by default.

If you need to override the target URL, update `use.baseURL` in `playwright.config.ts`.

## Running Tests

Run all tests:

```bash
npm test
```

Run a single spec file:

```bash
npx playwright test tests/basic-tests.spec.ts --reporter=list
```

Headed mode (visible browser):

```bash
npx playwright test --headed
```

Debug mode:

```bash
npx playwright test --debug
```

Run a specific browser project:

```bash
npm test -- --project=chromium
```

Open the Playwright HTML report after a run:

```bash
npx playwright show-report
```

## Project Structure

```
.
├── package.json
├── playwright.config.ts
├── README.md
└── tests
    ├── basic-tests.spec.ts
    ├── seed.spec.ts
    └── page-objects
        ├── BasePage.ts
        ├── HomePage.ts
        ├── BooksPage.ts
        ├── ToolsPage.ts
        ├── ArticlePage.ts
        ├── PaginationPage.ts
        └── index.ts
```

### Key folders

- `tests/` — Playwright test suites and support specs
- `tests/page-objects/` — reusable page objects for site pages
- `playwright.config.ts` — Playwright configuration, browsers, timeouts, and base URL

## Test Coverage

Current test scenarios include:

- Homepage load and metadata validation
- Main navigation checks
- Books and Tools pages navigation
- Sign in and Subscribe portal navigation
- Latest blog article access from homepage
- RSS feed accessibility
- Pagination and 404 handling

## Notes

- Tests run against the live MW Test Consultancy site.
- The suite avoids local HTML/RSS fixtures and relies on real application behavior.
- `package.json` includes scripts for running tests and Playwright UI mode.
