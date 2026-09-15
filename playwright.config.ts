/**
 * Playwright config — Lane F.
 *
 * The repo is Next.js (not Vite, as the playbooks originally assumed), so the test server is
 * a production build served by `next start`: tests see what the jury will see, not dev mode.
 */
import { defineConfig } from '@playwright/test';

const PORT = 4174;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    screenshot: 'on',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile',
      testIgnore: /demo-path\.spec\.ts/,
      use: { browserName: 'chromium', viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
    },
    {
      name: 'desktop',
      testIgnore: /demo-path\.spec\.ts/,
      use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } },
    },
    {
      // The demo path gets video, so a failure can be watched rather than guessed at.
      name: 'demo-path',
      testMatch: /demo-path\.spec\.ts/,
      use: { browserName: 'chromium', viewport: { width: 1280, height: 800 }, video: 'on' },
    },
  ],
  webServer: {
    command: `pnpm next start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
