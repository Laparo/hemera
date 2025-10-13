'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode } from 'react';

// Initialize Stripe with publishable key (lazily, guard against missing key)
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : undefined;

interface StripeProviderProps {
  children: ReactNode;
}

export default function StripeProvider({ children }: StripeProviderProps) {
  // If no publishable key is configured, don't block the app – just render children.
  // Payment-related pages/components should handle missing configuration explicitly.
  if (!publishableKey || !stripePromise) {
    return <>{children}</>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#1976d2',
            colorBackground: '#ffffff',
            colorText: '#424242',
            colorDanger: '#df1b41',
            fontFamily: 'Inter, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
        loader: 'auto',
      }}
    >
      {children}
    </Elements>
  );
}
