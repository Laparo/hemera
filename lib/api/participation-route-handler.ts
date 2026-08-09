/**
 * Shared route handler for participation step routes.
 *
 * Eliminates the duplicated auth → ownership → error-handling boilerplate
 * that was repeated across the six `app/api/my-courses/[bookingId]/*` routes.
 */

import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { z } from 'zod';
import type { ParticipationWithRelations } from '@/lib/db/courseParticipation';
import { getParticipationByBookingId } from '@/lib/db/courseParticipation';
import { serverInstance } from '@/lib/monitoring/rollbar-official';

/** Context passed to step handlers after auth + ownership checks succeed. */
export interface ParticipationRouteContext {
  userId: string;
  bookingId: string;
  participation: ParticipationWithRelations;
  request: NextRequest;
}

/** Result of the shared auth + ownership + participation resolution. */
type ParticipationResolution =
  | {
      ok: true;
      userId: string;
      bookingId: string;
      participation: ParticipationWithRelations;
    }
  | { ok: false; response: NextResponse };

/**
 * Authenticate the user, resolve the participation by bookingId, and verify
 * ownership. Returns either a successful context or an error NextResponse
 * that the caller should return as-is.
 */
export async function resolveParticipation(
  params: Promise<{ bookingId: string }>,
  stepLabel: string
): Promise<ParticipationResolution> {
  const { userId } = await auth();
  if (!userId) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      ),
    };
  }

  let bookingId: string;
  try {
    ({ bookingId } = await params);
  } catch (error) {
    serverInstance.error(`Failed to resolve params in ${stepLabel}`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      ),
    };
  }

  if (!bookingId || bookingId.trim().length === 0) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      ),
    };
  }

  const participation = await getParticipationByBookingId(bookingId);

  if (!participation) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Participation not found' },
        { status: 404 }
      ),
    };
  }

  if (participation.booking.userId !== userId) {
    serverInstance.warning(`Unauthorized ${stepLabel} access`, {
      userId,
      bookingId,
      ownerId: participation.booking.userId,
    });
    return {
      ok: false,
      response: NextResponse.json({ error: 'No permission' }, { status: 403 }),
    };
  }

  return { ok: true, userId, bookingId, participation };
}

/**
 * Wrap a GET handler for a participation step route.
 *
 * The handler receives the authenticated context and returns a NextResponse
 * (or a Promise of one). Auth, participation resolution, ownership check,
 * and error handling are handled centrally.
 */
export function withParticipationGetHandler(
  stepLabel: string,
  handler: (
    ctx: ParticipationRouteContext
  ) => NextResponse | Promise<NextResponse>
): (
  request: NextRequest,
  params: { params: Promise<{ bookingId: string }> }
) => Promise<NextResponse> {
  return async (request, { params }) => {
    try {
      const resolution = await resolveParticipation(params, stepLabel);
      if (!resolution.ok) return resolution.response;

      return await handler({
        userId: resolution.userId,
        bookingId: resolution.bookingId,
        participation: resolution.participation,
        request,
      });
    } catch (error) {
      serverInstance.error(`Error in GET ${stepLabel}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Wrap a PUT/PATCH/POST handler for a participation step route.
 *
 * Parses and validates the request body against the provided Zod schema before
 * invoking the handler. Auth, participation resolution, ownership check,
 * validation, and error handling are handled centrally.
 */
export function withParticipationMutationHandler<TBody extends z.ZodTypeAny>(
  stepLabel: string,
  schema: TBody,
  handler: (
    ctx: ParticipationRouteContext & {
      body: z.infer<TBody>;
    }
  ) => NextResponse | Promise<NextResponse>
): (
  request: NextRequest,
  params: { params: Promise<{ bookingId: string }> }
) => Promise<NextResponse> {
  return async (request, { params }) => {
    try {
      const resolution = await resolveParticipation(params, stepLabel);
      if (!resolution.ok) return resolution.response;

      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON body' },
          { status: 400 }
        );
      }

      const parseResult = schema.safeParse(body);

      if (!parseResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid data',
            details: parseResult.error.flatten(),
          },
          { status: 400 }
        );
      }

      return await handler({
        userId: resolution.userId,
        bookingId: resolution.bookingId,
        participation: resolution.participation,
        request,
        body: parseResult.data,
      });
    } catch (error) {
      serverInstance.error(`Error in ${request.method} ${stepLabel}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
