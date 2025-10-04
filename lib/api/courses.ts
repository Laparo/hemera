import { Course, CourseLevel, CourseStatus } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '@/lib/db/prisma';

/**
 * Course model with Prisma types and API utilities
 * 
 * Provides type-safe access to course data for public pages with:
 * - Type definitions for course entities
 * - Query utilities for published courses
 * - SEO-optimized data formatting
 * - Caching support for ISR
 */

export type { Course, CourseLevel, CourseStatus } from '@prisma/client';

export interface CourseWithSEO extends Course {
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

export interface CourseListResponse {
  courses: CourseWithSEO[];
  total: number;
  hasMore: boolean;
}

/**
 * Get all published courses for public display
 * Used for course list page and sitemap generation
 */
export async function getPublishedCourses(): Promise<CourseWithSEO[]> {
  const courses = await prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
      isPublic: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return courses.map(enrichCourseWithSEO);
}

/**
 * Get a single course by slug for public display
 */
export async function getCourseBySlug(slug: string): Promise<CourseWithSEO | null> {
  const course = await prisma.course.findFirst({
    where: {
      slug,
      status: CourseStatus.PUBLISHED,
      isPublic: true,
    },
  });

  return course ? enrichCourseWithSEO(course) : null;
}

/**
 * Get course count for pagination
 */
export async function getPublishedCourseCount(): Promise<number> {
  return prisma.course.count({
    where: {
      status: CourseStatus.PUBLISHED,
      isPublic: true,
    },
  });
}

/**
 * Get featured courses for landing page
 */
export async function getFeaturedCourses(limit: number = 3): Promise<CourseWithSEO[]> {
  const courses = await prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
      isPublic: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });

  return courses.map(enrichCourseWithSEO);
}

/**
 * Enrich course data with SEO metadata
 */
function enrichCourseWithSEO(course: Course): CourseWithSEO {
  return {
    ...course,
    seoTitle: `${course.title} | Hemera Academy`,
    seoDescription: course.description.length > 160 
      ? `${course.description.substring(0, 157)}...`
      : course.description,
    canonicalUrl: `https://hemera.academy/courses/${course.slug}`,
  };
}

/**
 * Validate course slug format
 */
export function isValidCourseSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Format course duration for display
 */
export function formatCourseDuration(duration: string): string {
  const durationMinutes = parseInt(duration, 10);
  
  if (isNaN(durationMinutes)) {
    return duration; // Return as-is if not a number
  }
  
  if (durationMinutes < 60) {
    return `${durationMinutes} min`;
  }
  
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}min`;
}

/**
 * Format course price for display
 */
export function formatCoursePrice(price: Decimal | null): string {
  if (!price || Number(price) === 0) {
    return 'Free';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(price));
}