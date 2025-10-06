import { prisma } from '@/lib/db/prisma';
import type { Booking, Course, User } from '@prisma/client';

/**
 * Booking model with API utilities
 *
 * Provides type-safe access to booking data with:
 * - CRUD operations for bookings
 * - User-specific booking queries
 * - Validation and error handling
 * - Status management
 */

export type { Booking } from '@prisma/client';

export interface BookingWithDetails extends Booking {
  course: Course;
  user: User;
}

export interface CreateBookingData {
  userId: string;
  courseId: string;
  status?: string;
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

  // Check if user already has a booking for this course
  const existingBooking = await prisma.booking.findUnique({
    where: {
      userId_courseId: {
        userId: data.userId,
        courseId: data.courseId,
      },
    },
  });

  if (existingBooking) {
    throw new Error('You already have a booking for this course');
  }

  // Create the booking
  return prisma.booking.create({
    data: {
      userId: data.userId,
      courseId: data.courseId,
      status: data.status || 'pending',
    },
  });
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
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  userId: string,
  status: string
): Promise<Booking> {
  // Verify booking belongs to user
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },
  });

  if (!booking) {
    throw new Error('Booking not found or access denied');
  }

  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status,
    },
  });
}

/**
 * Cancel a booking
 */
export async function cancelBooking(
  bookingId: string,
  userId: string
): Promise<Booking> {
  return updateBookingStatus(bookingId, userId, 'cancelled');
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
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
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
  return ['pending', 'confirmed', 'cancelled'].includes(status);
}

/**
 * Format booking status for display
 */
export function formatBookingStatus(status: string): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
}

/**
 * Get booking status color for UI
 */
export function getBookingStatusColor(
  status: string
):
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning' {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'confirmed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
}
