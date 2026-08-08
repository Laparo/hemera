/**
 * Result Step API Route
 *
 * GET - Retrieve result data for a booking
 * PUT - Update result data (save/complete - final step)
 */

import {
  createResultGetHandler,
  createResultPutHandler,
} from './result-handlers';

export const GET = createResultGetHandler('/api/my-courses/[bookingId]/result');

export const PUT = createResultPutHandler(
  '/api/my-courses/[bookingId]/result',
  {
    complete: 'Participation completed',
    saved: 'Data saved',
  }
);
