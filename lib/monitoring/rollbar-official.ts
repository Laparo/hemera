/**
 * Rollbar Configuration following official Next.js documentation
 * https://docs.rollbar.com/docs/nextjs
 */

import Rollbar from 'rollbar';

const isE2EMode =
  process.env.E2E_TEST === 'true' ||
  process.env.NEXT_PUBLIC_DISABLE_ROLLBAR === '1';

const baseConfig = {
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV,
  enabled: !isE2EMode,
};

// Client-side configuration (for React components)
export const clientConfig = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  ...baseConfig,
};

// Server-side instance (for API routes and server components)
// In E2E mode, use a dummy token to prevent initialization errors
export const serverInstance = new Rollbar({
  accessToken: isE2EMode
    ? 'dummy-token-for-e2e'
    : process.env.ROLLBAR_SERVER_TOKEN,
  ...baseConfig,
});

// Legacy compatibility - keeping old configuration exports
export const rollbarConfig = {
  accessToken:
    process.env.ROLLBAR_SERVER_TOKEN || process.env.ROLLBAR_SERVER_ACCESS_TOKEN,
  ...baseConfig,
};

export const rollbar = serverInstance;

// Client-side configuration with legacy fallback
export const clientRollbarConfig = {
  accessToken:
    process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN ||
    process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_ACCESS_TOKEN,
  ...baseConfig,
};
