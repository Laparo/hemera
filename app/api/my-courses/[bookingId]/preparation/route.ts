/**
 * Preparation Step API Route
 *
 * GET - Retrieve preparation data for a booking
 * PUT - Update preparation data (save/complete)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  withParticipationGetHandler,
  withParticipationMutationHandler,
} from '@/lib/api/participation-route-handler';
import {
  completePreparationStep,
  updatePreparation,
} from '@/lib/db/courseParticipation';
import { serverInstance } from '@/lib/monitoring/rollbar-official';

const preparationSchema = z.object({
  preparationIntent: z.string().max(2000).optional(),
  desiredResults: z.string().max(2000).optional(),
  lineManagerProfile: z.string().max(2000).optional(),
  complete: z.boolean().optional(),
});

export const GET = withParticipationGetHandler(
  '/api/my-courses/[bookingId]/preparation',
  ({ participation }) =>
    NextResponse.json({
      success: true,
      data: {
        preparationIntent: participation.preparationIntent,
        desiredResults: participation.desiredResults,
        lineManagerProfile: participation.lineManagerProfile,
        preparationCompletedAt: participation.preparationCompletedAt,
        status: participation.status,
      },
    })
);

export const PUT = withParticipationMutationHandler(
  '/api/my-courses/[bookingId]/preparation',
  preparationSchema,
  async ({ participation, body, userId, bookingId }) => {
    const { complete, ...preparationData } = body;

    await updatePreparation(participation.id, preparationData, complete);

    if (complete) {
      await completePreparationStep(participation.id);
      serverInstance.info('Preparation step completed', {
        userId,
        bookingId,
        participationId: participation.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: complete ? 'Preparation completed' : 'Data saved',
    });
  }
);
