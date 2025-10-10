'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return null;
  }

  return (
    <Box
      data-testid='dashboard-layout'
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
