import { NextRequest, NextResponse } from 'next/server';
import { getPublishedCourses, getPublishedCourseCount } from '@/lib/api/courses';
import { COURSE_CONFIG } from '@/lib/seo/constants';

/**
 * GET /api/courses
 * 
 * Public API endpoint for retrieving published courses
 * Supports pagination, filtering, and ISR caching
 * 
 * Query parameters:
 * - limit: number of courses per page (default: 12, max: 50)
 * - offset: pagination offset (default: 0)
 * - level: filter by course level (BEGINNER, INTERMEDIATE, ADVANCED)
 * - search: search in title and description
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(COURSE_CONFIG.pagination.defaultLimit), 10),
      COURSE_CONFIG.pagination.maxLimit
    );
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    // Validate parameters
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid limit parameter' },
        { status: 400 }
      );
    }

    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'Invalid offset parameter' },
        { status: 400 }
      );
    }

    if (level && !COURSE_CONFIG.filters.levels.includes(level as any)) {
      return NextResponse.json(
        { error: 'Invalid level parameter' },
        { status: 400 }
      );
    }

    // Get courses with filtering
    const courses = await getPublishedCourses();
    
    // Apply filtering
    let filteredCourses = courses;
    
    if (level) {
      filteredCourses = filteredCourses.filter(course => course.level === level);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const paginatedCourses = filteredCourses.slice(offset, offset + limit);
    const total = filteredCourses.length;
    const hasMore = offset + limit < total;

    // Prepare response
    const response = {
      courses: paginatedCourses,
      pagination: {
        limit,
        offset,
        total,
        hasMore,
        page: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        level,
        search,
      },
    };

    // Set cache headers for ISR
    const headers = new Headers();
    headers.set('Cache-Control', 's-maxage=86400, stale-while-revalidate=300'); // 24h cache, 5min stale
    headers.set('Content-Type', 'application/json');

    return new NextResponse(JSON.stringify(response, null, 2), {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Error in GET /api/courses:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? String(error) : 'An error occurred'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported methods
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET' } }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET' } }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET' } }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: { Allow: 'GET' } }
  );
}