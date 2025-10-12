import { createBooking } from '@/lib/services/booking';
import { getCourseById } from '@/lib/services/course';
import { createPaymentIntent } from '@/lib/services/stripe';
import { serverInstance } from '@/lib/monitoring/rollbar-official';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let userId: string | null = null;
  try {
    // Authenticate user
    const authResult = await auth();
    userId = authResult.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { courseId } = await request.json();
    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Get course details
    const course = await getCourseById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Create booking with initial PENDING status
    const booking = await createBooking({
      userId,
      courseId,
      amount: course.price,
      currency: course.currency,
    });

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      // Amounts are stored in cents in our DB schema
      amount: course.price,
      currency: course.currency.toLowerCase(),
      courseId,
      userId,
      metadata: {
        courseId,
        userId,
        bookingId: booking.id,
        courseName: course.title,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: course.price,
      currency: course.currency,
      courseName: course.title,
      bookingId: booking.id,
    });
  } catch (error) {
    serverInstance.error('Payment intent creation failed', {
      error: error instanceof Error ? error.message : String(error),
      userId: userId || 'unknown',
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json(
      { error: 'Payment intent creation failed' },
      { status: 500 }
    );
  }
}
