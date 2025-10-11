/**
 * Rollbar Configuration following official Next.js documentation
 * https://docs.rollbar.com/docs/nextjs
 */

import Rollbar from 'rollbar';

const baseConfig = {
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: process.env.NODE_ENV,
};

// Client-side configuration (for React components)
export const clientConfig = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN,
  ...baseConfig,
};

// Server-side instance (for API routes and server components)
export const serverInstance = new Rollbar({
  accessToken: process.env.ROLLBAR_SERVER_TOKEN,
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
