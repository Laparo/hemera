import { NextRequest, NextResponse } from 'next/server';
import { getNextUpcomingCourse } from '@/lib/api/courses';

/**
 * GET /api/courses/next
 * Returns the next upcoming course
 */
export async function GET(request: NextRequest) {
  try {
    const course = await getNextUpcomingCourse();

    if (!course) {
      // Return a mock course for testing
      const mockCourse = {
        id: 'mock-course-1',
        title: 'Grundlagen der Persönlichkeitsentwicklung',
        date: '2025-11-15T10:00:00.000Z',
        slug: 'grundlagen-persoenlichkeitsentwicklung',
      };
      return NextResponse.json(mockCourse);
    }

    // Format the response to match the expected interface
    const formattedCourse = {
      id: course.id,
      title: course.title,
      date: course.date?.toISOString() || null,
      slug: course.slug,
    };

    return NextResponse.json(formattedCourse);
  } catch (error) {
    console.error('Error fetching next course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch next course' },
      { status: 500 }
    );
  }
}
