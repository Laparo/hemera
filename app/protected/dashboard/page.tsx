import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { UserButton } from '@clerk/nextjs';

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <div>
          <Typography variant='h4' component='h1' data-testid='dashboard-title'>
            Dashboard
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Welcome back,{' '}
            {user.firstName || user.emailAddresses[0].emailAddress}
          </Typography>
        </div>
        <UserButton data-testid='user-menu' />
      </Box>

      {/* Dashboard Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card data-testid='courses-card'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                My Courses
              </Typography>
              <Typography variant='h4' color='primary'>
                3
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Active enrollments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card data-testid='progress-card'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Progress
              </Typography>
              <Typography variant='h4' color='success.main'>
                75%
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Overall completion
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card data-testid='certificates-card'>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Certificates
              </Typography>
              <Typography variant='h4' color='warning.main'>
                2
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Earned certificates
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Box sx={{ mt: 4 }}>
        <Typography variant='h5' gutterBottom>
          Recent Activity
        </Typography>
        <Card>
          <CardContent>
            <Typography variant='body1' color='text.secondary'>
              No recent activity to display.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
