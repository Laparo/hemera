/**
 * Error Analytics API Route
 * Provides error metrics and logs for monitoring dashboard
 */

import { withErrorHandling } from '@/lib/errors';
import { errorAnalytics } from '@/lib/services/error-analytics';
import { NextRequest, NextResponse } from 'next/server';

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'metrics';
  const timeRange = (searchParams.get('timeRange') || 'day') as
    | 'hour'
    | 'day'
    | 'week';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');

  switch (action) {
    case 'metrics':
      const metrics = errorAnalytics.getErrorMetrics(timeRange);
      return NextResponse.json(metrics);

    case 'logs':
      const logs = errorAnalytics.getRecentErrors(page, limit);
      return NextResponse.json(logs);

    default:
      return NextResponse.json(
        { error: 'Invalid action. Use "metrics" or "logs".' },
        { status: 400 }
      );
  }
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'resolve':
      const { errorId } = await request.json();
      const resolved = errorAnalytics.resolveError(errorId);

      return NextResponse.json({
        success: resolved,
        message: resolved ? 'Error marked as resolved' : 'Error not found',
      });

    case 'clear':
      // Only allow in development
      if (process.env.NODE_ENV === 'development') {
        errorAnalytics.clearLogs();
        return NextResponse.json({ message: 'Error logs cleared' });
      }

      return NextResponse.json(
        { error: 'Action not allowed in production' },
        { status: 403 }
      );

    default:
      return NextResponse.json(
        { error: 'Invalid action. Use "resolve" or "clear".' },
        { status: 400 }
      );
  }
});
