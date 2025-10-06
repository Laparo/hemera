import { createBooking, getUserBookings } from '@/lib/api/bookings';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Request validation schema
const createBookingSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});

/**
 * POST /api/bookings
 * Create a new booking for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    // Create booking
    const booking = await createBooking({
      userId,
      courseId: validatedData.courseId,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        courseId: booking.courseId,
        status: booking.status,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    console.error('Booking creation error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.issues.map(issue => issue.message).join(', '),
        },
        { status: 400 }
      );
    }

    // Handle application errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Handle unexpected errors
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings
 * Get all bookings for the authenticated user
 */
export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user bookings
    const bookings = await getUserBookings(userId);

    return NextResponse.json({
      success: true,
      bookings: bookings.map(booking => ({
        id: booking.id,
        courseId: booking.courseId,
        status: booking.status,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
        course: {
          id: booking.course.id,
          title: booking.course.title,
          description: booking.course.description,
          slug: booking.course.slug,
          price: booking.course.price,
        },
      })),
    });
  } catch (error) {
    console.error('Bookings fetch error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
