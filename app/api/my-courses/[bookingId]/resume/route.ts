/**
 * Resume Upload/Delete API Route
 *
 * POST - Upload a new resume (replaces any existing active one)
 * DELETE - Remove the active resume
 * GET - Get active resume metadata
 */

import { type NextRequest, NextResponse } from 'next/server';
import {
  resolveParticipation,
  withParticipationGetHandler,
} from '@/lib/api/participation-route-handler';
import {
  createResumeDocument,
  deactivateResumeDocument,
  getActiveResume,
} from '@/lib/db/courseParticipation';
import { serverInstance } from '@/lib/monitoring/rollbar-official';
import { deleteResume, uploadResume } from '@/lib/utils/resumeUpload';

export const GET = withParticipationGetHandler(
  '/api/my-courses/[bookingId]/resume',
  async ({ participation }) => {
    const activeResume = await getActiveResume(participation.id);

    return NextResponse.json({
      success: true,
      data: activeResume
        ? {
            id: activeResume.id,
            fileName: activeResume.fileName,
            fileSizeBytes: activeResume.fileSizeBytes,
            uploadedAt: activeResume.uploadedAt,
            blobUrl: activeResume.blobUrl,
          }
        : null,
    });
  }
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const resolution = await resolveParticipation(params, 'resume upload');
    if (!resolution.ok) return resolution.response;

    const { userId, bookingId, participation } = resolution;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const uploadResult = await uploadResume(file, participation.id, userId);

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error, code: uploadResult.code },
        { status: 400 }
      );
    }

    const document = await createResumeDocument({
      participationId: participation.id,
      blobUrl: uploadResult.blobUrl!,
      blobKey: uploadResult.blobKey!,
      fileName: uploadResult.fileName!,
      fileSizeBytes: uploadResult.fileSizeBytes!,
      mimeType: uploadResult.mimeType!,
      createdByUserId: userId,
    });

    serverInstance.info('Resume uploaded successfully', {
      userId,
      bookingId,
      participationId: participation.id,
      documentId: document.id,
      fileName: document.fileName,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: document.id,
        fileName: document.fileName,
        fileSizeBytes: document.fileSizeBytes,
        uploadedAt: document.uploadedAt,
        blobUrl: document.blobUrl,
      },
    });
  } catch (error) {
    serverInstance.error('Error in POST /api/my-courses/[bookingId]/resume', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const resolution = await resolveParticipation(params, 'resume deletion');
    if (!resolution.ok) return resolution.response;

    const { userId, bookingId, participation } = resolution;

    const activeResume = await getActiveResume(participation.id);

    if (!activeResume) {
      return NextResponse.json(
        { error: 'No active resume found' },
        { status: 404 }
      );
    }

    await deleteResume(activeResume.blobUrl, {
      participationId: participation.id,
      userId,
      reason: 'User requested deletion via API',
    });

    await deactivateResumeDocument(activeResume.id);

    serverInstance.info('Resume deleted successfully', {
      userId,
      bookingId,
      participationId: participation.id,
      documentId: activeResume.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Resume deleted',
    });
  } catch (error) {
    serverInstance.error('Error in DELETE /api/my-courses/[bookingId]/resume', {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
