import { Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
  readonly title: Locator;
  readonly author: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByRole('heading', { level: 1 });
    this.author = page.getByRole('heading', { level: 4, name: /Mark Winteringham/i });
  }
}
