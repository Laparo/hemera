/**
 * User Profile API Route
 * GET /api/users/profile - Get current user profile
 * PUT /api/users/profile - Update current user profile
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  withApiErrorHandling,
  withAuthProtection,
} from '@/lib/middleware/api-error-handling';
import {
  getCurrentUserWithSync,
  updateUser,
  getUserProfile,
  type UpdateUserData,
} from '@/lib/api/users';
import { UserValidationError } from '@/lib/errors';

// GET /api/users/profile - Get current user profile
export const GET = withAuthProtection(async context => {
  const { userId } = context;

  const profile = await getUserProfile(userId);

  return NextResponse.json({
    success: true,
    data: profile,
  });
});

// PUT /api/users/profile - Update current user profile
export const PUT = withAuthProtection(async context => {
  const { userId, request } = context;

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
    message: 'Profile updated successfully',
  });
});
