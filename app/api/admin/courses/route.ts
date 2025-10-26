import { prisma } from '@/lib/db/prisma';
import { checkUserAdminStatus } from '@/lib/auth/helpers';
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorCodes,
} from '@/lib/utils/api-response';
import { getOrCreateRequestId } from '@/lib/utils/request-id';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// CORS headers for external app access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);

  try {
    // Authentication check
    const { userId } = await auth();
    if (!userId) {
      return createErrorResponse(
        'Unauthorized access',
        ErrorCodes.UNAUTHORIZED,
        requestId,
        401
      );
    }

    // Admin authorization check
    const isAdmin = await checkUserAdminStatus(userId);
    if (!isAdmin) {
      return createErrorResponse(
        'Admin privileges required',
        ErrorCodes.FORBIDDEN,
        requestId,
        403
      );
    }

    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const response = createSuccessResponse(
      {
        courses,
        total: courses.length,
      },
      requestId
    );

    // Add CORS headers to response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    return createErrorResponse(
      'Failed to fetch courses',
      ErrorCodes.INTERNAL_ERROR,
      requestId,
      500
    );
  }
}
