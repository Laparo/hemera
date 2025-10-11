/**
 * Next.js Instrumentation for Rollbar
 * Following official documentation: https://docs.rollbar.com/docs/nextjs
 */

import { serverInstance } from '@/lib/monitoring/rollbar-official';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation
    console.log('Initializing Rollbar server-side instrumentation');

    // Set up global error handlers
    process.on('uncaughtException', error => {
      serverInstance.critical(error, { context: 'uncaughtException' });
      console.error('Uncaught Exception:', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      serverInstance.error('Unhandled Rejection', {
        reason,
        promise,
        context: 'unhandledRejection',
      });
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
  }
}
