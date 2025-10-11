import {
  PaymentProcessingError,
  StripeConfigurationError,
  logError,
} from '@/lib/errors';
import Stripe from 'stripe';
import { STRIPE_API_VERSION } from '../stripe/config';
import { PaymentStatus } from './course';

/**
 * Stripe Service
 *
 * Handles all Stripe payment processing including:
 * - Checkout session creation
 * - Payment intent management
 * - Webhook event processing
 * - Customer management
 */

export class StripeService {
  private stripe: Stripe | null = null;

  constructor() {
    // Skip Stripe initialization during build time
    const isBuildTime =
      process.env.NODE_ENV === 'production' && !process.env.STRIPE_SECRET_KEY;

    if (isBuildTime) {
      console.log('⚠️ Build time detected - skipping Stripe initialization');
      return;
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      throw new StripeConfigurationError('STRIPE_SECRET_KEY');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: STRIPE_API_VERSION,
      typescript: true,
    });
  }

  private ensureStripe(): Stripe {
    if (!this.stripe) {
      throw new Error(
        'Stripe not initialized - service unavailable during build'
      );
    }
    return this.stripe;
  }

  /**
   * Create checkout session for course booking
   */
  async createCheckoutSession(params: {
    courseId: string;
    courseName: string;
    coursePrice: number;
    userId: string;
    userEmail: string;
    successUrl: string;
    cancelUrl: string;
    bookingId?: string;
  }): Promise<{ sessionId: string; url: string }> {
    try {
      const {
        courseId,
        courseName,
        coursePrice,
        userId,
        userEmail,
        successUrl,
        cancelUrl,
        bookingId,
      } = params;

      // For free courses, return a mock session
      if (coursePrice === 0) {
        return {
          sessionId: `cs_free_${courseId}_${userId}_${Date.now()}`,
          url: successUrl,
        };
      }

      const session = await this.ensureStripe().checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: courseName,
                description: `Course booking for ${courseName}`,
              },
              unit_amount: coursePrice, // Amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: userEmail,
        metadata: {
          courseId,
          userId,
          bookingType: 'course',
          ...(bookingId && { bookingId }),
        },
        payment_intent_data: {
          metadata: {
            courseId,
            userId,
            ...(bookingId && { bookingId }),
          },
        },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
      });

      if (!session.id || !session.url) {
        throw new PaymentProcessingError(
          'Stripe session creation returned incomplete data'
        );
      }

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      if (
        error instanceof PaymentProcessingError ||
        error instanceof StripeConfigurationError
      ) {
        throw error; // Re-throw our custom errors
      }

      logError(error, { operation: 'createCheckoutSession', params });
      throw new PaymentProcessingError(
        error instanceof Error
          ? error.message
          : 'Unknown error during checkout session creation'
      );
    }
  }

  /**
   * Retrieve checkout session details
   */
  async getCheckoutSession(
    sessionId: string
  ): Promise<Stripe.Checkout.Session> {
    try {
      const session = await this.ensureStripe().checkout.sessions.retrieve(
        sessionId,
        {
          expand: ['payment_intent'],
        }
      );

      return session;
    } catch (error) {
      logError(error, { operation: 'getCheckoutSession', sessionId });
      throw new PaymentProcessingError(
        `Failed to retrieve session: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Process webhook events
   */
  async processWebhookEvent(
    payload: string,
    signature: string
  ): Promise<{
    eventId: string;
    eventType: string;
    processed: boolean;
    data?: any;
  }> {
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new StripeConfigurationError('STRIPE_WEBHOOK_SECRET');
      }

      // Verify webhook signature
      const event = this.ensureStripe().webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      console.log(`Processing webhook event: ${event.type} (${event.id})`);

      const result = {
        eventId: event.id,
        eventType: event.type,
        processed: false,
        data: undefined as any,
      };

      switch (event.type) {
        case 'checkout.session.completed':
          result.data = await this.handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session
          );
          result.processed = true;
          break;

        case 'checkout.session.expired':
          result.data = await this.handleCheckoutSessionExpired(
            event.data.object as Stripe.Checkout.Session
          );
          result.processed = true;
          break;

        case 'payment_intent.succeeded':
          result.data = await this.handlePaymentIntentSucceeded(
            event.data.object as Stripe.PaymentIntent
          );
          result.processed = true;
          break;

        case 'payment_intent.payment_failed':
          result.data = await this.handlePaymentIntentFailed(
            event.data.object as Stripe.PaymentIntent
          );
          result.processed = true;
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
          result.processed = false;
      }

      return result;
    } catch (error) {
      console.error('Webhook processing failed:', error);

      if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
        throw new Error('Invalid webhook signature');
      }

      throw new Error(
        `Webhook processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Handle successful checkout session
   */
  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ): Promise<{
    sessionId: string;
    courseId: string;
    userId: string;
    paymentStatus: PaymentStatus;
    paymentIntentId?: string;
  }> {
    const { courseId, userId } = session.metadata || {};

    if (!courseId || !userId) {
      throw new Error('Missing required metadata in checkout session');
    }

    return {
      sessionId: session.id,
      courseId,
      userId,
      paymentStatus: PaymentStatus.PAID,
      paymentIntentId:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id,
    };
  }

  /**
   * Handle expired checkout session
   */
  private async handleCheckoutSessionExpired(
    session: Stripe.Checkout.Session
  ): Promise<{
    sessionId: string;
    courseId: string;
    userId: string;
    paymentStatus: PaymentStatus;
  }> {
    const { courseId, userId } = session.metadata || {};

    if (!courseId || !userId) {
      throw new Error('Missing required metadata in expired checkout session');
    }

    return {
      sessionId: session.id,
      courseId,
      userId,
      paymentStatus: PaymentStatus.CANCELLED,
    };
  }

  /**
   * Handle successful payment intent
   */
  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<{
    paymentIntentId: string;
    courseId: string;
    userId: string;
    paymentStatus: PaymentStatus;
    amount: number;
  }> {
    const { courseId, userId } = paymentIntent.metadata || {};

    if (!courseId || !userId) {
      throw new Error('Missing required metadata in payment intent');
    }

    return {
      paymentIntentId: paymentIntent.id,
      courseId,
      userId,
      paymentStatus: PaymentStatus.PAID,
      amount: paymentIntent.amount,
    };
  }

  /**
   * Handle failed payment intent
   */
  private async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<{
    paymentIntentId: string;
    courseId: string;
    userId: string;
    paymentStatus: PaymentStatus;
    failureReason?: string;
  }> {
    const { courseId, userId } = paymentIntent.metadata || {};

    if (!courseId || !userId) {
      throw new Error('Missing required metadata in failed payment intent');
    }

    return {
      paymentIntentId: paymentIntent.id,
      courseId,
      userId,
      paymentStatus: PaymentStatus.FAILED,
      failureReason: paymentIntent.last_payment_error?.message,
    };
  }

  /**
   * Create refund for payment
   */
  async createRefund(params: {
    paymentIntentId: string;
    amount?: number;
    reason?: 'requested_by_customer' | 'duplicate' | 'fraudulent';
    metadata?: Record<string, string>;
  }): Promise<{
    refundId: string;
    amount: number;
    status: string;
  }> {
    try {
      const {
        paymentIntentId,
        amount,
        reason = 'requested_by_customer',
        metadata,
      } = params;

      const refund = await this.ensureStripe().refunds.create({
        payment_intent: paymentIntentId,
        amount,
        reason,
        metadata,
      });

      return {
        refundId: refund.id,
        amount: refund.amount,
        status: refund.status || 'unknown',
      };
    } catch (error) {
      console.error('Refund creation failed:', error);
      throw new Error(
        `Failed to create refund: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(paymentIntentId: string): Promise<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    created: number;
    metadata: Record<string, string>;
  }> {
    try {
      const paymentIntent =
        await this.ensureStripe().paymentIntents.retrieve(paymentIntentId);

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: paymentIntent.created,
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      console.error('Failed to retrieve payment details:', error);
      throw new Error(
        `Failed to get payment details: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Create customer in Stripe
   */
  async createCustomer(params: {
    email: string;
    name?: string;
    userId: string;
  }): Promise<{
    customerId: string;
    email: string;
  }> {
    try {
      const { email, name, userId } = params;

      const customer = await this.ensureStripe().customers.create({
        email,
        name,
        metadata: {
          userId,
        },
      });

      return {
        customerId: customer.id,
        email: customer.email || email,
      };
    } catch (error) {
      console.error('Customer creation failed:', error);
      throw new Error(
        `Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate webhook signature (utility method)
   */
  validateWebhookSignature(payload: string, signature: string): boolean {
    try {
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return false;
      }

      this.ensureStripe().webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get Stripe publishable key for frontend
   */
  getPublishableKey(): string {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required');
    }

    return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  }
}

// Export singleton instance
export const stripeService = new StripeService();

// Export convenience functions
export const createCheckoutSession = (
  params: Parameters<StripeService['createCheckoutSession']>[0]
) => stripeService.createCheckoutSession(params);

export const processWebhookEvent = (payload: string, signature: string) =>
  stripeService.processWebhookEvent(payload, signature);

export const getCheckoutSession = (sessionId: string) =>
  stripeService.getCheckoutSession(sessionId);

export const createRefund = (
  params: Parameters<StripeService['createRefund']>[0]
) => stripeService.createRefund(params);

export const getPaymentDetails = (paymentIntentId: string) =>
  stripeService.getPaymentDetails(paymentIntentId);
