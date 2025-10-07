'use client';

import { useAuth, UserButton, useUser } from '@clerk/nextjs';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
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
      {/* Top Navigation Bar */}
      <AppBar position='static' elevation={1}>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Hemera Academy - Dashboard
          </Typography>

          <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: {
                  width: '32px',
                  height: '32px',
                },
              },
            }}
            showName={false}
            data-testid='user-profile-button'
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
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
    </Box>
  );
}
