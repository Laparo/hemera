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
    console.warn('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY - using fallback');
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey || 'pk_test_fallback'}
      afterSignInUrl={clerkConfig.afterSignInUrl}
      afterSignUpUrl={clerkConfig.afterSignUpUrl}
      signInUrl={clerkConfig.signInUrl}
      signUpUrl={clerkConfig.signUpUrl}
    >
      {children}
    </ClerkProvider>
  );
}
