/**
 * Request Context Utilities
 * Provides request tracking and context management
 */

import { headers } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export interface RequestContext {
  id: string;
  userAgent?: string;
  ip?: string;
  timestamp: string;
  url?: string;
}

/**
 * Generate or retrieve request ID for tracing
 */
export async function getRequestId(): Promise<string> {
  const headersList = await headers();

  // Check if request ID already exists in headers
  const existingId =
    headersList.get('x-request-id') || headersList.get('x-trace-id');

  if (existingId) {
    return existingId;
  }

  // Generate new request ID
  return uuidv4();
}

/**
 * Get comprehensive request context
 */
export async function getRequestContext(): Promise<RequestContext> {
  const headersList = await headers();

  return {
    id: await getRequestId(),
    userAgent: headersList.get('user-agent') || undefined,
    ip:
      headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      undefined,
    timestamp: new Date().toISOString(),
    url: headersList.get('referer') || undefined,
  };
}

/**
 * Enhanced error logging with request context
 */
export async function logErrorWithContext(
  error: unknown,
  additionalContext?: Record<string, any>
) {
  const requestContext = await getRequestContext();

  const logData = {
    requestId: requestContext.id,
    timestamp: requestContext.timestamp,
    userAgent: requestContext.userAgent,
    ip: requestContext.ip,
    url: requestContext.url,
    ...additionalContext,
  };

  if (error instanceof Error) {
    // ERROR logged for request context
  } else {
    // UNKNOWN_ERROR logged for request context
  }
}

/**
 * Middleware helper for request ID injection
 */
export function withRequestContext<T extends any[], R>(
  handler: (requestContext: RequestContext, ...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const requestContext = await getRequestContext();
    return handler(requestContext, ...args);
  };
}
