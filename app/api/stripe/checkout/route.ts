import { canUserBookCourse, createBooking } from '@/lib/services/booking';
import { getCourseById } from '@/lib/services/course';
import { createCheckoutSession } from '@/lib/services/stripe';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Request validation schema for Stripe checkout
 */
const createCheckoutSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

/**
 * Rate limiting: Simple in-memory store (for production, use Redis)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

/**
 * POST /api/stripe/checkout
 * Create a Stripe checkout session for course booking
 *
 * Features:
 * - Authentication via Clerk
 * - Input validation with Zod
 * - Rate limiting per user
 * - Course availability validation
 * - Booking conflict detection
 * - Comprehensive error handling
 * - Structured logging
 */
export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[${requestId}] Starting checkout creation`);

  try {
    // Authentication
    const { userId } = await auth();
    if (!userId) {
      console.warn(`[${requestId}] Unauthorized access attempt`);
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    console.log(`[${requestId}] User authenticated: ${userId}`);

    // Rate limiting
    if (!checkRateLimit(userId)) {
      console.warn(`[${requestId}] Rate limit exceeded for user: ${userId}`);
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          code: 'RATE_LIMITED',
        },
        { status: 429 }
      );
    }

    // Input validation
    const body = await request.json();
    const validatedData = createCheckoutSchema.parse(body);
    console.log(
      `[${requestId}] Request validated for course: ${validatedData.courseId}`
    );

    // Get user details from Clerk
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail =
      user.emailAddresses[0]?.emailAddress || 'noreply@example.com';

    // Verify course exists and is available
    const course = await getCourseById(validatedData.courseId);
    if (!course) {
      console.warn(
        `[${requestId}] Course not found: ${validatedData.courseId}`
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Course not found',
          code: 'COURSE_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    if (!course.isPublished) {
      console.warn(
        `[${requestId}] Course not published: ${validatedData.courseId}`
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Course is not available for booking',
          code: 'COURSE_NOT_PUBLISHED',
        },
        { status: 400 }
      );
    }

    // Check booking eligibility and conflicts
    const eligibility = await canUserBookCourse(userId, course.id);
    if (!eligibility.canBook) {
      console.warn(`[${requestId}] Booking not allowed: ${eligibility.reason}`);
      return NextResponse.json(
        {
          success: false,
          error: eligibility.reason,
          code: 'BOOKING_NOT_ALLOWED',
        },
        { status: 400 }
      );
    }

    console.log(
      `[${requestId}] Creating booking for user ${userId}, course ${course.id}`
    );

    // Create booking with PENDING status
    const booking = await createBooking({
      userId,
      courseId: course.id,
      amount: course.price * 100, // Convert to cents for Stripe
      currency: course.currency,
    });

    console.log(`[${requestId}] Booking created: ${booking.id}`);

    // Generate URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl =
      validatedData.successUrl ||
      `${baseUrl}/bookings/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`;
    const cancelUrl =
      validatedData.cancelUrl ||
      `${baseUrl}/courses/${course.id}?cancelled=true`;

    // Create Stripe checkout session
    const checkoutResult = await createCheckoutSession({
      courseId: course.id,
      courseName: course.title,
      coursePrice: course.price * 100, // Convert to cents
      userId,
      userEmail,
      successUrl,
      cancelUrl,
      bookingId: booking.id, // Pass booking ID for reference
    });

    console.log(
      `[${requestId}] Checkout session created: ${checkoutResult.sessionId}`
    );

    // Log successful checkout creation for monitoring
    console.log(`[${requestId}] Checkout creation successful`, {
      userId,
      courseId: course.id,
      bookingId: booking.id,
      sessionId: checkoutResult.sessionId,
      amount: course.price,
      currency: course.currency,
    });

    return NextResponse.json({
      success: true,
      data: {
        checkoutUrl: checkoutResult.url,
        sessionId: checkoutResult.sessionId,
        bookingId: booking.id,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
      },
    });
  } catch (error) {
    console.error(`[${requestId}] Checkout creation failed:`, error);

    // Handle specific error types
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          code: 'VALIDATION_ERROR',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      // Handle known error patterns
      if (error.message.includes('insufficient_funds')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Payment method has insufficient funds',
            code: 'INSUFFICIENT_FUNDS',
          },
          { status: 400 }
        );
      }

      if (error.message.includes('stripe')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Payment system error. Please try again.',
            code: 'PAYMENT_SYSTEM_ERROR',
          },
          { status: 502 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create checkout session',
        code: 'INTERNAL_ERROR',
        requestId, // Include request ID for support
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stripe/checkout
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Stripe checkout endpoint is operational',
    timestamp: new Date().toISOString(),
  });
}
