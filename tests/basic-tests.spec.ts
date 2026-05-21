import { test, expect } from '@playwright/test';
import { HomePage, BooksPage, ToolsPage, ArticlePage, PaginationPage } from './page-objects';

let homePage: HomePage;

test.describe('MW Test Consultancy basic tests', () => {
  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('Test case 1 — Homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(homePage.homePath);
    await expect(page).toHaveTitle(/MW Test Consultancy/i);
  });

  test('Test case 2 — Main navigation menu is visible', async ({ page }) => {
    await expect(homePage.homeLink).toBeVisible();
    await expect(homePage.booksLink).toBeVisible();
    await expect(homePage.toolsLink).toBeVisible();

    await expect(homePage.homeLink).toHaveAttribute('href', /(^\/$|https?:\/\/[^\s]+\/$)/i);
    await expect(homePage.booksLink).toHaveAttribute('href', /books\/?$/i);
    await expect(homePage.toolsLink).toHaveAttribute('href', /tools\/?$/i);
  });

  test('Test case 3 — Books page opens', async ({ page }) => {
    const booksPage = await homePage.openBooks();

    await expect(booksPage.title).toBeVisible();
    await expect(booksPage.title).toHaveText(/books/i);
  });

  test('Test case 4 — Tools page opens', async ({ page }) => {
    const toolsPage = await homePage.openTools();

    await expect(toolsPage.title).toBeVisible();
    await expect(toolsPage.title).toHaveText(/software testing tools/i);
  });

  test('Test case 5 — Sign in portal opens', async ({ page }) => {
    await homePage.openSignIn();

    await expect(page).toHaveURL(/#\/portal\/signin/i);
  });

  test('Test case 6 — Subscribe portal opens', async ({ page }) => {
    await homePage.openSubscribe();

    await expect(page).toHaveURL(/#\/portal\/signup/i);
  });

  test('Test case 7 — Latest blog article opens from homepage', async ({ page }) => {
    const articlePage = await homePage.openLatestArticle();

    await expect(articlePage.title).toBeVisible();
    await expect(articlePage.author).toBeVisible();
  });

  test('Test case 8 — RSS feed is available', async ({ page }) => {
    // Use fetch from the page context to load the real RSS feed endpoint.
    const text = await page.evaluate(async () => {
      const res = await fetch('/rss/');
      return res.text();
    });

    expect(text).toMatch(/<\s*(rss|feed)/i);
  });

  test('Test case 9 — SEO metadata is present on homepage', async ({ page }) => {
    await homePage.expectSeoMetadata();
  });

  test('Test case 10 — Pagination next page opens', async ({ page }) => {
    const paginationPage = await homePage.clickNextPage();

    await expect(paginationPage.pageMarker).toBeVisible();
    await expect(page).toHaveURL(/page\/2\//i);
  });

  test('Test case 11 — Non-existent page returns 404', async ({ page }) => {
    const response = await page.goto('/non-existent-page-xyz');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /^404$/i })).toBeVisible();
  });
});
