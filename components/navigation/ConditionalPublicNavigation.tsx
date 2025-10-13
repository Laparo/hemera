'use client';

import { usePathname } from 'next/navigation';
import { PublicNavigation } from './PublicNavigation';

// Route prefixes that represent protected areas
const PROTECTED_PREFIXES = ['/dashboard', '/my-courses', '/admin', '/bookings'];

export default function ConditionalPublicNavigation() {
  const pathname = usePathname() || '/';

  const isProtected = PROTECTED_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (isProtected) return null;

  return <PublicNavigation />;
}
