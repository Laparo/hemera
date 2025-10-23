import { prisma } from '@/lib/db/prisma';
import { PaymentStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/courses/[id]
 * Get course details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await prisma.course.findFirst({
      where: {
        id: id,
        isPublished: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Determine availability from internal bookings (PAID or PENDING count)
    let totalBookings = 0;
    if (course.capacity !== null && course.capacity !== undefined) {
      totalBookings = await prisma.booking.count({
        where: {
          courseId: course.id,
          paymentStatus: { in: [PaymentStatus.PAID, PaymentStatus.PENDING] },
        },
      });
    }

    const availableSpots =
      course.capacity !== null && course.capacity !== undefined
        ? Math.max(0, course.capacity - totalBookings)
        : null;

    return NextResponse.json({
      success: true,
      data: {
        id: course.id,
        title: course.title,
        description: course.description,
        slug: course.slug,
        price: course.price,
        currency: course.currency,
        capacity: course.capacity,
        date: course.date,
        isPublished: course.isPublished,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        availableSpots,
        totalBookings,
        userBookingStatus: null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
