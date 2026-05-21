import { Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class BooksPage extends BasePage {
  readonly title: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByRole('heading', { level: 1 });
  }
}
