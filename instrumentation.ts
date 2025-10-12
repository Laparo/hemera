/**
 * Next.js Instrumentation for Rollbar
 * Following official documentation: https://docs.rollbar.com/docs/nextjs
 */

import { serverInstance } from '@/lib/monitoring/rollbar-official';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize Rollbar for error tracking

    // Register error handlers
    process.on('uncaughtException', error => {
      serverInstance.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    });

    process.on('unhandledRejection', (reason, promise) => {
      serverInstance.error('Unhandled Promise Rejection', {
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
        timestamp: new Date().toISOString(),
      });
    });
  }
}
