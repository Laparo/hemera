/**
 * Debriefing Step API Route
 *
 * GET - Retrieve debriefing data for a booking
 * PUT - Update debriefing data (save/complete)
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  withParticipationGetHandler,
  withParticipationMutationHandler,
} from '@/lib/api/participation-route-handler';
import {
  completeDebriefingStep,
  updateDebriefing,
} from '@/lib/db/courseParticipation';
import { serverInstance } from '@/lib/monitoring/rollbar-official';

const debriefingSchema = z.object({
  debriefingPlan: z.string().max(2000).optional(),
  salaryDiscussionMonth: z
    .string()
    .regex(/^\d{4}-\d{2}$/, 'Format must be YYYY-MM')
    .optional(),
  complete: z.boolean().optional(),
});

export const GET = withParticipationGetHandler(
  '/api/my-courses/[bookingId]/debriefing',
  ({ participation }) =>
    NextResponse.json({
      success: true,
      data: {
        debriefingPlan: participation.debriefingPlan,
        salaryDiscussionMonth: participation.salaryDiscussionMonth,
        status: participation.status,
      },
    })
);

export const PUT = withParticipationMutationHandler(
  '/api/my-courses/[bookingId]/debriefing',
  debriefingSchema,
  async ({ participation, body, userId, bookingId }) => {
    const { complete, ...debriefingData } = body;

    await updateDebriefing(participation.id, debriefingData);

    if (complete) {
      await completeDebriefingStep(participation.id);
      serverInstance.info('Debriefing step completed', {
        userId,
        bookingId,
        participationId: participation.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: complete ? 'Debriefing completed' : 'Data saved',
    });
  }
);
