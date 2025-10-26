/**
 * Performance-Metriken API-Endpunkt
 * Stellt Analytics-Daten für Dashboard und Monitoring zur Verfügung
 */

import { analytics } from '@/lib/analytics/request-analytics';
import { checkUserAdminStatus } from '@/lib/auth/helpers';
import { createApiLogger } from '@/lib/utils/api-logger';
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorCodes,
} from '@/lib/utils/api-response';
import {
  createRequestContext,
  getOrCreateRequestId,
} from '@/lib/utils/request-id';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// CORS headers for external app access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  const context = createRequestContext(
    requestId,
    'GET',
    '/api/admin/analytics'
  );
  const logger = createApiLogger(context);

  try {
    logger.info('Analytics data request started');

    const { userId } = await auth();
    if (!userId) {
      logger.warn('Unauthorized analytics access attempt');
      return createErrorResponse(
        'Unauthorized access',
        ErrorCodes.UNAUTHORIZED,
        requestId,
        401
      );
    }

    const isAdmin = await checkUserAdminStatus(userId);
    if (!isAdmin) {
      logger.warn('Non-admin user attempted to access analytics', { userId });
      return createErrorResponse(
        'Admin privileges required',
        ErrorCodes.FORBIDDEN,
        requestId,
        403
      );
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';
    const reportType = searchParams.get('type') || 'summary';

    logger.info('Generating analytics report', {
      timeframe,
      reportType,
      userId,
    });

    let responseData;

    switch (reportType) {
      case 'summary':
        responseData = analytics.generateReport(timeframe);
        break;

      case 'usage':
        responseData = {
          usageStats: Array.from(
            analytics.generateUsageStats(timeframe).values()
          ),
        };
        break;

      case 'anomalies':
        responseData = {
          anomalies: analytics.detectAnomalies(),
        };
        break;

      case 'trace':
        const traceRequestId = searchParams.get('requestId');
        if (!traceRequestId) {
          return createErrorResponse(
            'Request ID required for trace report',
            ErrorCodes.INVALID_INPUT,
            requestId,
            400
          );
        }
        responseData = {
          trace: analytics.getRequestTrace(traceRequestId),
        };
        break;

      default:
        return createErrorResponse(
          'Invalid report type',
          ErrorCodes.INVALID_INPUT,
          requestId,
          400
        );
    }

    logger.info('Analytics report generated successfully', {
      reportType,
      timeframe,
      dataSize: JSON.stringify(responseData).length,
    });

    // Track business event
    logger.trackBusinessEvent('analytics_report_generated', {
      reportType,
      timeframe,
      userId,
    });

    // Track request completion
    logger.trackRequestCompletion(200);

    const response = createSuccessResponse(
      {
        report: responseData,
        metadata: {
          timeframe,
          reportType,
          generatedAt: new Date().toISOString(),
          requestId,
        },
      },
      requestId
    );

    // Add CORS headers to response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    logger.error('Error generating analytics report', error as Error);
    logger.trackRequestCompletion(500);

    return createErrorResponse(
      'Failed to generate analytics report',
      ErrorCodes.INTERNAL_ERROR,
      requestId,
      500
    );
  }
}
