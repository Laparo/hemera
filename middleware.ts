import { generateRequestId } from '@/lib/utils/request-id';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Definiere die geschützten Routen
const isProtectedRoute = createRouteMatcher([
  '/protected(.*)',
  '/bookings(.*)',
  '/admin(.*)',
  '/my-courses(.*)',
  '/dashboard(.*)',
]);

// Definiere die öffentlichen Auth-Routen (diese dürfen NICHT geschützt werden!)
const isAuthRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/verify-email(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Add request ID to all requests
  const requestId = generateRequestId();

  // Auth-Routen sind immer öffentlich zugänglich
  if (isAuthRoute(req)) {
    const response = NextResponse.next();
    response.headers.set('x-request-id', requestId);
    return response;
  }

  // Geschützte Routen erfordern Authentifizierung
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Return response with request ID for all other routes
  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
