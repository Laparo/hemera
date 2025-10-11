/**
 * HTTP Error Response Mapping
 * Converts domain errors to standardized HTTP responses
 */

import { errorAnalytics } from '@/lib/services/error-analytics';
import {
  getRequestContext,
  getRequestId,
  logErrorWithContext,
} from '@/lib/utils/request-context';
import { NextResponse } from 'next/server';
import { BaseError } from './base';

export interface ApiErrorResponse {
  error: {
    message: string;
    code: string;
    category: string;
    statusCode: number;
    context?: Record<string, any>;
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Convert any error to a standardized HTTP response
 */
export function toHttpError(
  error: unknown,
  requestId?: string
): NextResponse<ApiErrorResponse> {
  const reqId = requestId || getRequestId();
  const requestContext = getRequestContext();

  // Record error in analytics
  if (error instanceof BaseError || error instanceof Error) {
    errorAnalytics.recordError(error, {
      requestId: reqId,
      userAgent: requestContext.userAgent,
      ip: requestContext.ip,
    });
  }

  // Handle our custom errors
  if (error instanceof BaseError) {
    logErrorWithContext(error, {
      errorCategory: error.category,
      errorCode: error.errorCode,
    });

    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.errorCode,
          category: error.category,
          statusCode: error.statusCode,
          context: error.context,
          timestamp: new Date().toISOString(),
          requestId: reqId,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle specific known errors
  if (error instanceof Error) {
    const statusCode = getStatusCodeForError(error);
    logErrorWithContext(error, { errorType: 'standard', statusCode });

    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: 'UNKNOWN_ERROR',
          category: 'infrastructure',
          statusCode,
          timestamp: new Date().toISOString(),
          requestId: reqId,
        },
      },
      { status: statusCode }
    );
  }

  // Handle unknown errors
  logErrorWithContext(error, { errorType: 'unknown' });

  return NextResponse.json(
    {
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_SERVER_ERROR',
        category: 'infrastructure',
        statusCode: 500,
        timestamp: new Date().toISOString(),
        requestId: reqId,
      },
    },
    { status: 500 }
  );
}

/**
 * Get appropriate HTTP status code for standard errors
 */
function getStatusCodeForError(error: Error): number {
  const errorName = error.constructor.name;

  switch (errorName) {
    case 'PrismaClientKnownRequestError':
      return 400;
    case 'PrismaClientUnknownRequestError':
      return 500;
    case 'PrismaClientValidationError':
      return 422;
    case 'NotFoundError':
      return 404;
    case 'ValidationError':
      return 422;
    case 'UnauthorizedError':
      return 401;
    case 'ForbiddenError':
      return 403;
    default:
      return 500;
  }
}

/**
 * Error logging utility with structured format
 */
export function logError(error: unknown, context?: Record<string, any>) {
  logErrorWithContext(error, context);
}

/**
 * Middleware helper for consistent error handling in API routes
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse<ApiErrorResponse>> => {
    try {
      return await handler(...args);
    } catch (error) {
      logError(error, { handler: handler.name });
      return toHttpError(error);
    }
  };
}
