import { Locator, expect, type Page } from '@playwright/test';
import { BooksPage } from './BooksPage';
import { ToolsPage } from './ToolsPage';
import { ArticlePage } from './ArticlePage';
import { PaginationPage } from './PaginationPage';
import { BasePage } from './BasePage';

const SEO_TITLE_PATTERN = /MW Test Consultancy/i;
const SEO_DESCRIPTION_PATTERN = /quality|testing|development|AI/i;

export class HomePage extends BasePage {
  readonly homePath = '/';
  readonly navigation: Locator;
  readonly homeLink: Locator;
  readonly booksLink: Locator;
  readonly toolsLink: Locator;
  readonly signInLink: Locator;
  readonly subscribeLink: Locator;
  readonly firstArticleLink: Locator;
  readonly nextPageLink: Locator;
  readonly canonicalLink: Locator;
  readonly ogTitleMeta: Locator;
  readonly ogDescriptionMeta: Locator;
  readonly twitterTitleMeta: Locator;
  readonly twitterDescriptionMeta: Locator;

  constructor(page: Page) {
    super(page);
    this.navigation = page.getByRole('navigation');
    this.homeLink = this.navigation.getByRole('link', { name: /^home$/i });
    this.booksLink = this.navigation.getByRole('link', { name: /^books$/i });
    this.toolsLink = this.navigation.getByRole('link', { name: /^tools$/i });
    this.signInLink = page.getByRole('link', { name: /^sign in$/i });
    this.subscribeLink = page.getByRole('link', { name: /^subscribe$/i });
    this.firstArticleLink = page.locator('main article a').first();
    this.nextPageLink = page.getByRole('link', { name: /(see all|next|older posts)/i }).first();
    this.canonicalLink = page.locator('head link[rel="canonical"]');
    this.ogTitleMeta = page.locator('head meta[property="og:title"]');
    this.ogDescriptionMeta = page.locator('head meta[property="og:description"]');
    this.twitterTitleMeta = page.locator('head meta[name="twitter:title"]');
    this.twitterDescriptionMeta = page.locator('head meta[name="twitter:description"]');
  }

  async goto() {
    return this.page.goto(this.homePath);
  }

  private async clickLinkAndWaitForHref(link: Locator) {
    const href = await link.getAttribute('href');
    if (!href) {
      throw new Error('Link href not found');
    }

    if (href.startsWith('#')) {
      const destination = new URL(href, this.page.url()).href;
      await this.page.goto(destination, { waitUntil: 'load' });
      return;
    }

    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'load' }),
      link.click(),
    ]);
  }

  async openBooks() {
    await this.clickLinkAndWaitForHref(this.booksLink);
    return new BooksPage(this.page);
  }

  async openTools() {
    await this.clickLinkAndWaitForHref(this.toolsLink);
    return new ToolsPage(this.page);
  }

  async openSignIn() {
    await this.clickLinkAndWaitForHref(this.signInLink);
  }

  async openSubscribe() {
    await this.clickLinkAndWaitForHref(this.subscribeLink);
  }

  async openLatestArticle() {
    await this.clickLinkAndWaitForHref(this.firstArticleLink);
    return new ArticlePage(this.page);
  }

  async clickNextPage() {
    await this.clickLinkAndWaitForHref(this.nextPageLink);
    return new PaginationPage(this.page);
  }

  async expectSeoMetadata() {
    await expect(this.canonicalLink).toHaveCount(1);
    await expect(this.ogTitleMeta).toHaveAttribute('content', SEO_TITLE_PATTERN);
    await expect(this.ogDescriptionMeta).toHaveAttribute('content', SEO_DESCRIPTION_PATTERN);
    await expect(this.twitterTitleMeta).toHaveAttribute('content', SEO_TITLE_PATTERN);
    await expect(this.twitterDescriptionMeta).toHaveAttribute('content', SEO_DESCRIPTION_PATTERN);
  }
}
