/**
 * Shared result step handlers for result and results routes.
 *
 * Both `/result` and `/results` routes share the same schema and logic.
 * The only difference is the user-facing language: `result` uses English,
 * `results` uses German (informal "Du").
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  type ParticipationRouteContext,
  withParticipationGetHandler,
  withParticipationMutationHandler,
} from '@/lib/api/participation-route-handler';
import { completeResultStep, updateResult } from '@/lib/db/courseParticipation';
import { serverInstance } from '@/lib/monitoring/rollbar-official';

/** Shared Zod schema for both result and results routes. */
export const resultStepSchema = z.object({
  resultOutcome: z.string().max(2000).optional(),
  resultNotes: z.string().max(2000).optional(),
  complete: z.boolean().optional(),
});

/** Shared GET handler — returns result data for a booking. */
export function createResultGetHandler(stepLabel: string) {
  return withParticipationGetHandler(stepLabel, ({ participation }) =>
    NextResponse.json({
      success: true,
      data: {
        resultOutcome: participation.resultOutcome,
        resultNotes: participation.resultNotes,
        resultCompletedAt: participation.resultCompletedAt,
        status: participation.status,
        isComplete: participation.status === 'COMPLETE',
      },
    })
  );
}

/** Shared PUT handler factory — accepts localized messages. */
export function createResultPutHandler(
  stepLabel: string,
  messages: { complete: string; saved: string }
) {
  return withParticipationMutationHandler(
    stepLabel,
    resultStepSchema,
    async ({
      participation,
      body,
      userId,
      bookingId,
    }: ParticipationRouteContext & {
      body: z.infer<typeof resultStepSchema>;
    }) => {
      const { complete, ...resultData } = body;

      await updateResult(participation.id, resultData);

      if (complete) {
        await completeResultStep(participation.id);
        serverInstance.info('Participation completed', {
          userId,
          bookingId,
          participationId: participation.id,
          courseTitle: participation.booking.course.title,
        });
      }

      return NextResponse.json({
        success: true,
        message: complete ? messages.complete : messages.saved,
      });
    }
  );
}
