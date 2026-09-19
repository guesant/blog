import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

const performanceBaseURL = process.env.PERFORMANCE_BASE_URL ?? 'http://127.0.0.1:3001';
const performancePort = process.env.PERFORMANCE_PORT ?? '3001';

export default defineConfig({
  ...baseConfig,
  testDir: './tests/performance',
  timeout: 300_000,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    ...baseConfig.use,
    baseURL: performanceBaseURL,
    trace: 'off',
    screenshot: 'off',
    video: 'off',
    contextOptions: {
      reducedMotion: 'no-preference',
    },
  },
  webServer: {
    ...baseConfig.webServer,
    command: `HOSTNAME=0.0.0.0 PORT=${performancePort} ${process.execPath} ../dist/server/server.js`,
    url: performanceBaseURL,
  },
});
