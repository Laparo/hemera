'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { clerkConfig } from '@/lib/auth/clerk-config';
import { ReactNode } from 'react';

interface ClerkProviderWrapperProps {
  children: ReactNode;
}

export default function ClerkProviderWrapper({
  children,
}: ClerkProviderWrapperProps) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.error('ERROR: Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error: Clerk authentication is not configured. Missing publishable key.
      </div>
    );
  }

  // Only log config in development to avoid hydration issues
  if (process.env.NODE_ENV === 'development') {
    console.log('Clerk Config:', {
      publishableKey: publishableKey.substring(0, 15) + '...',
      signInUrl: clerkConfig.signInUrl,
      signUpUrl: clerkConfig.signUpUrl,
      afterSignInUrl: clerkConfig.afterSignInUrl,
      afterSignUpUrl: clerkConfig.afterSignUpUrl,
    });
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      afterSignInUrl={clerkConfig.afterSignInUrl}
      afterSignUpUrl={clerkConfig.afterSignUpUrl}
      signInUrl={clerkConfig.signInUrl}
      signUpUrl={clerkConfig.signUpUrl}
    >
      {children}
    </ClerkProvider>
  );
}
