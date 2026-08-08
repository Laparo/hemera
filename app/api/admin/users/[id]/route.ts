import { type NextRequest, NextResponse } from 'next/server';
import { deleteUser, updateUserRole } from '../../../../../lib/api/admin-users';
import { requireAdminUser } from '../../../../../lib/auth/helpers';
import { prisma } from '../../../../../lib/db/prisma';
import { serverInstance } from '../../../../../lib/monitoring/rollbar-official';
import { userPatchSchema } from '../../../../../lib/schemas/admin/user';
import {
  createErrorResponse,
  createSuccessResponse,
  ErrorCodes,
} from '../../../../../lib/utils/api-response';
import {
  applyCorsHeaders,
  getCorsHeaders,
} from '../../../../../lib/utils/cors';
import { getOrCreateRequestId } from '../../../../../lib/utils/request-id';

// CORS headers restricted to same origin (not wildcard)
const corsHeaders = getCorsHeaders();

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/users/[id]
 * Get user details by ID
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const requestId = getOrCreateRequestId(request);
  let targetUserId: string | undefined;

  try {
    const params = await context.params;
    targetUserId = params.id;

    // Validate user ID
    if (!targetUserId || targetUserId.trim() === '') {
      return applyCorsHeaders(
        createErrorResponse(
          'Ungültige Benutzer-ID',
          ErrorCodes.VALIDATION_ERROR,
          requestId,
          400
        ),
        corsHeaders
      );
    }

    const adminAuth = await requireAdminUser(requestId);
    if (!adminAuth.authorized) {
      return applyCorsHeaders(adminAuth.response, corsHeaders);
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        isOutperformer: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return applyCorsHeaders(
        createErrorResponse(
          'Benutzer nicht gefunden',
          ErrorCodes.NOT_FOUND,
          requestId,
          404
        ),
        corsHeaders
      );
    }

    return applyCorsHeaders(
      createSuccessResponse(user, requestId),
      corsHeaders
    );
  } catch (error) {
    // Log minimal context without full error object
    serverInstance.error('Fehler beim Laden der Benutzerdetails', {
      context: 'AdminUsers.GET',
      userId: targetUserId || 'unknown',
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return applyCorsHeaders(
      createErrorResponse(
        'Benutzerdetails konnten nicht geladen werden',
        ErrorCodes.INTERNAL_ERROR,
        requestId,
        500
      ),
      corsHeaders
    );
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Update user fields: role (admin/user) and/or outperformer status
 * Used for Admin Dashboard (024) and Learning Path (021)
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  const requestId = getOrCreateRequestId(request);
  let targetUserId: string | undefined;

  try {
    const params = await context.params;
    targetUserId = params.id;

    // Validate user ID
    if (!targetUserId || targetUserId.trim() === '') {
      return applyCorsHeaders(
        createErrorResponse(
          'Ungültige Benutzer-ID',
          ErrorCodes.VALIDATION_ERROR,
          requestId,
          400
        ),
        corsHeaders
      );
    }

    const adminAuth = await requireAdminUser(requestId);
    if (!adminAuth.authorized) {
      return applyCorsHeaders(adminAuth.response, corsHeaders);
    }

    const userId = adminAuth.userId;

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (_parseError) {
      return applyCorsHeaders(
        createErrorResponse(
          'Ungültiger JSON-Body',
          ErrorCodes.VALIDATION_ERROR,
          requestId,
          400
        ),
        corsHeaders
      );
    }

    const parseResult = userPatchSchema.safeParse(body);
    if (!parseResult.success) {
      const validationMessages = parseResult.error.issues
        .map(e => e.message)
        .join(', ');
      return applyCorsHeaders(
        createErrorResponse(
          `Validierungsfehler: ${validationMessages}`,
          ErrorCodes.VALIDATION_ERROR,
          requestId,
          400
        ),
        corsHeaders
      );
    }

    const { role, isOutperformer } = parseResult.data;

    // Prevent self-demotion: admin cannot remove their own admin role
    if (role !== undefined && userId === targetUserId && role !== 'admin') {
      return applyCorsHeaders(
        createErrorResponse(
          'Du kannst deine eigene Admin-Rolle nicht entfernen',
          ErrorCodes.FORBIDDEN,
          requestId,
          403
        ),
        corsHeaders
      );
    }

    let updatedUser: unknown = null;

    // Handle role update via Clerk
    if (role !== undefined) {
      updatedUser = await updateUserRole(targetUserId, role === 'admin');

      // Audit log: record role change
      serverInstance.info('Benutzerrolle durch Admin geändert', {
        context: 'AdminUsers.PATCH.role',
        targetUserId,
        adminUserId: userId,
        newRole: role,
        requestId,
      });
    }

    // Handle outperformer status update via Prisma
    if (isOutperformer !== undefined) {
      const existingUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true },
      });

      if (!existingUser) {
        return applyCorsHeaders(
          createErrorResponse(
            'Benutzer nicht gefunden',
            ErrorCodes.NOT_FOUND,
            requestId,
            404
          ),
          corsHeaders
        );
      }

      updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: { isOutperformer },
        select: {
          id: true,
          name: true,
          email: true,
          isOutperformer: true,
          updatedAt: true,
        },
      });

      // Audit log: record outperformer status change
      serverInstance.info('Outperformer-Status durch Admin geändert', {
        context: 'AdminUsers.PATCH.outperformer',
        targetUserId,
        adminUserId: userId,
        isOutperformer,
        requestId,
      });
    }

    if (updatedUser) {
      return applyCorsHeaders(
        createSuccessResponse(updatedUser, requestId),
        corsHeaders
      );
    }

    // Should not reach here due to schema validation
    return applyCorsHeaders(
      createErrorResponse(
        'Keine gültige Aktion angegeben',
        ErrorCodes.VALIDATION_ERROR,
        requestId,
        400
      ),
      corsHeaders
    );
  } catch (error) {
    serverInstance.error('Fehler beim Aktualisieren des Benutzers', {
      context: 'AdminUsers.PATCH',
      userId: targetUserId || 'unknown',
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return applyCorsHeaders(
      createErrorResponse(
        'Benutzer konnte nicht aktualisiert werden',
        ErrorCodes.INTERNAL_ERROR,
        requestId,
        500
      ),
      corsHeaders
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user (024-admin-dashboard)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  const requestId = getOrCreateRequestId(request);
  let targetUserId: string | undefined;

  try {
    const params = await context.params;
    targetUserId = params.id;

    // Validate user ID
    if (!targetUserId || targetUserId.trim() === '') {
      return applyCorsHeaders(
        createErrorResponse(
          'Ungültige Benutzer-ID',
          ErrorCodes.VALIDATION_ERROR,
          requestId,
          400
        ),
        corsHeaders
      );
    }

    const adminAuth = await requireAdminUser(requestId);
    if (!adminAuth.authorized) {
      return applyCorsHeaders(adminAuth.response, corsHeaders);
    }

    const userId = adminAuth.userId;

    // Prevent self-deletion
    if (userId === targetUserId) {
      return applyCorsHeaders(
        createErrorResponse(
          'Du kannst dein eigenes Konto nicht löschen',
          ErrorCodes.FORBIDDEN,
          requestId,
          403
        ),
        corsHeaders
      );
    }

    // Delete user via Clerk
    await deleteUser(targetUserId);

    // Audit log: record user deletion
    serverInstance.info('Benutzer durch Admin gelöscht', {
      context: 'AdminUsers.DELETE',
      deletedUserId: targetUserId,
      adminUserId: userId,
      requestId,
    });

    // Return 204 No Content
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  } catch (error) {
    serverInstance.error('Fehler beim Löschen des Benutzers', {
      context: 'AdminUsers.DELETE',
      userId: targetUserId || 'unknown',
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return applyCorsHeaders(
      createErrorResponse(
        'Benutzer konnte nicht gelöscht werden',
        ErrorCodes.INTERNAL_ERROR,
        requestId,
        500
      ),
      corsHeaders
    );
  }
}
