'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';

/**
 * Public navigation component for non-protected pages
 * Shows login/signup buttons for unauthenticated users
 * Shows user menu for authenticated users
 */
export function PublicNavigation() {
  // Render Clerk UI only when configured; otherwise use simple links
  const isClerkConfigured = Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  );
  return (
    <AppBar
      position='fixed'
      color='default'
      elevation={1}
      sx={{ zIndex: 1100 }}
    >
      <Container maxWidth='lg'>
        <Toolbar sx={{ py: 1 }}>
          {/* Logo/Brand */}
          <Link href='/' style={{ textDecoration: 'none' }}>
            <Typography
              variant='h5'
              component='div'
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                cursor: 'pointer',
              }}
            >
              Hemera Academy
            </Typography>
          </Link>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Authentication Buttons */}
            {isClerkConfigured ? (
              <>
                <SignedOut>
                  <Button
                    variant='outlined'
                    color='primary'
                    component={Link}
                    href='/sign-in'
                    data-testid='nav-login-button'
                    sx={{
                      textTransform: 'none',
                      px: 3,
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    component={Link}
                    href='/sign-up'
                    data-testid='nav-signup-button'
                    sx={{
                      textTransform: 'none',
                      px: 3,
                    }}
                  >
                    Sign Up
                  </Button>
                </SignedOut>

                {/* User Menu for Authenticated Users */}
                <SignedIn>
                  <Button
                    variant='text'
                    color='inherit'
                    component={Link}
                    href='/dashboard'
                    sx={{
                      textTransform: 'none',
                      mr: 1,
                    }}
                  >
                    Meine Kurse
                  </Button>
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
                </SignedIn>
              </>
            ) : (
              /* Fallback buttons when Clerk is not configured */
              <>
                <Button
                  variant='outlined'
                  color='primary'
                  component={Link}
                  href='/sign-in'
                  data-testid='nav-login-button'
                  sx={{
                    textTransform: 'none',
                    px: 3,
                  }}
                >
                  Login
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  component={Link}
                  href='/sign-up'
                  data-testid='nav-signup-button'
                  sx={{
                    textTransform: 'none',
                    px: 3,
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
