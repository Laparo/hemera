/**
 * User Management API Route (Admin only)
 * GET /api/users - Get all users (admin only)
 * POST /api/users - Create new user (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  withApiErrorHandling,
  withAdminProtection,
} from '@/lib/middleware/api-error-handling';
import {
  getAllUsers,
  createUser,
  searchUsers,
  type CreateUserData,
} from '@/lib/api/users';
import { UserValidationError } from '@/lib/errors';

// GET /api/users - Get all users (admin only)
export const GET = withAdminProtection(async context => {
  const { searchParams } = context;

  const limit = parseInt(searchParams?.get('limit') || '50');
  const offset = parseInt(searchParams?.get('offset') || '0');
  const search = searchParams?.get('search');

  // Validate pagination parameters
  if (limit < 1 || limit > 100) {
    throw new UserValidationError('Limit must be between 1 and 100');
  }

  if (offset < 0) {
    throw new UserValidationError('Offset must be non-negative');
  }

  let result;

  if (search && search.trim()) {
    // Search users
    const users = await searchUsers(search.trim(), limit);
    result = { users, total: users.length };
  } else {
    // Get all users with pagination
    result = await getAllUsers(limit, offset);
  }

  return NextResponse.json({
    success: true,
    data: result.users,
    pagination: {
      total: result.total,
      limit,
      offset,
      hasMore: offset + limit < result.total,
    },
  });
});

// POST /api/users - Create new user (admin only)
export const POST = withAdminProtection(async context => {
  const { request } = context;

  let body;
  try {
    body = await request.json();
  } catch (error) {
    throw new UserValidationError('Invalid JSON in request body');
  }

  // Validate required fields
  if (!body.id || typeof body.id !== 'string') {
    throw new UserValidationError('User ID is required and must be a string');
  }

  if (!body.email || typeof body.email !== 'string') {
    throw new UserValidationError('Email is required and must be a string');
  }

  // Prepare user data
  const userData: CreateUserData = {
    id: body.id.trim(),
    email: body.email.trim(),
    name: body.name ? body.name.trim() : null,
    image: body.image ? body.image.trim() : null,
  };

  // Create user
  const user = await createUser(userData);

  return NextResponse.json(
    {
      success: true,
      data: user,
      message: 'User created successfully',
    },
    { status: 201 }
  );
});
