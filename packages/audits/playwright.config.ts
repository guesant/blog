import { chromium, defineConfig, devices } from '@playwright/test';

const baseURL = process.env.CI_BASE_URL ?? 'http://127.0.0.1:3000';
const executablePath = process.env.CHROME_PATH ?? chromium.executablePath();

export default defineConfig({
  testDir: './tests/ci',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: '50%',
  reporter: process.env.CI
    ? [['dot'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : 'dot',
  use: {
    baseURL,
    browserName: 'chromium',
    colorScheme: 'light',
    locale: 'en-US',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath,
      args: ['--no-sandbox', '--disable-dev-shm-usage'],
    },
  },
  projects: [
    {
      name: 'desktop-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `HOSTNAME=0.0.0.0 ${process.execPath} ../next-app/.next/standalone/packages/next-app/server.js`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
