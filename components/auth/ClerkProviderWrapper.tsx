'use client';

import { clerkConfig } from '@/lib/auth/clerk-config';
import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

export default function ClerkProviderWrapper({
  children,
}: ClerkProviderWrapperProps) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    // ERROR: Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error: Clerk authentication is not configured. Missing publishable key.
      </div>
    );
  }

  // Only log config in development to avoid hydration issues
  if (process.env.NODE_ENV === 'development') {
    // Clerk Config logged in development mode only
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl={clerkConfig.signInUrl}
      signUpUrl={clerkConfig.signUpUrl}
      signInFallbackRedirectUrl={clerkConfig.signInFallbackRedirectUrl}
      signUpFallbackRedirectUrl={clerkConfig.signUpFallbackRedirectUrl}
      signInForceRedirectUrl={clerkConfig.signInForceRedirectUrl}
      signUpForceRedirectUrl={clerkConfig.signUpForceRedirectUrl}
    >
      {children}
    </ClerkProvider>
  );
}
