/**
 * Rollbar React Provider following official Next.js documentation
 * https://docs.rollbar.com/docs/nextjs
 */

'use client';

import { Provider as RollbarProvider } from '@rollbar/react';
import React from 'react';
import { clientConfig } from './rollbar-official';

interface RollbarProviderWrapperProps {
  children: React.ReactNode;
}

export function RollbarProviderWrapper({
  children,
}: RollbarProviderWrapperProps) {
  return <RollbarProvider config={clientConfig}>{children}</RollbarProvider>;
}
