/**
 * Tests for the shared participation route handler.
 *
 * Covers the central authorization path in resolveParticipation and the
 * wrapper functions withParticipationGetHandler and
 * withParticipationMutationHandler.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock auth from @clerk/nextjs/server
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

// Mock getParticipationByBookingId
const mockGetParticipationByBookingId = vi.fn();
vi.mock('@/lib/db/courseParticipation', () => ({
  getParticipationByBookingId: (...args: unknown[]) =>
    mockGetParticipationByBookingId(...args),
}));

// Mock serverInstance to avoid Rollbar side effects
vi.mock('@/lib/monitoring/rollbar-official', () => ({
  serverInstance: {
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

import { auth } from '@clerk/nextjs/server';
import {
  resolveParticipation,
  withParticipationGetHandler,
  withParticipationMutationHandler,
} from '@/lib/api/participation-route-handler';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const mockAuth = vi.mocked(auth);

/** Build a minimal participation object for tests. */
function makeParticipation(ownerId = 'user-123') {
  return {
    id: 'part-1',
    bookingId: 'booking-1',
    courseId: 'course-1',
    booking: {
      id: 'booking-1',
      userId: ownerId,
      paymentStatus: 'PAID',
      course: {
        id: 'course-1',
        title: 'Test Course',
        slug: 'test-course',
        startDate: null,
      },
    },
    documents: [],
    summaryOverrides: [],
  } as unknown as Parameters<
    typeof mockGetParticipationByBookingId
  >[0] extends never
    ? never
    : Awaited<ReturnType<typeof mockGetParticipationByBookingId>>;
}

describe('resolveParticipation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when userId is missing', async () => {
    mockAuth.mockResolvedValue({ userId: null } as never);
    mockGetParticipationByBookingId.mockResolvedValue(null);

    const result = await resolveParticipation(
      Promise.resolve({ bookingId: 'booking-1' }),
      'test-step'
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(401);
    }
  });

  it('returns 400 when bookingId is empty', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' } as never);

    const result = await resolveParticipation(
      Promise.resolve({ bookingId: '' }),
      'test-step'
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(400);
    }
  });

  it('returns 404 when participation is not found', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' } as never);
    mockGetParticipationByBookingId.mockResolvedValue(null);

    const result = await resolveParticipation(
      Promise.resolve({ bookingId: 'booking-1' }),
      'test-step'
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(404);
    }
  });

  it('returns 403 when booking belongs to another user', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' } as never);
    mockGetParticipationByBookingId.mockResolvedValue(
      makeParticipation('other-user')
    );

    const result = await resolveParticipation(
      Promise.resolve({ bookingId: 'booking-1' }),
      'test-step'
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(403);
    }
  });

  it('returns ok with userId and participation when valid', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' } as never);
    const participation = makeParticipation('user-123');
    mockGetParticipationByBookingId.mockResolvedValue(participation);

    const result = await resolveParticipation(
      Promise.resolve({ bookingId: 'booking-1' }),
      'test-step'
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.userId).toBe('user-123');
      expect(result.bookingId).toBe('booking-1');
      expect(result.participation).toBe(participation);
    }
  });
});

describe('withParticipationGetHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls handler with context when auth + ownership succeed', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' } as never);
    const participation = makeParticipation('user-123');
    mockGetParticipationByBookingId.mockResolvedValue(participation);

    const handler = vi.fn().mockResolvedValue(
      NextResponse.json({ success: true })
    );

    const routeHandler = withParticipationGetHandler('test-step', handler);

    const request = new Request('http://localhost/api/test') as never;
    const response = await routeHandler(request, {
      params: Promise.resolve({ bookingId: 'booking-1' }),
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-123',
        bookingId: 'booking-1',
        participation,
      })
    );
    expect(response.status).toBe(200);
  });

  it('returns 401 without calling handler when not authenticated', async () => {
    mockAuth.mockResolvedValue({ userId: null } as never);

    const handler = vi.fn();
    const routeHandler = withParticipationGetHandler('test-step', handler);

    const request = new Request('http://localhost/api/test') as never;
    const response = await routeHandler(request, {
      params: Promise.resolve({ bookingId: 'booking-1' }),
    });

    expect(handler).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });
});

describe('withParticipationMutationHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const schema = z.object({
    value: z.string(),
  });

  it('calls handler with parsed body when valid', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' } as never);
    const participation = makeParticipation('user-123');
    mockGetParticipationByBookingId.mockResolvedValue(participation);

    const handler = vi.fn().mockResolvedValue(
      NextResponse.json({ success: true })
    );

    const routeHandler = withParticipationMutationHandler(
      'test-step',
      schema,
      handler
    );

    const request = new Request('http://localhost/api/test', {
      method: 'PUT',
      body: JSON.stringify({ value: 'hello' }),
    }) as never;
    const response = await routeHandler(request, {
      params: Promise.resolve({ bookingId: 'booking-1' }),
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        body: { value: 'hello' },
      })
    );
    expect(response.status).toBe(200);
  });

  it('returns 400 when JSON body is malformed', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' } as never);
    const participation = makeParticipation('user-123');
    mockGetParticipationByBookingId.mockResolvedValue(participation);

    const handler = vi.fn();
    const routeHandler = withParticipationMutationHandler(
      'test-step',
      schema,
      handler
    );

    const request = new Request('http://localhost/api/test', {
      method: 'PUT',
      body: 'not-json',
    }) as never;
    const response = await routeHandler(request, {
      params: Promise.resolve({ bookingId: 'booking-1' }),
    });

    expect(handler).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
  });

  it('returns 400 when schema validation fails', async () => {
    mockAuth.mockResolvedValue({ userId: 'user-123' } as never);
    const participation = makeParticipation('user-123');
    mockGetParticipationByBookingId.mockResolvedValue(participation);

    const handler = vi.fn();
    const routeHandler = withParticipationMutationHandler(
      'test-step',
      schema,
      handler
    );

    const request = new Request('http://localhost/api/test', {
      method: 'PUT',
      body: JSON.stringify({ wrongField: 123 }),
    }) as never;
    const response = await routeHandler(request, {
      params: Promise.resolve({ bookingId: 'booking-1' }),
    });

    expect(handler).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
  });
});
