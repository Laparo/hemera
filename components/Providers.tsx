'use client';

import ErrorBoundary from '@/components/ErrorBoundary';
import ThemeRegistry from '@/components/ThemeRegistry';
import ClerkProviderWrapper from '@/components/auth/ClerkProviderWrapper';
import StripeProvider from '@/components/payment/StripeProvider';
import ConditionalPublicNavigation from '@/components/navigation/ConditionalPublicNavigation';
import { RollbarProviderWrapper } from '@/lib/monitoring/rollbar-react-official';
import * as React from 'react';

type ProvidersProps = {
  children: React.ReactNode;
  isE2E: boolean;
};

export default function Providers({ children, isE2E }: ProvidersProps) {
  return (
    <ClerkProviderWrapper>
      {isE2E ? (
        // In E2E mode: skip Rollbar/Stripe to reduce overhead and flakiness
        <ThemeRegistry>
          <ErrorBoundary>
            <ConditionalPublicNavigation />
            {children}
          </ErrorBoundary>
        </ThemeRegistry>
      ) : (
        <RollbarProviderWrapper>
          <ThemeRegistry>
            <StripeProvider>
              <ErrorBoundary>
                <ConditionalPublicNavigation />
                {children}
              </ErrorBoundary>
            </StripeProvider>
          </ThemeRegistry>
        </RollbarProviderWrapper>
      )}
    </ClerkProviderWrapper>
  );
}
