import { UserRole, NavigationPermission, ClerkUser } from '@/lib/types/auth';

/**
 * Role permission utilities for access control and navigation
 */

// Define navigation permissions for different user roles
export const NAVIGATION_PERMISSIONS: NavigationPermission[] = [
  {
    route: '/protected/dashboard',
    label: 'Dashboard',
    allowedRoles: [UserRole.USER, UserRole.ADMIN],
    icon: 'dashboard',
  },
  {
    route: '/protected/my-courses',
    label: 'My Courses',
    allowedRoles: [UserRole.USER, UserRole.ADMIN],
    icon: 'school',
  },
  {
    route: '/protected/admin',
    label: 'Admin',
    allowedRoles: [UserRole.ADMIN],
    icon: 'admin_panel_settings',
  },
];

export function hasPermission(
  userRole: UserRole | null,
  route: string
): boolean {
  if (!userRole) {
    return false;
  }

  const permission = NAVIGATION_PERMISSIONS.find(p => p.route === route);

  if (!permission) {
    // If route is not in permissions list, default to allowing access
    // This handles dynamic routes or routes not explicitly defined
    return true;
  }

  return permission.allowedRoles.includes(userRole);
}

export function getAvailableNavigation(
  userRole: UserRole | null
): NavigationPermission[] {
  if (!userRole) {
    return [];
  }

  return NAVIGATION_PERMISSIONS.filter(permission =>
    permission.allowedRoles.includes(userRole)
  );
}

export function canAccessRoute(user: ClerkUser | null, route: string): boolean {
  return hasPermission(user?.role || null, route);
}

export function canAccessAdminArea(user: ClerkUser | null): boolean {
  return user?.role === UserRole.ADMIN;
}

export function filterNavigationByRole(
  user: ClerkUser | null
): NavigationPermission[] {
  return getAvailableNavigation(user?.role || null);
}

export function getUserRoleLabel(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'Administrator';
    case UserRole.USER:
      return 'User';
    default:
      return 'Unknown';
  }
}

export function isRouteProtected(route: string): boolean {
  return (
    route.startsWith('/protected/') ||
    route.startsWith('/admin/') ||
    route.startsWith('/dashboard/')
  );
}

export function requiresAdminRole(route: string): boolean {
  const adminRoutes = ['/protected/admin'];
  return adminRoutes.some(adminRoute => route.startsWith(adminRoute));
}

export function getRedirectAfterAuth(userRole: UserRole): string {
  // Redirect admin users to admin dashboard, regular users to user dashboard
  switch (userRole) {
    case UserRole.ADMIN:
      return '/protected/admin';
    case UserRole.USER:
    default:
      return '/protected/dashboard';
  }
}

export function validateRoleTransition(
  currentRole: UserRole,
  targetRole: UserRole
): boolean {
  // Only admins can change roles
  // Users cannot promote themselves
  if (currentRole !== UserRole.ADMIN) {
    return false;
  }

  // Admin can assign any role
  return Object.values(UserRole).includes(targetRole);
}
