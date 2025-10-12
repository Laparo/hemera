'use client';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';

interface StripeCheckoutFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
  courseName: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

export default function StripeCheckoutForm({
  clientSecret,
  amount,
  currency,
  courseName,
  onSuccess,
  onError,
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    // Check if payment was already processed
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          onSuccess(paymentIntent);
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });

    setIsLoaded(true);
  }, [stripe, clientSecret, onSuccess]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/booking-success`,
        },
      });

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message || 'An error occurred.');
          onError(error.message || 'Payment failed');
        } else {
          setMessage('An unexpected error occurred.');
          onError('Unexpected error occurred');
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment succeeded!');
        onSuccess(paymentIntent);
      } else {
        setMessage('Payment processing...');
      }
    } catch (err) {
      setMessage('An unexpected error occurred.');
      onError('Unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!stripe || !elements || !isLoaded) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='200px'
      >
        <CircularProgress />
        <Typography variant='body2' sx={{ ml: 2 }}>
          Loading payment form...
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant='h6' gutterBottom>
        Complete Your Purchase
      </Typography>

      <Typography variant='body2' color='text.secondary' gutterBottom>
        Course: {courseName}
      </Typography>

      <Typography variant='h6' color='primary' gutterBottom>
        {(amount / 100).toFixed(2)} {currency.toUpperCase()}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <form onSubmit={handleSubmit} data-testid='stripe-payment-form'>
        <Box sx={{ mb: 3 }}>
          <Typography variant='subtitle2' gutterBottom>
            Payment Information
          </Typography>
          <PaymentElement
            data-testid='stripe-payment-element'
            id='payment-element'
            options={{
              layout: 'tabs',
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant='subtitle2' gutterBottom>
            Billing Address
          </Typography>
          <AddressElement
            data-testid='stripe-address-element'
            options={{
              mode: 'billing',
              allowedCountries: ['US', 'DE', 'AT', 'CH'],
            }}
          />
        </Box>

        {message && (
          <Alert
            severity={message.includes('succeeded') ? 'success' : 'error'}
            sx={{ mb: 2 }}
            data-testid='payment-message'
          >
            {message}
          </Alert>
        )}

        <Button
          type='submit'
          variant='contained'
          fullWidth
          size='large'
          disabled={isProcessing || !stripe || !elements}
          data-testid='stripe-submit-button'
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {isProcessing ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Processing...
            </>
          ) : (
            `Pay ${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`
          )}
        </Button>

        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ display: 'block', textAlign: 'center', mt: 2 }}
        >
          Secure payment powered by Stripe
        </Typography>
      </form>
    </Paper>
  );
}
