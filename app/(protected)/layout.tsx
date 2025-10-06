import { ProtectedNavigation } from '@/components/navigation/ProtectedNavigation';
import { requireAuthenticatedUser } from '@/lib/auth/helpers';
import { UserButton } from '@clerk/nextjs';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
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
                  borderRadius: '8px', // Rechteckiges Fly-out mit abgerundeten Ecken
                },
              },
              variables: {
                colorPrimary: '#1976d2', // Material-UI primary color
                borderRadius: '4px', // Rechteckiger Border-Radius für alle Elemente
              },
            }}
            showName={false}
            data-testid='user-profile-button'
          />
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
