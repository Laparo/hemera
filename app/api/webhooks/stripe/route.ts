import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Safety check for localhost development
const isLocalhost = process.env.NEXT_PUBLIC_APP_URL?.includes('localhost');
const stripeKey = process.env.STRIPE_SECRET_KEY!;

if (isLocalhost && !stripeKey.startsWith('sk_test_')) {
  console.warn(
    '⚠️  WARNING: Using live Stripe key on localhost! This should be a test key.'
  );
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-09-30.clover',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Processing Stripe webhook event:', event.type);

    // Process the webhook event based on type
    let result = { success: true, processed: false };

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);

        // Update booking status to PAID
        // TODO: Implement booking status update logic
        result.processed = true;
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent succeeded:', paymentIntent.id);
        result.processed = true;
        break;

      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment intent failed:', failedPaymentIntent.id);
        result.processed = true;
        break;

      default:
        console.log('Unhandled event type:', event.type);
        result.processed = false;
    }

    if (result.success) {
      console.log('Webhook processed successfully:', result);
      return NextResponse.json({ received: true, ...result });
    } else {
      console.error('Webhook processing failed:', result);
      return NextResponse.json(
        { error: 'Webhook processing failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
