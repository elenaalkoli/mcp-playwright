import { Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PaginationPage extends BasePage {
  readonly pageMarker: Locator;

  constructor(page: Page) {
    super(page);
    this.pageMarker = page.getByRole('article').first();
  }
}
