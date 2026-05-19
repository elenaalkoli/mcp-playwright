import { Locator, Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly navigation: Locator;
  readonly homeLink: Locator;
  readonly booksLink: Locator;
  readonly toolsLink: Locator;
  readonly signInLink: Locator;
  readonly subscribeLink: Locator;
  readonly firstArticleLink: Locator;
  readonly nextPageLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = page.getByRole('navigation');
    this.homeLink = this.navigation.getByRole('link', { name: /home/i });
    this.booksLink = this.navigation.getByRole('link', { name: /books/i });
    this.toolsLink = this.navigation.getByRole('link', { name: /tools/i });
    this.signInLink = page.getByRole('link', { name: /sign in/i });
    this.subscribeLink = page.getByRole('link', { name: /subscribe/i });
    this.firstArticleLink = page.locator('article').first().locator('a').first();
    this.nextPageLink = page.locator('a', { hasText: /page\s*2|older posts|next|see all/i }).first();
  }

  async goto() {
    return this.page.goto('/');
  }

  async openBooks() {
    await Promise.all([
      this.page.waitForURL('**/books/'),
      this.booksLink.click(),
    ]);
    return new BooksPage(this.page);
  }

  async openTools() {
    await Promise.all([
      this.page.waitForURL('**/tools/'),
      this.toolsLink.click(),
    ]);
    return new ToolsPage(this.page);
  }

  async openSignIn() {
    await Promise.all([
      this.page.waitForURL('**/#/portal/signin', { timeout: 10000 }),
      this.signInLink.click(),
    ]);
  }

  async openSubscribe() {
    await Promise.all([
      this.page.waitForURL('**/#/portal/signup', { timeout: 10000 }),
      this.subscribeLink.click(),
    ]);
  }

  async openLatestArticle() {
    const articleHref = await this.firstArticleLink.getAttribute('href');
    if (!articleHref) {
      throw new Error('Latest article link not found on the homepage');
    }

    await Promise.all([
      this.page.waitForResponse((response) => response.url().endsWith(articleHref) && response.status() === 200),
      this.firstArticleLink.click(),
    ]);

    return new ArticlePage(this.page);
  }

  async clickNextPage() {
    await Promise.all([
      this.page.waitForURL('**/page/2/'),
      this.nextPageLink.click(),
    ]);
    return new PaginationPage(this.page);
  }

  async expectSeoMetadata() {
    await expect(this.page.locator('head link[rel="canonical"]')).toHaveCount(1);
    await expect(this.page.locator('head meta[property="og:title"]')).toHaveAttribute(
      'content',
      /MW Test Consultancy/i,
    );
    await expect(this.page.locator('head meta[property="og:description"]')).toHaveAttribute(
      'content',
      /quality|testing|development|AI/i,
    );
    await expect(this.page.locator('head meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      /MW Test Consultancy/i,
    );
    await expect(this.page.locator('head meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      /quality|testing|development|AI/i,
    );
  }
}

export class BooksPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: /books/i });
  }
}

export class ToolsPage {
  readonly page: Page;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: /software testing tools/i });
  }
}

export class ArticlePage {
  readonly page: Page;
  readonly title: Locator;
  readonly author: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { level: 1 });
    this.author = page.getByText(/By\s+/i);
  }
}

export class PaginationPage {
  readonly page: Page;
  readonly pageMarker: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageMarker = page.locator('text=/page\\s*2|older posts|see all/i');
  }
}
