import { expect, test } from '@playwright/test';

test('robots.txt is served and points at the sitemap', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/plain');

  const body = await response.text();
  expect(body).toMatch(/User-agent: \*/i);
  expect(body).toMatch(/Sitemap: https?:\/\/\S+\/sitemap\.xml/i);
});

test('robots.txt opts AI training crawlers out', async ({ request }) => {
  const response = await request.get('/robots.txt');
  const body = await response.text();
  expect(body).toMatch(/User-agent: GPTBot[\s\S]*?Disallow: \//i);
});

test('sitemap.xml is served with well-formed, absolute entries', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('xml');

  const body = await response.text();
  expect(body).toMatch(/<urlset[^>]*>/);

  const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  expect(urls.length).toBeGreaterThan(0);
  for (const url of urls) {
    expect(() => new URL(url)).not.toThrow();
    expect(url).toMatch(/^https?:\/\//);
  }
});

test('manifest.webmanifest is served and valid', async ({ request }) => {
  const response = await request.get('/manifest.webmanifest');
  expect(response.status()).toBe(200);

  const manifest = await response.json();
  expect(manifest.name).toMatch(/\S+/);
  expect(manifest.icons?.length).toBeGreaterThan(0);
});

for (const locale of ['en', 'pt-BR']) {
  test(`resume-${locale}.pdf is served as a PDF`, async ({ request }) => {
    const response = await request.get(`/resume-${locale}.pdf`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    const body = await response.body();
    expect(body.subarray(0, 5).toString('latin1')).toBe('%PDF-');
  });
}
