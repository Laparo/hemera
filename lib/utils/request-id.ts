/**
 * Request ID utilities for tracking requests across the application
 */

import { nanoid } from 'nanoid';
import { NextRequest } from 'next/server';

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return nanoid(10);
}

/**
 * Extract request ID from NextRequest or generate a new one
 */
export function getOrCreateRequestId(request: NextRequest): string {
  // Always return a canonical, freshly generated request ID.
  // Any inbound x-request-id is treated as an external correlation ID and should not be reused.
  return generateRequestId();
}

/**
 * Extract request ID from headers or generate a new one
 */
export function getOrCreateRequestIdFromHeaders(headers: Headers): string {
  // Always generate a new canonical ID for responses/logging.
  return generateRequestId();
}

/**
 * Retrieve an external/inbound request ID from headers if present.
 * This is for correlation only and must not be used as the canonical ID.
 */
export function getExternalRequestIdFromHeaders(
  headers: Headers
): string | undefined {
  return headers.get('x-request-id') || headers.get('x-trace-id') || undefined;
}

/**
 * Request context interface
 */
export interface RequestContext {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  /** Inbound correlation id provided by upstream (x-request-id or x-trace-id) */
  externalId?: string;
  userAgent?: string;
  ip?: string;
}

/**
 * Create request context manually
 */
export function createRequestContext(
  requestId: string,
  method?: string,
  url?: string,
  userAgent?: string,
  ip?: string
): RequestContext {
  return {
    id: requestId,
    timestamp: new Date().toISOString(),
    method: method || 'UNKNOWN',
    url: url || 'unknown',
    userAgent,
    ip,
  };
}

/**
 * Create request context from NextRequest object
 */
export function createRequestContextFromNextRequest(
  request: NextRequest,
  requestId?: string
): RequestContext {
  const id = requestId || getOrCreateRequestId(request);
  const externalId = getExternalRequestIdFromHeaders(request.headers);

  return {
    id,
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url,
    externalId,
    userAgent: request.headers.get('user-agent') || undefined,
    ip:
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      undefined,
  };
}
