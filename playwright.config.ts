import { defineConfig, devices } from '@playwright/test';

const hasExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;
const webServerCommand = process.env.PW_WEB_SERVER_COMMAND || 'npm run dev';
const e2eEnvPrefix =
  'E2E_TEST=true NEXT_PUBLIC_DISABLE_CLERK=1 NEXT_PUBLIC_DISABLE_ROLLBAR=1';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 1, // Add retry for local development
  timeout: 60000, // Increase test timeout to 60 seconds
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: './tests/e2e/global-setup.ts',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 30000, // Increase action timeout
    navigationTimeout: 60000, // Increase navigation timeout
  },
  webServer: hasExternalBase
    ? undefined
    : {
        command: `${e2eEnvPrefix} ${webServerCommand}`,
        port: 3000,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: ['--incognito'],
        },
      },
    },
  ],
});
