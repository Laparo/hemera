'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ReactNode } from 'react';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface StripeProviderProps {
  children: ReactNode;
}

export default function StripeProvider({ children }: StripeProviderProps) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error: Stripe payment processing is not configured. Missing publishable
        key.
      </div>
    );
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
