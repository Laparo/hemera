import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserRole, ClerkUser, AuthState } from '@/lib/types/auth';

/**
 * Auth utility helpers for server-side authentication
 * Used in Server Components and API routes
 */

export async function requireAuth() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return userId;
}

export async function getAuthenticatedUser(): Promise<ClerkUser | null> {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    // Extract role from public metadata, default to USER
    const role = (user.publicMetadata?.role as UserRole) || UserRole.USER;

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      imageUrl: user.imageUrl || undefined,
      role,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  } catch (error) {
    console.error('Error fetching authenticated user:', error);
    return null;
  }
}

export async function requireAuthenticatedUser(): Promise<ClerkUser> {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/sign-in');
  }

  return user;
}

export async function getAuthState(): Promise<AuthState> {
  try {
    const { userId } = await auth();
    const user = userId ? await getAuthenticatedUser() : null;

    return {
      isAuthenticated: !!userId,
      user,
      isLoading: false,
    };
  } catch (error) {
    console.error('Error getting auth state:', error);
    return {
      isAuthenticated: false,
      user: null,
      isLoading: false,
    };
  }
}

export async function requireRole(requiredRole: UserRole): Promise<ClerkUser> {
  const user = await requireAuthenticatedUser();

  if (user.role !== requiredRole && user.role !== UserRole.ADMIN) {
    // Only admin can access any role, others need exact match
    redirect('/protected/dashboard');
  }

  return user;
}

export async function requireAdmin(): Promise<ClerkUser> {
  return requireRole(UserRole.ADMIN);
}

export function isUserRole(user: ClerkUser | null): boolean {
  return user?.role === UserRole.USER;
}

export function isAdminRole(user: ClerkUser | null): boolean {
  return user?.role === UserRole.ADMIN;
}

export function getUserDisplayName(user: ClerkUser): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }

  if (user.firstName) {
    return user.firstName;
  }

  return user.email;
}

export function getUserInitials(user: ClerkUser): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }

  if (user.firstName) {
    return user.firstName[0].toUpperCase();
  }

  return user.email[0].toUpperCase();
}
