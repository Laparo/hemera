// Clerk-based auth helpers
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import type { User } from '@clerk/nextjs/server';

/**
 * Require authentication - redirect to sign-in if not authenticated
 */
export async function requireAuth() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return user;
}

/**
 * Alias for requireAuth for compatibility
 */
export const requireAuthenticatedUser = requireAuth;

/**
 * Get current user session
 */
export async function getCurrentUser() {
  return await currentUser();
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const user = await currentUser();
  return !!user;
}

/**
 * Check if user has admin role
 */
export async function isAdmin() {
  const user = await currentUser();
  return user?.publicMetadata?.role === 'admin';
}

/**
 * Require admin permissions
 */
export async function requireAdmin() {
  const user = await requireAuth();

  if (!isAdmin()) {
    redirect('/sign-in');
  }

  return user;
}

/**
 * Get user display name
 */
export function getUserDisplayName(user: User): string {
  return user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.firstName ||
        user.lastName ||
        user.emailAddresses[0]?.emailAddress ||
        'User';
}
