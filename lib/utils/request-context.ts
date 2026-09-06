/**
 * Request Context Utilities
 * Provides request tracking and context management
 */

import { headers } from 'next/headers';
import { generateRequestId } from './request-id';

export interface RequestContext {
  id: string;
  externalId?: string;
  userAgent?: string;
  ip?: string;
  timestamp: string;
  url?: string;
}

/**
 * Generate or retrieve request ID for tracing
 */
export async function getRequestId(): Promise<string> {
  // Always generate a new canonical ID; inbound IDs are treated as external correlation only.
  return generateRequestId();
}

/**
 * Get comprehensive request context
 */
export async function getRequestContext(): Promise<RequestContext> {
  const canonicalId = await getRequestId();
  try {
    const headersList = await headers();
    const providedId =
      headersList.get('x-request-id') ||
      headersList.get('x-trace-id') ||
      undefined;

    return {
      id: canonicalId,
      externalId: providedId,
      userAgent: headersList.get('user-agent') || undefined,
      ip:
        headersList.get('x-forwarded-for') ||
        headersList.get('x-real-ip') ||
        undefined,
      timestamp: new Date().toISOString(),
      url: headersList.get('referer') || undefined,
    };
  } catch {
    return {
      id: canonicalId,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Lightweight request context for error logging that avoids calling `headers()`.
 *
 * Using `headers()` inside `logErrorWithContext` forces Next.js to mark the
 * route as dynamic (DYNAMIC_SERVER_USAGE), which breaks static rendering of
 * Server Components like the homepage.  Since request headers are nice-to-have
 * for error logs but not critical, we skip them here and only generate a
 * request ID.
 */
async function getLightweightRequestContext(): Promise<RequestContext> {
  const canonicalId = await getRequestId();
  return {
    id: canonicalId,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Enhanced error logging with request context
 *
 * Uses a lightweight context (no `headers()` call) so that error logging
 * from Server Components does not force dynamic rendering.
 */
export async function logErrorWithContext(
  error: unknown,
  additionalContext?: Record<string, unknown>
) {
  const requestContext = await getLightweightRequestContext();

  const _logData = {
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
export function withRequestContext<T extends unknown[], R>(
  handler: (requestContext: RequestContext, ...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    const requestContext = await getRequestContext();
    return handler(requestContext, ...args);
  };
}
