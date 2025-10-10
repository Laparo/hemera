import { CourseWithBookings, getCourses } from '@/lib/services/courses';
import { currentUser } from '@clerk/nextjs/server';
import { PaymentStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Schema für Query-Parameter
const CourseSearchSchema = z.object({
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  availableOnly: z.coerce.boolean().optional(),
  sortBy: z.enum(['title', 'price', 'date']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unautorisiert' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    const validatedParams = CourseSearchSchema.parse(queryParams);

    // Kurse von der Mock-Funktion abrufen
    const courses = await getCourses();

    let filteredCourses = courses;

    // Suchfilter anwenden
    if (validatedParams.search) {
      const searchTerm = validatedParams.search.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course: CourseWithBookings) =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Preisfilter anwenden
    if (validatedParams.minPrice !== undefined) {
      filteredCourses = filteredCourses.filter(
        (course: CourseWithBookings) =>
          (course.price || 0) >= validatedParams.minPrice!
      );
    }

    if (validatedParams.maxPrice !== undefined) {
      filteredCourses = filteredCourses.filter(
        (course: CourseWithBookings) =>
          (course.price || 0) <= validatedParams.maxPrice!
      );
    }

    // Verfügbarkeitsfilter anwenden
    if (validatedParams.availableOnly) {
      filteredCourses = filteredCourses.filter((course: CourseWithBookings) => {
        if (!course.capacity) return true; // Unlimited capacity
        const paidBookings =
          course.bookings?.filter(
            booking =>
              booking.paymentStatus === PaymentStatus.PAID ||
              booking.paymentStatus === PaymentStatus.PENDING
          ) || [];
        return paidBookings.length < course.capacity;
      });
    }

    // Sortierung anwenden
    if (validatedParams.sortBy) {
      filteredCourses.sort((a: CourseWithBookings, b: CourseWithBookings) => {
        let aValue: any, bValue: any;

        switch (validatedParams.sortBy) {
          case 'title':
            aValue = a.title;
            bValue = b.title;
            break;
          case 'price':
            aValue = a.price || 0;
            bValue = b.price || 0;
            break;
          case 'date':
            aValue = a.date;
            bValue = b.date;
            break;
          default:
            aValue = a.title;
            bValue = b.title;
        }

        if (aValue < bValue)
          return validatedParams.sortOrder === 'desc' ? 1 : -1;
        if (aValue > bValue)
          return validatedParams.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    // Paginierung anwenden
    const page = validatedParams.page || 1;
    const limit = validatedParams.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    // Response-Format
    const response = {
      courses: paginatedCourses.map((course: CourseWithBookings) => ({
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
        // Berechne verfügbare Plätze
        availableSpots: course.capacity
          ? Math.max(
              0,
              course.capacity -
                (course.bookings?.filter(
                  booking =>
                    booking.paymentStatus === PaymentStatus.PAID ||
                    booking.paymentStatus === PaymentStatus.PENDING
                ).length || 0)
            )
          : null,
        totalBookings:
          course.bookings?.filter(
            booking =>
              booking.paymentStatus === PaymentStatus.PAID ||
              booking.paymentStatus === PaymentStatus.PENDING
          ).length || 0,
        // User-spezifische Informationen
        userBookingStatus: null, // Mock-Implementation
      })),
      pagination: {
        page,
        limit,
        total: filteredCourses.length,
        totalPages: Math.ceil(filteredCourses.length / limit),
        hasNext: endIndex < filteredCourses.length,
        hasPrev: startIndex > 0,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Fehler beim Abrufen der Kurse:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
