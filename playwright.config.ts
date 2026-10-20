import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'site.spec.ts',
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  outputDir: 'test-results',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    browserName: 'chromium',
    viewport: { width: 1280, height: 800 },
    screenshot: 'off',
    video: 'off',
    trace: 'off',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'npm run serve -- --port 4173',
    url: 'http://127.0.0.1:4173/Playtrove-site/',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
