/**
 * User Detail API Route
 * GET /api/users/[id] - Get specific user (admin only)
 * PUT /api/users/[id] - Update specific user (admin only)
 * DELETE /api/users/[id] - Delete specific user (admin only)
 */

import {
  deleteUser,
  getUserProfile,
  getUserStats,
  updateUser,
  type UpdateUserData,
} from '@/lib/api/users';
import { UserValidationError } from '@/lib/errors';
import { withAdminProtection } from '@/lib/middleware/api-error-handling';
import { NextResponse } from 'next/server';

// GET /api/users/[id] - Get specific user (admin only)
export const GET = withAdminProtection(async context => {
  const userId = context.params?.id;

  if (!userId) {
    throw new UserValidationError('User ID is required');
  }

  const includeStats = context.searchParams?.get('includeStats') === 'true';

  const [profile, stats] = await Promise.all([
    getUserProfile(userId),
    includeStats ? getUserStats(userId) : null,
  ]);

  return NextResponse.json({
    success: true,
    data: {
      ...profile,
      ...(stats && { stats }),
    },
  });
});

// PUT /api/users/[id] - Update specific user (admin only)
export const PUT = withAdminProtection(async context => {
  const userId = context.params?.id;
  const { request } = context;

  if (!userId) {
    throw new UserValidationError('User ID is required');
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    throw new UserValidationError('Invalid JSON in request body');
  }

  // Validate update data
  const updateData: UpdateUserData = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' && body.name !== null) {
      throw new UserValidationError('Name must be a string or null');
    }
    updateData.name = body.name;
  }

  if (body.email !== undefined) {
    if (typeof body.email !== 'string' || !body.email.trim()) {
      throw new UserValidationError('Email must be a non-empty string');
    }
    updateData.email = body.email.trim();
  }

  if (body.image !== undefined) {
    if (typeof body.image !== 'string' && body.image !== null) {
      throw new UserValidationError('Image must be a string URL or null');
    }
    updateData.image = body.image;
  }

  // Update user
  const updatedUser = await updateUser(userId, updateData);

  return NextResponse.json({
    success: true,
    data: updatedUser,
    message: 'User updated successfully',
  });
});

// DELETE /api/users/[id] - Delete specific user (admin only)
export const DELETE = withAdminProtection(async context => {
  const userId = context.params?.id;

  if (!userId) {
    throw new UserValidationError('User ID is required');
  }

  // Soft delete user
  const deletedUser = await deleteUser(userId);

  return NextResponse.json({
    success: true,
    data: deletedUser,
    message: 'User deleted successfully',
  });
});
