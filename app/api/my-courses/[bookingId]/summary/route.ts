/**
 * Summary Step API Route
 *
 * GET - Retrieve summary assets for a booking (course defaults or booking overrides)
 * PUT - Mark summary as viewed/completed
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  withParticipationGetHandler,
  withParticipationMutationHandler,
} from '@/lib/api/participation-route-handler';
import {
  completeSummaryStep,
  getResolvedSummaryAssets,
  recordSummaryPresented,
} from '@/lib/db/courseParticipation';
import { serverInstance } from '@/lib/monitoring/rollbar-official';

const summaryUpdateSchema = z.object({
  markViewed: z.boolean().optional(),
  complete: z.boolean().optional(),
});

export const GET = withParticipationGetHandler(
  '/api/my-courses/[bookingId]/summary',
  async ({ participation }) => {
    const assets = await getResolvedSummaryAssets(
      participation.id,
      participation.courseId
    );

    return NextResponse.json({
      success: true,
      data: {
        assets,
        summaryPresentedAt: participation.summaryPresentedAt,
        summaryAssetSource: participation.summaryAssetSource,
        summaryCompletedAt: participation.summaryCompletedAt,
        status: participation.status,
        hasAssets: assets.length > 0,
      },
    });
  }
);

export const PUT = withParticipationMutationHandler(
  '/api/my-courses/[bookingId]/summary',
  summaryUpdateSchema,
  async ({ participation, body, userId, bookingId }) => {
    const { markViewed, complete } = body;

    if (markViewed && !participation.summaryPresentedAt) {
      const assets = await getResolvedSummaryAssets(
        participation.id,
        participation.courseId
      );
      const firstAsset = assets[0];
      if (assets.length > 0 && firstAsset) {
        await recordSummaryPresented(participation.id, firstAsset.source);
        serverInstance.info('Summary marked as viewed', {
          userId,
          bookingId,
          participationId: participation.id,
          assetSource: firstAsset.source,
        });
      }
    }

    if (complete) {
      await completeSummaryStep(participation.id);
      serverInstance.info('Summary step completed', {
        userId,
        bookingId,
        participationId: participation.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: complete ? 'Summary completed' : 'Updated',
    });
  }
);
