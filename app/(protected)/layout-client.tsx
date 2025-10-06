'use client';

import { ProtectedNavigation } from '@/components/navigation/ProtectedNavigation';
import { useAuth, useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({
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
      data-testid='protected-layout'
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      {/* Navigation Header */}
      <AppBar
        position='static'
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <Typography
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
            Hemera Academy
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='body2' color='text.secondary'>
              Welcome,{' '}
              {user?.firstName || user?.emailAddresses[0]?.emailAddress}
            </Typography>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: '32px',
                    height: '32px',
                  },
                },
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Menu */}
      <ProtectedNavigation />

      {/* Main Content Area */}
      <Container
        component='main'
        maxWidth='lg'
        sx={{
          flexGrow: 1,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Container>

      {/* Footer */}
      <Box
        component='footer'
        sx={{
          mt: 'auto',
          py: 2,
          px: 3,
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Container maxWidth='lg'>
          <Typography variant='body2' color='text.secondary' align='center'>
            © 2024 Hemera Academy. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
