import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/protected(.*)', // All routes under /protected/
  '/dashboard(.*)', // Legacy dashboard routes
  '/admin(.*)', // Admin-only routes
  '/courses(.*)', // Course management routes
]);

// Define public routes that should be accessible without authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
  '/api/auth/providers',
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req) && !isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
