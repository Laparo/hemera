import { ProtectedNavigation } from '@/components/navigation/ProtectedNavigation';
import { requireAuthenticatedUser } from '@/lib/auth/helpers';
import { SignOutButton } from '@clerk/nextjs';
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { Metadata } from 'next';

// Force Node.js runtime for server-side authentication
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'Hemera Academy - Dashboard',
  description: 'Your personal learning dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check - will redirect if not authenticated
  const user = await requireAuthenticatedUser();

  return (
    <Box
      data-testid='protected-layout'
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      {/* Top Navigation Bar */}
      <AppBar position='static' elevation={1}>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Hemera Academy
          </Typography>

          {/* Session Indicator */}
          <Box
            data-testid='session-indicator'
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
          >
            <Typography variant='body2' sx={{ color: 'inherit' }}>
              {user.emailAddresses[0]?.emailAddress || 'Unknown'}
            </Typography>
            <Typography
              variant='caption'
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {(user.publicMetadata?.role as string) === 'admin'
                ? 'Admin'
                : 'User'}
            </Typography>
            <SignOutButton>
              <Button
                color='inherit'
                size='small'
                variant='outlined'
                sx={{ borderColor: 'rgba(255, 255, 255, 0.23)' }}
                data-testid='sign-out-button'
              >
                Sign Out
              </Button>
            </SignOutButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Navigation */}
      <ProtectedNavigation data-testid='main-navigation' user={user} />

      {/* Main Content Area */}
      <Box
        component='main'
        data-testid='protected-content'
        sx={{
          flexGrow: 1,
          bgcolor: 'grey.50',
          minHeight: 'calc(100vh - 64px - 48px)', // Subtract AppBar and nav height
        }}
      >
        <Container maxWidth='lg' sx={{ py: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
