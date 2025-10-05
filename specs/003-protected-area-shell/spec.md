# Feature Specification: Protected Area Shell

**Feature Branch**: `003-protected-area-shell`  
**Created**: 2025-10-01  
**Status**: Draft  
**Input**: Define initial protected shell pages, layout, and navigation scope

## Clarifications

### Session 2025-10-04

- Q: Welche Hauptbereiche soll die geschützte Navigation enthalten? → A: Dashboard + Kurse +
  Admin-Bereich (mit Rollenunterscheidung)
- Q: Rolle-Based Access Control Implementation → A: Einfache Rolle (nur `admin` vs. normale User)
- Q: Authentifizierung und Session Management → A: Clerk Integration verwenden
- Q: Clerk-Integration und Protected Routes → A: Server Components mit `auth()` helper + Middleware
  für Route Protection
- Q: Error Handling und Fallback-Verhalten → A: Development-Details, Production-Redirects

## User Scenarios & Testing (mandatory)

### Primary User Story

As an authenticated user, I can access a protected app shell with consistent layout and navigation
to Dashboard, Courses, and Admin areas (based on role).

### Acceptance Scenarios

1. Given the app is deployed, when I sign in and visit the protected root, then I see a layout with
   navigation and my session context.
2. Given I open a protected subpage, when the route loads, then server-side auth is checked and the
   page renders on Node runtime.
3. Given I sign out, when I revisit protected routes, then I am redirected to sign-in.
4. Given I am a regular user, when I access the protected area, then I see Dashboard and Course
   management navigation but not Admin area.
5. Given I am an admin user, when I access the protected area, then I see Dashboard, Course
   management, and Admin area navigation.
6. Given I am an unauthenticated user, when I visit the public course overview page, then I can
   browse available courses without authentication.

### Edge Cases

- Flash of unauthenticated content, hydration mismatches, runtime misconfigurations.

## Course Accessibility Update (2025-10-05)

### Public Course Overview

- **Public Route**: `/courses` - Course overview is publicly accessible without authentication
- **Protected Route**: `/courses/manage/*` - Course management/admin functions require
  authentication
- **Navigation**: Course overview link is available in public navigation for all users
- **Purpose**: Allow potential students to browse course catalog before signing up

- Flash of unauthenticated content, hydration mismatches, runtime misconfigurations.

## Requirements (mandatory)

### Functional Requirements

- FR-001: System MUST offer a protected layout and navigation with Dashboard, Course management, and
  Admin areas.
- FR-002: System MUST perform server-side authentication checks using Clerk's `auth()` helper.
- FR-003: System MUST render protected routes with SSR on Node runtime.
- FR-004: System MUST implement role-based navigation visibility (Admin area only for admin users).
- FR-005: System MUST use Clerk middleware for route protection.
- FR-006: System MUST handle auth errors with development details in dev mode, simple redirects in
  production.
- FR-007: System MUST provide public access to course overview page (`/courses`) without
  authentication.
- FR-008: System MUST protect course management routes (`/courses/manage/*`) for authenticated users
  only.

### Non-Functional Requirements

- NFR-001: No visible flicker/FOUC on hydration.
- NFR-002: Time To First Byte (TTFB) MUST be <200ms for protected routes, auth checks MUST complete
  in <100ms.
- NFR-003: Secure authentication with proper error handling.

## Technical Architecture

### Authentication Strategy

**Provider**: Clerk (@clerk/nextjs) **Integration**: Server Components + Middleware **Role System**:
Simple binary (admin vs. user)

### Route Protection

```typescript
middleware.ts → authMiddleware() → Route Protection
app/(protected)/ → auth() server helper → User Session
```

### Component Architecture

```typescript
app/(protected)/layout.tsx (Server Component)
├── Clerk auth() check
├── Role-based navigation
└── Protected content wrapper

components/navigation/ProtectedNavigation.tsx (Server Component)
├── Dashboard (all users)
├── Course Management (all users)
└── Admin (admin only)

components/navigation/PublicNavigation.tsx (Client Component)
├── Course Overview (public access)
├── Login/Signup (unauthenticated users)
└── Dashboard/UserButton (authenticated users)
```

### Error Handling

- **Development**: Detailed error logs + stack traces with Clerk error details exposed in console
- **Production**: Clean redirects to `/sign-in` with generic "Authentication required" message
- **Fallback**: Graceful degradation for auth failures with retry mechanism (3 attempts max)
- **Network Errors**: Offline mode detection with "Connection lost" notification
- **Session Expiry**: Automatic token refresh attempt before redirect

## Implementation Plan

### Phase 1: Clerk Setup & Middleware

1. Configure Clerk provider in root layout
2. Setup environment variables
3. Create middleware for route protection
4. Add sign-in/sign-out pages

### Phase 2: Protected Layout & Navigation

1. Update protected layout with Clerk auth()
2. Implement role-based navigation
3. Add user session display
4. Create dashboard placeholder

### Phase 3: Role Integration & Testing

1. Integrate user roles with Clerk metadata
2. Add admin area protection
3. Create E2E tests for auth flows
4. Validate error handling scenarios

## Dependencies

- @clerk/nextjs (installed)
- Clerk Dashboard configuration
- Environment variables setup
- Middleware configuration

## Testing Strategy

### E2E Tests

- Auth flow (sign-in → protected area → sign-out)
- Role-based navigation visibility
- Route protection (unauthenticated redirects)
- Error scenarios (invalid session, network errors)

### Unit Tests

- Auth helper functions
- Role permission checks
- Navigation component rendering

## Definition of Done

- [ ] Clerk middleware configured and protecting routes
- [ ] Protected layout with server-side auth checks
- [ ] Role-based navigation (Dashboard, Courses, Admin)
- [ ] Error handling (dev details, prod redirects)
- [ ] E2E tests passing for auth flows
- [ ] No hydration issues or FOUC
- [ ] Build passing with TypeScript validation
