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
  return (
    <AppBar position='static' color='default' elevation={1}>
      <Container maxWidth='lg'>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
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

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color='inherit'
              component={Link}
              href='/courses'
              sx={{ textTransform: 'none' }}
            >
              Courses
            </Button>

            {/* Authentication Buttons */}
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
                variant='outlined'
                color='primary'
                component={Link}
                href='/dashboard'
                data-testid='nav-dashboard-button'
                sx={{
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Dashboard
              </Button>
              <UserButton
                afterSignOutUrl='/'
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                  },
                }}
              />
            </SignedIn>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
