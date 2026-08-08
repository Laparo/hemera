import { type NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '../../../../../lib/auth/helpers';
import { prisma } from '../../../../../lib/db/prisma';
import { serverInstance } from '../../../../../lib/monitoring/rollbar-official';
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorCodes,
} from '../../../../../lib/utils/api-response';
import {
  applyCorsHeaders,
  getCorsHeaders,
} from '../../../../../lib/utils/cors';
import { getOrCreateRequestId } from '../../../../../lib/utils/request-id';

// CORS headers for external app access
const corsHeaders = getCorsHeaders();

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * GET /api/admin/bookings/pending
 * Returns all bookings with PRE_BOOKED status that require admin review
 * Used for Learning Path feature (021)
 */
export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);

  try {
    // Admin authentication + authorization
    const adminAuth = await requireAdminUser(requestId);
    if (!adminAuth.authorized) {
      return applyCorsHeaders(adminAuth.response, corsHeaders);
    }

    // Fetch pending bookings with PRE_BOOKED status
    const pendingBookings = await prisma.booking.findMany({
      where: {
        paymentStatus: 'PRE_BOOKED',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            level: true,
            startDate: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isOutperformer: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to response format
    const response = pendingBookings.map(booking => ({
      id: booking.id,
      createdAt: booking.createdAt.toISOString(),
      user: {
        id: booking.user.id,
        clerkUserId: booking.user.id, // id IS the clerkUserId
        email: booking.user.email,
        firstName: booking.user.name?.split(' ')[0] || null,
        lastName: booking.user.name?.split(' ').slice(1).join(' ') || null,
        isOutperformer: booking.user.isOutperformer,
      },
      course: {
        id: booking.course.id,
        title: booking.course.title,
        level: booking.course.level,
        startDate: booking.course.startDate?.toISOString() ?? null,
      },
    }));

    return applyCorsHeaders(
      createSuccessResponse(response, requestId),
      corsHeaders
    );
  } catch (error) {
    // Log minimal context without full error object
    serverInstance.error('Failed to fetch pending bookings', {
      context: 'AdminBookingsPending.GET',
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return applyCorsHeaders(
      createErrorResponse(
        'Failed to fetch pending bookings',
        ErrorCodes.INTERNAL_ERROR,
        requestId,
        500
      ),
      corsHeaders
    );
  }
}
