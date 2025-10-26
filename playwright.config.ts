import { defineConfig, devices } from '@playwright/test';

// Allow flexible local ports and base URLs for Playwright runs
const pwPort = Number(process.env.PW_PORT || 3000);
const hasExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;
// If no explicit command is provided, run Next dev on the configured port
const webServerCommand =
  process.env.PW_WEB_SERVER_COMMAND || `npx next dev -p ${pwPort}`;
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
    baseURL: process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${pwPort}`,
    // If Vercel preview is SSO-protected, you can bypass protection by providing
    // a token via env VERCEL_PROTECTION_BYPASS (or VERCEL_BYPASS). This will be
    // sent as the required header for all requests, including APIRequestContext.
    extraHTTPHeaders: (() => {
      const token =
        process.env.VERCEL_PROTECTION_BYPASS || process.env.VERCEL_BYPASS;
      return token ? { 'x-vercel-protection-bypass': token } : undefined;
    })(),
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
        port: pwPort,
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
