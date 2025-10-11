/**
 * Auth Providers API route
 * Returns available authentication providers for the application
 */

import { NextResponse } from 'next/server';
import { withErrorHandling, logError } from '@/lib/errors';

export const GET = withErrorHandling(async () => {
  // Define the available auth providers as expected by the contract
  const providers = ['google', 'github', 'microsoft', 'apple', 'credentials'];

  return NextResponse.json({
    providers,
    count: providers.length,
  });
});
