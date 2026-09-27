import { expect, test } from '@playwright/test';

test('keeps the main content visible during client navigation', async ({ page }) => {
  await page.goto('/pt-BR/', { waitUntil: 'domcontentloaded' });

  const mainContent = page.locator('#main-content');

  await expect(mainContent).toBeVisible();
  await expect(mainContent).not.toBeEmpty();

  await page.locator('a[href*="/findings"]').first().click();

  await expect(page).toHaveURL(/\/pt-BR\/findings/);
  await expect(mainContent).toBeVisible();
  await expect(mainContent).not.toBeEmpty();
  await expect(mainContent).not.toHaveCSS('opacity', '0');
});
