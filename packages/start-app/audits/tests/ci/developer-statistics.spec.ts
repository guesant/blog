import { expect, test } from '@playwright/test';

const cases = [
  {
    path: '/about',
    region: 'GitHub statistics',
    labels: [
      'Contributions in the last year',
      'Public repositories',
      'Stars received',
      'Followers',
    ],
  },
  {
    path: '/pt-BR/about',
    region: 'Estatísticas do GitHub',
    labels: [
      'Contribuições no último ano',
      'Repositórios públicos',
      'Estrelas recebidas',
      'Seguidores',
    ],
  },
] as const;

for (const testCase of cases) {
  test(`${testCase.path} renders the versioned GitHub statistics natively`, async ({ page }) => {
    await page.goto(testCase.path, { waitUntil: 'networkidle' });

    const statistics = page.getByRole('region', { name: testCase.region });
    await expect(statistics).toBeVisible();
    for (const label of testCase.labels) {
      await expect(statistics.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(statistics.getByRole('link', { name: /@guesant/ })).toHaveAttribute(
      'href',
      'https://github.com/guesant',
    );
    await expect(statistics.locator('img')).toHaveCount(0);
  });
}
