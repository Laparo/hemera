import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Clerk-based User Session Interface
 */
export interface UserSession {
  userId: string;
  email?: string;
  role: 'admin' | 'user';
}

/**
 * Get the current authenticated user session from Clerk
 */
export async function getServerAuthSession(): Promise<UserSession | null> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return null;
    }

    // Extract role from Clerk metadata or default to 'user'
    const role = (sessionClaims?.metadata as any)?.role || 'user';
    const email = sessionClaims?.email as string;

    return {
      userId,
      email,
      role,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[AUTH] Error getting session:', error);
    }
    return null;
  }
}

/**
 * Require authentication - redirect to sign-in if not authenticated
 */
export async function requireAuth(): Promise<UserSession> {
  const session = await getServerAuthSession();

  if (!session) {
    redirect('/sign-in');
  }

  return session;
}

/**
 * Protected route wrapper for server components
 * Automatically handles auth check and redirect
 */
export async function withAuth<T extends any[]>(
  component: (
    session: UserSession,
    ...args: T
  ) => Promise<React.ReactElement> | React.ReactElement,
  ...args: T
): Promise<React.ReactElement> {
  const session = await requireAuth();
  return component(session, ...args);
}

/**
 * Check if user has specific permissions
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const session = await getServerAuthSession();

  if (!session) {
    return false;
  }

  // Simple role-based permissions
  if (session.role === 'admin') {
    return true; // Admin has all permissions
  }

  // Add specific permission logic here as needed
  return false;
}

/**
 * Get user ID from session
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerAuthSession();
  return session?.userId || null;
}

/**
 * Check if current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerAuthSession();
  return !!session;
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerAuthSession();
  return session?.role === 'admin';
}
