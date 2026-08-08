/**
 * Results Step API Route (German-localized variant of result)
 *
 * GET - Retrieve results data for a booking
 * PUT - Update results data (save/complete - final step)
 *
 * Shares handlers with `../result/route.ts` via `../result/result-handlers.ts`.
 * Only the user-facing messages differ (German informal "Du").
 */

import {
  createResultGetHandler,
  createResultPutHandler,
} from '../result/result-handlers';

export const GET = createResultGetHandler(
  '/api/my-courses/[bookingId]/results'
);

export const PUT = createResultPutHandler(
  '/api/my-courses/[bookingId]/results',
  {
    complete: 'Teilnahme abgeschlossen',
    saved: 'Daten gespeichert',
  }
);
