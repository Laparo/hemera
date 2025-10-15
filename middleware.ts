import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In E2E test mode, bypass Clerk middleware entirely
const isE2EMode =
  process.env.E2E_TEST === 'true' ||
  process.env.NEXT_PUBLIC_DISABLE_CLERK === '1';

// Minimal Clerk middleware per current Quickstart (App Router)
export default isE2EMode
  ? function middleware(request: NextRequest) {
      // eslint-disable-next-line no-console
      console.log('[MIDDLEWARE E2E] Request to:', request.nextUrl.pathname);
      return NextResponse.next();
    }
  : clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
