/**
 * User Management Service
 * Provides comprehensive user operations with error handling
 */

import { prisma } from '@/lib/db/prisma';
import {
  DatabaseConnectionError,
  UserEmailAlreadyExistsError,
  UserNotFoundError,
  UserValidationError,
} from '@/lib/errors';
import { safePrismaOperation } from '@/lib/errors/prisma-mapping';
import { User as ClerkUser, currentUser } from '@clerk/nextjs/server';
import { User } from '@prisma/client';

export type { User } from '@prisma/client';

export interface UserProfile extends User {
  _count?: {
    bookings: number;
  };
}

export interface CreateUserData {
  id: string; // Clerk user ID
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface UpdateUserData {
  name?: string | null;
  email?: string;
  image?: string | null;
}

export interface UserStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
}

/**
 * Get current authenticated user from Clerk and sync with local database
 */
export async function getCurrentUserWithSync(): Promise<User> {
  const clerkUser = await currentUser();

  if (!clerkUser?.id) {
    throw new UserNotFoundError('No authenticated user found');
  }

  // Sync Clerk user with local database
  const user = await safePrismaOperation(async () => {
    return await prisma.user.upsert({
      where: { id: clerkUser.id },
      update: {
        name: clerkUser.fullName || clerkUser.firstName || null,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        image: clerkUser.imageUrl || null,
      },
      create: {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || null,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        image: clerkUser.imageUrl || null,
      },
    });
  });

  if (!user) {
    throw new DatabaseConnectionError('Failed to sync user with database');
  }

  return user;
}

/**
 * Get user by ID with error handling
 */
export async function getUserById(userId: string): Promise<User> {
  if (!userId || typeof userId !== 'string') {
    throw new UserValidationError('Invalid user ID provided');
  }

  const user = await safePrismaOperation(async () => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  });

  if (!user) {
    throw new UserNotFoundError(`User with ID ${userId} not found`);
  }

  return user;
}

/**
 * Get user by email with error handling
 */
export async function getUserByEmail(email: string): Promise<User> {
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    throw new UserValidationError('Invalid email address provided');
  }

  const user = await safePrismaOperation(async () => {
    return await prisma.user.findUnique({
      where: { email },
    });
  });

  if (!user) {
    throw new UserNotFoundError(`User with email ${email} not found`);
  }

  return user;
}

/**
 * Get user profile with additional data
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  if (!userId || typeof userId !== 'string') {
    throw new UserValidationError('Invalid user ID provided');
  }

  const user = await safePrismaOperation(async () => {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });
  });

  if (!user) {
    throw new UserNotFoundError(`User profile for ID ${userId} not found`);
  }

  return user;
}

/**
 * Create a new user (typically from Clerk webhook)
 */
export async function createUser(data: CreateUserData): Promise<User> {
  // Validate required fields
  if (!data.id) {
    throw new UserValidationError('User ID is required');
  }

  if (!data.email || !isValidEmail(data.email)) {
    throw new UserValidationError('Valid email address is required');
  }

  // Check if user already exists
  const existingUser = await safePrismaOperation(async () => {
    return await prisma.user.findUnique({
      where: { id: data.id },
    });
  });

  if (existingUser) {
    throw new UserEmailAlreadyExistsError(
      `User with ID ${data.id} already exists`
    );
  }

  // Check if email is already taken
  const emailExists = await safePrismaOperation(async () => {
    return await prisma.user.findUnique({
      where: { email: data.email },
    });
  });

  if (emailExists) {
    throw new UserEmailAlreadyExistsError(
      `Email ${data.email} is already registered`
    );
  }

  // Create new user
  const user = await safePrismaOperation(async () => {
    return await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        image: data.image,
      },
    });
  });

  if (!user) {
    throw new DatabaseConnectionError('Failed to create user in database');
  }

  return user;
}

/**
 * Update user profile
 */
export async function updateUser(
  userId: string,
  data: UpdateUserData
): Promise<User> {
  if (!userId || typeof userId !== 'string') {
    throw new UserValidationError('Invalid user ID provided');
  }

  // Validate email if provided
  if (data.email && !isValidEmail(data.email)) {
    throw new UserValidationError('Invalid email address provided');
  }

  // Check if user exists
  await getUserById(userId); // This will throw if user not found

  // If email is being updated, check if it's already taken
  if (data.email) {
    const emailExists = await safePrismaOperation(async () => {
      return await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: { id: userId },
        },
      });
    });

    if (emailExists) {
      throw new UserEmailAlreadyExistsError(
        `Email ${data.email} is already registered`
      );
    }
  }

  // Update user
  const user = await safePrismaOperation(async () => {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  });

  if (!user) {
    throw new DatabaseConnectionError('Failed to update user in database');
  }

  return user;
}

/**
 * Delete user (soft delete by removing personal data)
 */
export async function deleteUser(userId: string): Promise<User> {
  if (!userId || typeof userId !== 'string') {
    throw new UserValidationError('Invalid user ID provided');
  }

  // Check if user exists
  await getUserById(userId); // This will throw if user not found

  // Soft delete: anonymize user data but keep bookings intact
  const user = await safePrismaOperation(async () => {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@example.com`,
        name: 'Deleted User',
        image: null,
      },
    });
  });

  if (!user) {
    throw new DatabaseConnectionError('Failed to delete user in database');
  }

  return user;
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  if (!userId || typeof userId !== 'string') {
    throw new UserValidationError('Invalid user ID provided');
  }

  // Check if user exists
  await getUserById(userId); // This will throw if user not found

  const stats = await safePrismaOperation(async () => {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { course: true },
    });

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
      b => b.paymentStatus === 'PENDING'
    ).length;
    const confirmedBookings = bookings.filter(
      b => b.paymentStatus === 'PAID'
    ).length;
    const cancelledBookings = bookings.filter(
      b => b.paymentStatus === 'CANCELLED'
    ).length;

    const totalSpent = bookings
      .filter(b => b.paymentStatus === 'PAID')
      .reduce(
        (sum, booking) => sum + (booking.amount || booking.course.price || 0),
        0
      );

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      totalSpent,
    };
  });

  if (!stats) {
    throw new DatabaseConnectionError('Failed to retrieve user statistics');
  }

  return stats;
}

/**
 * Check if user exists
 */
export async function userExists(userId: string): Promise<boolean> {
  if (!userId || typeof userId !== 'string') {
    return false;
  }

  try {
    await getUserById(userId);
    return true;
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return false;
    }
    throw error; // Re-throw other errors
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(
  limit: number = 50,
  offset: number = 0
): Promise<{ users: UserProfile[]; total: number }> {
  const [users, total] = await safePrismaOperation(async () => {
    return await Promise.all([
      prisma.user.findMany({
        include: {
          _count: {
            select: { bookings: true },
          },
        },
        orderBy: { id: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.user.count(),
    ]);
  });

  if (!users) {
    throw new DatabaseConnectionError('Failed to retrieve users');
  }

  return { users, total };
}

/**
 * Search users by name or email (admin only)
 */
export async function searchUsers(
  query: string,
  limit: number = 20
): Promise<UserProfile[]> {
  if (!query || query.trim().length < 2) {
    throw new UserValidationError(
      'Search query must be at least 2 characters long'
    );
  }

  const users = await safePrismaOperation(async () => {
    return await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query.trim(), mode: 'insensitive' } },
          { email: { contains: query.trim(), mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
      take: limit,
      orderBy: { id: 'desc' },
    });
  });

  if (!users) {
    throw new DatabaseConnectionError('Failed to search users');
  }

  return users;
}

/**
 * Sync user from Clerk to local database
 */
export async function syncUserFromClerk(clerkUser: ClerkUser): Promise<User> {
  if (!clerkUser?.id) {
    throw new UserValidationError('Invalid Clerk user provided');
  }

  const userData: CreateUserData = {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    name: clerkUser.fullName || clerkUser.firstName || null,
    image: clerkUser.imageUrl || null,
  };

  const user = await safePrismaOperation(async () => {
    return await prisma.user.upsert({
      where: { id: userData.id },
      update: {
        name: userData.name,
        email: userData.email,
        image: userData.image,
      },
      create: userData,
    });
  });

  if (!user) {
    throw new DatabaseConnectionError('Failed to sync user from Clerk');
  }

  return user;
}

// Helper functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
