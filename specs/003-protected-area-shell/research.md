# Research: Protected Area Shell

## Overview

This research supports the implementation of Feature 003: Protected Area Shell, which provides
authenticated layout and role-based navigation for the Hemera learning platform.

## Technology Research

### Authentication Provider: Clerk

**Selected**: Clerk (@clerk/nextjs)

**Rationale**:

- Native Next.js App Router support
- Server Component integration with auth() helper
- Built-in middleware for route protection
- Role and metadata management
- Production-ready sign-in/sign-up components

**Key APIs**:

- `auth()` - Server-side session access
- `clerkMiddleware()` - Route protection
- `ClerkProvider` - App-wide context
- `SignIn/SignUp` - Pre-built auth components
- `SignOutButton` - Logout functionality

### Next.js App Router Integration

**Approach**: Server Components + Middleware **Benefits**:

- No client-side flash of unauthenticated content (FOUC)
- Better SEO and initial load performance
- Secure server-side authentication checks
- Simplified state management

**Implementation Pattern**:

```typescript
// middleware.ts - Route protection
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

// Server Component - Auth check
const session = await auth();
if (!session.userId) redirect('/sign-in');
```

### Role-Based Access Control

**Model**: Simple binary roles (admin vs user) **Storage**: Clerk user metadata **Implementation**:
Server-side role checks in layouts and components

**Role Mapping**:

- `user` (default): Dashboard + Courses navigation
- `admin`: Dashboard + Courses + Admin navigation

## Architecture Decisions

### 1. Server-Side Rendering (SSR) Strategy

**Decision**: Use Node.js runtime for protected routes **Rationale**:

- Required for server-side auth checks
- Prevents client-side auth state exposure
- Better security posture
- Consistent with Clerk recommendations

### 2. Component Architecture

**Decision**: Server Components for layouts and navigation **Rationale**:

- Auth checks happen server-side
- No hydration mismatches
- Better performance for static content
- Simplified testing

### 3. Error Handling Strategy

**Decision**: Environment-specific error handling **Implementation**:

- Development: Detailed console logs with stack traces
- Production: Clean redirects to sign-in page
- Graceful degradation for auth failures

### 4. Navigation Structure

**Decision**: Tab-based navigation with conditional rendering **Components**:

- `ProtectedNavigation` - Main navigation component
- Role-based visibility using conditional rendering
- MUI Tabs for consistent UI

## Security Considerations

### Authentication Flow

1. Middleware checks route protection status
2. Clerk authenticates user before route access
3. Server components verify session and roles
4. Fallback redirects for unauthenticated users

### Session Management

- Server-side session validation
- Secure cookie-based storage (handled by Clerk)
- Automatic session refresh
- Secure sign-out handling

### Route Protection

- Middleware-level protection for all protected routes
- Server-component level role checks
- No client-side auth state exposure

## Performance Considerations

### Server-Side Rendering

- **Target**: <200ms TTFB for protected pages
- **Approach**: Efficient auth checks, minimal server processing
- **Monitoring**: Core Web Vitals, auth response times

### Client-Side Performance

- **Target**: No visible FOUC/flicker
- **Approach**: Server-side pre-rendering of auth state
- **Fallback**: Loading states for dynamic content

## Testing Strategy

### E2E Testing

- Auth flow testing (sign-in → protected area → sign-out)
- Role-based navigation visibility
- Route protection verification
- Error scenario handling

### Unit Testing

- Auth utility functions
- Role permission checks
- Component rendering with different auth states

## Dependencies Analysis

### Required Packages

- `@clerk/nextjs` - Authentication provider
- `@mui/material` - UI components (already installed)
- `@playwright/test` - E2E testing (already installed)

### Integration Points

- Existing Prisma setup (future user data storage)
- MUI theming system
- Next.js App Router structure

## Migration Considerations

### From Existing Auth System

- Remove NextAuth dependencies (completed)
- Update auth utilities to use Clerk APIs (completed)
- Migrate session interface (completed)

### Future Extensibility

- Role system can be extended to granular permissions
- Additional auth providers can be integrated
- User profile management can be added

## Risk Assessment

### High Risk

- ❌ None identified - straightforward implementation

### Medium Risk

- ⚠️ Clerk configuration complexity - Mitigated by clear documentation
- ⚠️ Role synchronization - Mitigated by simple binary role model

### Low Risk

- ⚠️ Performance impact of SSR - Acceptable for security benefits
- ⚠️ Testing auth flows - Standard patterns available

## Conclusion

The research confirms that Clerk integration with Next.js App Router Server Components provides the
optimal solution for Feature 003. The architecture is secure, performant, and maintainable with
clear upgrade paths for future requirements.

**Status**: ✅ Research Complete - Ready for Phase 1 Design
