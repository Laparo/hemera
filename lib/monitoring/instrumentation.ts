/**
 * Rollbar initialization for Next.js App Router
 * Ensures Rollbar is properly configured on both server and client side
 */

import { rollbar } from '@/lib/monitoring/rollbar';

// Initialize Rollbar on app startup
if (typeof window === 'undefined') {
  // Server-side initialization
  console.log('🔧 Rollbar server monitoring initialized');
} else {
  // Client-side initialization will be handled by rollbar-client.ts
  console.log('🔧 Rollbar client monitoring ready');
}

// Export for Next.js instrumentation
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('📊 Rollbar instrumentation registered for Node.js runtime');
  }
}

export default rollbar;
