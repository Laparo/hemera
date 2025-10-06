/**
 * Course API utilities for data fetching
 * Provides server-side functions for course management
 */

import { prisma } from '@/lib/db/prisma';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  price: number | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
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
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return courses;
  } catch (error) {
    console.error('Error fetching published courses:', error);
    return [];
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
    });

    return courses;
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    return [];
  }
}

/**
 * Get a single course by ID
 * Used for course detail pages
 */
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id,
        isPublished: true,
      },
    });

    return course;
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    return null;
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
    console.error('Error fetching all courses:', error);
    return [];
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
    console.error('Error fetching course stats:', error);
    return {
      total: 0,
      published: 0,
      unpublished: 0,
    };
  }
}
