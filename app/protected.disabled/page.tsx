// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <Container maxWidth='md' sx={{ py: 8 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant='h4' component='h1' data-testid='welcome-message'>
            Protected Dashboard
          </Typography>
          <UserButton data-testid='user-menu' />
        </Box>

        <Typography variant='h6' gutterBottom>
          Welcome back, {user.firstName || user.emailAddresses[0].emailAddress}!
        </Typography>

        <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
          You have successfully accessed the protected area. This content is
          only visible to authenticated users.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant='contained'
            href='/my-courses'
            data-testid='courses-link'
          >
            My Courses
          </Button>
          <Button
            variant='outlined'
            href='/my-courses'
            data-testid='profile-link'
          >
            Profile Settings
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
