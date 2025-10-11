/**
 * Auth Providers API route
 * Returns available authentication providers for the application
 */

import { withErrorHandling } from '@/lib/errors';
import { NextResponse } from 'next/server';

export const GET = withErrorHandling(async () => {
  // Define the available auth providers as expected by the contract
  const providers = ['google', 'github', 'microsoft', 'apple', 'credentials'];

  return NextResponse.json({
    providers,
    count: providers.length,
  });
});
