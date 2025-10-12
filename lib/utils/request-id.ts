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
  const existing = request.headers.get('x-request-id');
  if (existing) {
    return existing;
  }
  return generateRequestId();
}

/**
 * Extract request ID from headers or generate a new one
 */
export function getOrCreateRequestIdFromHeaders(headers: Headers): string {
  const existing = headers.get('x-request-id');
  if (existing) {
    return existing;
  }
  return generateRequestId();
}

/**
 * Request context interface
 */
export interface RequestContext {
  id: string;
  timestamp: string;
  method: string;
  url: string;
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

  return {
    id,
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent') || undefined,
    ip:
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      undefined,
  };
}
