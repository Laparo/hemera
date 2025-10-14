/**
 * Course API utilities for data fetching
 * Provides server-side functions for course management
 */

import { prisma } from '@/lib/db/prisma';
import {
  CourseNotFoundError,
  CourseNotPublishedError,
  DatabaseConnectionError,
  logError,
} from '@/lib/errors';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  price: number | null;
  currency: string;
  capacity?: number | null;
  date: Date | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  availableSpots?: number | null;
  totalBookings?: number;
  userBookingStatus?: string | null;
}

export interface CourseWithSEO extends Course {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  instructor?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
}

/**
 * Get all published courses
 * Used for the public course listing page
 */
export async function getPublishedCourses(): Promise<Course[]> {
  try {
    // Debug: Check all courses first
    const allCourses = await prisma.course.findMany();
    // eslint-disable-next-line no-console
    console.error(`[DEBUG] Total courses in DB: ${allCourses.length}`);

    // Check if any have isPublished = true
    const publishedCount = allCourses.filter(
      c => c.isPublished === true
    ).length;
    // eslint-disable-next-line no-console
    console.error(`[DEBUG] Courses with isPublished===true: ${publishedCount}`);

    // Check raw values
    if (allCourses.length > 0) {
      // eslint-disable-next-line no-console
      console.error(
        `[DEBUG] First course isPublished value:`,
        allCourses[0]?.isPublished,
        typeof allCourses[0]?.isPublished
      );
    }

    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // eslint-disable-next-line no-console
    console.error(`[DEBUG] Query result count: ${courses.length}`);

    if (courses.length === 0) {
      throw new Error(
        `[E2E DEBUG] No published courses found! Total: ${allCourses.length}, Published (filter): ${publishedCount}, Query result: ${courses.length}`
      );
    }

    return courses;
  } catch (error) {
    logError(error, { operation: 'getPublishedCourses' });
    throw new DatabaseConnectionError(
      'fetching published courses',
      error as Error
    );
  }
}

/**
 * Get featured courses for homepage display
 * Returns a limited number of courses for featured section
 */
export async function getFeaturedCourses(limit = 3): Promise<Course[]> {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        price: true,
        date: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Erweitere die Kurse um die fehlenden Felder für die Component-Kompatibilität
    return courses.map(course => ({
      ...course,
      currency: 'EUR',
      capacity: null,
      availableSpots: null,
      totalBookings: 0,
      userBookingStatus: null,
    }));
  } catch (error) {
    logError(error, { operation: 'getFeaturedCourses', limit });
    throw new DatabaseConnectionError(
      'fetching featured courses',
      error as Error
    );
  }
}

/**
 * Get a single course by ID
 * Used for course detail pages
 */
export async function getCourseById(id: string): Promise<Course> {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id,
        isPublished: true,
      },
    });

    if (!course) {
      throw new CourseNotFoundError(id);
    }

    return course;
  } catch (error) {
    if (error instanceof CourseNotFoundError) {
      throw error; // Re-throw our custom error
    }

    logError(error, { operation: 'getCourseById', courseId: id });
    throw new DatabaseConnectionError('fetching course by ID', error as Error);
  }
}

/**
 * Get a single course by slug
 * Used for SEO-friendly course URLs
 */
export async function getCourseBySlug(slug: string): Promise<Course> {
  try {
    const course = await prisma.course.findUnique({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (!course) {
      throw new CourseNotFoundError(`slug:${slug}`);
    }

    if (!course.isPublished) {
      throw new CourseNotPublishedError(course.id);
    }

    return course;
  } catch (error) {
    if (
      error instanceof CourseNotFoundError ||
      error instanceof CourseNotPublishedError
    ) {
      throw error; // Re-throw our custom errors
    }

    logError(error, { operation: 'getCourseBySlug', slug });
    throw new DatabaseConnectionError(
      'fetching course by slug',
      error as Error
    );
  }
}

/**
 * Get all courses (including unpublished) for admin purposes
 * Requires admin privileges
 */
export async function getAllCourses(): Promise<Course[]> {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return courses;
  } catch (error) {
    logError(error, { operation: 'getAllCourses' });
    throw new DatabaseConnectionError('fetching all courses', error as Error);
  }
}

/**
 * Get the next upcoming course
 * Returns the published course with the earliest date in the future
 */
export async function getNextUpcomingCourse(): Promise<Course | null> {
  try {
    const now = new Date();
    const course = await prisma.course.findFirst({
      where: {
        isPublished: true,
        date: {
          gte: now,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return course;
  } catch (error) {
    logError(error, { operation: 'getNextUpcomingCourse' });
    throw new DatabaseConnectionError(
      'fetching next upcoming course',
      error as Error
    );
  }
}

/**
 * Get course count statistics
 * Returns counts for published/unpublished courses
 */
export async function getCourseStats() {
  try {
    const [total, published, unpublished] = await Promise.all([
      prisma.course.count(),
      prisma.course.count({ where: { isPublished: true } }),
      prisma.course.count({ where: { isPublished: false } }),
    ]);

    return {
      total,
      published,
      unpublished,
    };
  } catch (error) {
    logError(error, { operation: 'getCourseStats' });
    throw new DatabaseConnectionError(
      'fetching course statistics',
      error as Error
    );
  }
}
