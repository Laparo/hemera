'use client';

import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

// Dynamically import Clerk's SignIn to avoid SSR hook execution
const DynamicSignIn = dynamic(
  () => import('@clerk/nextjs').then(m => m.SignIn),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function TestSignInPage() {
  const clerkDisabled =
    process.env.NEXT_PUBLIC_DISABLE_CLERK === '1' ||
    process.env.E2E_TEST === 'true';
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Box data-testid='simple-sign-in'>
        {clerkDisabled ? null : <DynamicSignIn />}
      </Box>
    </Box>
  );
}
