import { defineConfig, devices } from '@playwright/test';

const hasExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;
const webServerCommand = process.env.PW_WEB_SERVER_COMMAND || 'npm run dev';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: hasExternalBase
    ? undefined
    : {
        command: webServerCommand,
        port: 3000,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
