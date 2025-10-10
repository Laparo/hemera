import { prisma } from '@/lib/db/prisma';
import {
  PaymentStatus,
  Prisma,
  type Booking,
  type Course,
  type User,
} from '@prisma/client';

/**
 * Booking model with API utilities
 *
 * Provides type-safe access to booking data with:
 * - CRUD operations for bookings
 * - User-specific booking queries
 * - Validation and error handling
 * - Payment status management
 */

export type { Booking } from '@prisma/client';

export interface BookingWithDetails extends Booking {
  course: Course;
  user: User;
}

export interface CreateBookingData {
  userId: string;
  courseId: string;
  paymentStatus?: PaymentStatus;
}

export interface BookingListResponse {
  bookings: BookingWithDetails[];
  total: number;
}

/**
 * Create a new booking for a user and course
 */
export async function createBooking(data: CreateBookingData): Promise<Booking> {
  // Check if course exists and is published
  const course = await prisma.course.findFirst({
    where: {
      id: data.courseId,
      isPublished: true,
    },
  });

  if (!course) {
    throw new Error('Course not found or not available');
  }

  try {
    return await prisma.booking.upsert({
      where: {
        userId_courseId: {
          userId: data.userId,
          courseId: data.courseId,
        },
      },
      update: {
        paymentStatus: data.paymentStatus || PaymentStatus.PENDING,
      },
      create: {
        userId: data.userId,
        courseId: data.courseId,
        paymentStatus: data.paymentStatus || PaymentStatus.PENDING,
        amount: 0,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const existing = await prisma.booking.findUnique({
        where: {
          userId_courseId: {
            userId: data.userId,
            courseId: data.courseId,
          },
        },
      });

      if (existing) {
        return existing;
      }
    }

    throw error;
  }
}

/**
 * Get all bookings for a specific user
 */
export async function getUserBookings(
  userId: string
): Promise<BookingWithDetails[]> {
  return prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      course: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get a specific booking by ID (with user authorization)
 */
export async function getBookingById(
  bookingId: string,
  userId: string
): Promise<BookingWithDetails | null> {
  return prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId, // Ensure user can only access their own bookings
    },
    include: {
      course: true,
      user: true,
    },
  });
}

/**
 * Update booking payment status
 */
export async function updateBookingPaymentStatus(
  bookingId: string,
  paymentStatus: PaymentStatus
): Promise<Booking> {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      paymentStatus,
    },
  });
}

/**
 * Cancel a booking (user authorized)
 */
export async function cancelBooking(
  bookingId: string,
  userId: string
): Promise<Booking> {
  return updateBookingPaymentStatus(bookingId, PaymentStatus.CANCELLED);
}

/**
 * Get booking statistics for a user
 */
export async function getUserBookingStats(userId: string) {
  const bookings = await prisma.booking.findMany({
    where: {
      userId,
    },
  });

  return {
    total: bookings.length,
    pending: bookings.filter(b => b.paymentStatus === PaymentStatus.PENDING)
      .length,
    confirmed: bookings.filter(b => b.paymentStatus === PaymentStatus.PAID)
      .length,
    cancelled: bookings.filter(b => b.paymentStatus === PaymentStatus.CANCELLED)
      .length,
  };
}

/**
 * Check if user has booked a specific course
 */
export async function hasUserBookedCourse(
  userId: string,
  courseId: string
): Promise<boolean> {
  const booking = await prisma.booking.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });

  return !!booking;
}

/**
 * Get all bookings for admin view (with pagination)
 */
export async function getAllBookings(
  limit: number = 50,
  offset: number = 0
): Promise<BookingListResponse> {
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      include: {
        course: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    }),
    prisma.booking.count(),
  ]);

  return {
    bookings,
    total,
  };
}

/**
 * Validate booking status
 */
export function isValidBookingStatus(status: string): boolean {
  const normalized = status.toUpperCase();
  return (Object.values(PaymentStatus) as string[]).includes(normalized);
}

/**
 * Format booking status for display
 */
export function formatBookingStatus(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.PENDING:
      return 'Pending Payment';
    case PaymentStatus.PAID:
      return 'Confirmed';
    case PaymentStatus.FAILED:
      return 'Payment Failed';
    case PaymentStatus.CANCELLED:
      return 'Cancelled';
    case PaymentStatus.REFUNDED:
      return 'Refunded';
    default:
      return 'Unknown';
  }
}

/**
 * Get booking status color for UI
 */
export function getBookingStatusColor(
  status: PaymentStatus
):
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning' {
  switch (status) {
    case PaymentStatus.PENDING:
      return 'warning';
    case PaymentStatus.PAID:
      return 'success';
    case PaymentStatus.FAILED:
      return 'error';
    case PaymentStatus.CANCELLED:
      return 'error';
    case PaymentStatus.REFUNDED:
      return 'info';
    default:
      return 'default';
  }
}
