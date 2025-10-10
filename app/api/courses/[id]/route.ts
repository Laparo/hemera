import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/courses/[id]
 * Get course details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        isPublished: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

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
      },
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}
