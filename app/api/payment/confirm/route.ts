import { updateBookingStatus } from '@/lib/services/booking';
import { retrievePaymentIntent } from '@/lib/services/stripe';
import { serverInstance } from '@/lib/monitoring/rollbar-official';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { paymentIntentId } = await request.json();
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      );
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await retrievePaymentIntent(paymentIntentId);

    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'Payment Intent not found' },
        { status: 404 }
      );
    }

    // Verify payment belongs to authenticated user
    if (paymentIntent.metadata?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update booking status based on payment status
    if (paymentIntent.status === 'succeeded') {
      const bookingId = paymentIntent.metadata?.bookingId;
      if (bookingId) {
        await updateBookingStatus({
          id: bookingId,
          status: 'CONFIRMED',
          stripePaymentIntentId: paymentIntent.id,
        });
      }

      return NextResponse.json({
        status: 'succeeded',
        bookingId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentIntentId: paymentIntent.id,
      });
    }

    return NextResponse.json({
      status: paymentIntent.status,
      message: getPaymentStatusMessage(paymentIntent.status),
    });
  } catch (error) {
    serverInstance.error('Payment confirmation failed', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}

function getPaymentStatusMessage(status: string): string {
  switch (status) {
    case 'succeeded':
      return 'Payment successful!';
    case 'processing':
      return 'Payment is processing...';
    case 'requires_payment_method':
      return 'Payment failed. Please try again.';
    case 'requires_confirmation':
      return 'Payment requires confirmation.';
    case 'requires_action':
      return 'Payment requires additional action.';
    case 'canceled':
      return 'Payment was canceled.';
    default:
      return 'Payment status unknown.';
  }
}
