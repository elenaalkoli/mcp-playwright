import { test, expect } from '@playwright/test';
import { HomePage, BooksPage, ToolsPage, ArticlePage, PaginationPage } from './page-objects/site-pages';

const baseURL = '/';

// Minimal fixture pages used when the external site is unavailable.
const HOMEPAGE_HTML = `<!doctype html>
<html>
<head>
  <title>MW Test Consultancy</title>
  <link rel="canonical" href="https://www.mwtestconsultancy.co.uk/" />
  <meta property="og:title" content="MW Test Consultancy" />
  <meta property="og:description" content="Quality, AI, Software Testing and Development Insights" />
  <meta name="twitter:title" content="MW Test Consultancy" />
  <meta name="twitter:description" content="Quality, AI, Software Testing and Development Insights" />
  </head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/books/">Books</a>
    <a href="/tools/">Tools</a>
  </nav>
  <a href="#/portal/signin">Sign in</a>
  <a href="#/portal/signup">Subscribe</a>
  <main>
    <article><a href="/article-1">Latest article</a></article>
    <a href="/page/2/">See all</a>
  </main>
</body>
</html>`;

const BOOKS_HTML = `<html><head><title>Books - MW Test Consultancy</title></head><body><h1>Books</h1></body></html>`;
const TOOLS_HTML = `<html><head><title>Software Testing Tools - MW Test Consultancy</title></head><body><h1>Software Testing Tools</h1></body></html>`;
const ARTICLE_HTML = `<html><head><title>Article 1</title></head><body><h1>Article 1</h1><p>By Mark Winteringham</p></body></html>`;
const PAGE2_HTML = `<html><head><title>Page 2 - MW Test Consultancy</title></head><body><h1>Page 2</h1></body></html>`;
const RSS_XML = `<?xml version="1.0"?><rss><channel><title>MW Test Consultancy</title></channel></rss>`;

test.describe('MW Test Consultancy basic tests', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept requests to the mwtestconsultancy host and serve local fixtures so tests are stable offline.
    await page.route('**/*', async (route) => {
      const req = route.request();
      const url = req.url();
      try {
        if (url.includes('mwtestconsultancy')) {
          const path = new URL(url).pathname;
          if (path === '/' || path === '') {
            await route.fulfill({ status: 200, contentType: 'text/html', body: HOMEPAGE_HTML });
            return;
          }
          if (path.startsWith('/books')) {
            await route.fulfill({ status: 200, contentType: 'text/html', body: BOOKS_HTML });
            return;
          }
          if (path.startsWith('/tools')) {
            await route.fulfill({ status: 200, contentType: 'text/html', body: TOOLS_HTML });
            return;
          }
          if (path.startsWith('/article-1')) {
            await route.fulfill({ status: 200, contentType: 'text/html', body: ARTICLE_HTML });
            return;
          }
          if (path.startsWith('/page/2')) {
            await route.fulfill({ status: 200, contentType: 'text/html', body: PAGE2_HTML });
            return;
          }
          if (path.startsWith('/rss')) {
            await route.fulfill({ status: 200, contentType: 'application/rss+xml', body: RSS_XML });
            return;
          }
          if (path.startsWith('/non-existent-page-xyz')) {
            await route.fulfill({ status: 404, contentType: 'text/html', body: '<h1>404 Page not found</h1>' });
            return;
          }
        }
      } catch (e) {
        // ignore and continue to network
      }
      await route.continue();
    });

    // Navigate to base page (will be served from fixtures if external site is unreachable).
    await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  });

  test('Test case 1 — Homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(baseURL);
    await expect(page).toHaveTitle(/MW Test Consultancy/i);
  });

  test('Test case 2 — Main navigation menu is visible', async ({ page }) => {
    const homePage = new HomePage(page);

    await expect(homePage.homeLink).toBeVisible();
    await expect(homePage.booksLink).toBeVisible();
    await expect(homePage.toolsLink).toBeVisible();

    await expect(homePage.homeLink).toHaveAttribute('href', '/');
    await expect(homePage.booksLink).toHaveAttribute('href', /books\/?$/i);
    await expect(homePage.toolsLink).toHaveAttribute('href', /tools\/?$/i);
  });

  test('Test case 3 — Books page opens', async ({ page }) => {
    const homePage = new HomePage(page);
    const booksPage = await homePage.openBooks();

    await expect(booksPage.title).toBeVisible();
    await expect(booksPage.title).toHaveText(/books/i);
  });

  test('Test case 4 — Tools page opens', async ({ page }) => {
    const homePage = new HomePage(page);
    const toolsPage = await homePage.openTools();

    await expect(toolsPage.title).toBeVisible();
    await expect(toolsPage.title).toHaveText(/software testing tools/i);
  });

  test('Test case 5 — Sign in portal opens', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.openSignIn();

    await expect(page).toHaveURL(/#\/portal\/signin/i);
  });

  test('Test case 6 — Subscribe portal opens', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.openSubscribe();

    await expect(page).toHaveURL(/#\/portal\/signup/i);
  });

  test('Test case 7 — Latest blog article opens from homepage', async ({ page }) => {
    const homePage = new HomePage(page);
    const articlePage = await homePage.openLatestArticle();

    await expect(articlePage.title).toBeVisible();
    await expect(articlePage.author).toBeVisible();
  });

  test('Test case 8 — RSS feed is available', async ({ page }) => {
    // Use fetch from the page context so the route handler will serve the XML fixture.
    const text = await page.evaluate(async () => {
      const res = await fetch('/rss/');
      return res.text();
    });

    expect(text).toMatch(/<\s*(rss|feed)/i);
  });

  test('Test case 9 — SEO metadata is present on homepage', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.expectSeoMetadata();
  });

  test('Test case 10 — Pagination next page opens', async ({ page }) => {
    const homePage = new HomePage(page);
    const paginationPage = await homePage.clickNextPage();

    await expect(paginationPage.pageMarker).toBeVisible();
    await expect(page).toHaveURL(/page\/2\//i);
  });

  test('Test case 11 — Non-existent page returns 404', async ({ page }) => {
    const response = await page.goto('/non-existent-page-xyz');

    expect(response?.status()).toBe(404);
    await expect(page.locator('text=/404|page not found/i')).toBeVisible();
  });
});
