import { expect, test } from '@playwright/test';
import { auditedRoutes } from './routes';

const requiredMetadata = [
  'meta[name="description"]',
  'link[rel="canonical"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:url"]',
  'meta[property="og:image"]',
  'meta[name="twitter:card"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
  'meta[name="twitter:image"]',
] as const;

for (const route of auditedRoutes) {
  test(`${route.path} exposes complete metadata`, async ({ page }) => {
    const response = await page.goto(route.path, { waitUntil: 'domcontentloaded' });

    expect(response?.status(), `HTTP status for ${route.path}`).toBeLessThan(400);
    await expect(page).toHaveTitle(/\S+/);
    await expect(page.locator('html')).toHaveAttribute('lang', route.locale);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);

    for (const selector of requiredMetadata) {
      const element = page.locator(selector);
      const attribute = selector.startsWith('link') ? 'href' : 'content';
      await expect(element, `${selector} on ${route.path}`).toHaveCount(1);
      await expect(element).toHaveAttribute(attribute, /\S+/);
    }

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(() => new URL(canonical ?? '')).not.toThrow();

    for (const locale of ['en', 'pt-BR', 'x-default']) {
      const alternate = page.locator(`link[rel="alternate"][hreflang="${locale}"]`);
      await expect(alternate).toHaveCount(1);
      await expect(alternate).toHaveAttribute('href', /^https?:\/\//);
    }

    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots?.toLowerCase()).not.toContain('noindex');

    const structuredData = page.locator('script[type="application/ld+json"]');
    await expect(structuredData).toHaveCount(1);
    expect(JSON.parse((await structuredData.textContent()) ?? '{}')).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Person',
    });
  });
}
