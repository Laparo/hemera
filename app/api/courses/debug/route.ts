import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

/**
 * GET /api/courses/debug
 * Debug endpoint to check courses in DB
 */
export async function GET(request: NextRequest) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
