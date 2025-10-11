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
      {/* Top Navigation Bar */}
      <AppBar position='fixed' elevation={1} sx={{ zIndex: 1100 }}>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Hemera Academy
          </Typography>

          {/* User Avatar - Only Avatar Icon */}
          <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: {
                  width: '32px',
                  height: '32px',
                },
                userButtonTrigger: {
                  width: '32px',
                  height: '32px',
                  '&:focus': {
                    boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.5)',
                  },
                },
                userButtonPopoverCard: {
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                  borderRadius: '8px',
                },
              },
              variables: {
                colorPrimary: '#1976d2',
                borderRadius: '4px',
              },
            }}
            showName={false}
            data-testid='user-profile-button'
          />
        </Toolbar>
      </AppBar>

      {/* Main Navigation */}
      {user && (
        <ProtectedNavigation data-testid='main-navigation' user={user} />
      )}

      {/* Main Content */}
      <Container
        component='main'
        maxWidth='lg'
        sx={{
          flexGrow: 1,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          marginTop: '112px', // Space for fixed headers (64px AppBar + 48px Navigation)
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
