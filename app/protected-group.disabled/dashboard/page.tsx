// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

import {
  getUserDisplayName,
  requireAuthenticatedUser,
} from '@/lib/auth/helpers';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Hemera Academy',
  description: 'Your personal learning dashboard',
};

export default async function DashboardPage() {
  const user = await requireAuthenticatedUser();
  const displayName = getUserDisplayName(user);

  return (
    <Box data-testid='dashboard-page'>
      <Typography variant='h4' component='h1' gutterBottom>
        Welcome back, {displayName}!
      </Typography>

      <Typography variant='body1' color='text.secondary' paragraph>
        Here&apos;s your learning dashboard with personalized content and
        progress.
      </Typography>

      <Grid container spacing={3}>
        {/* User Info Card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Profile Information
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant='body2'>
                  <strong>Email:</strong>{' '}
                  {user.emailAddresses[0]?.emailAddress || 'Unknown'}
                </Typography>
                <Typography variant='body2'>
                  <strong>Role:</strong>
                  <Chip
                    label={
                      (user.publicMetadata?.role as string) === 'admin'
                        ? 'Administrator'
                        : 'Student'
                    }
                    size='small'
                    color={
                      (user.publicMetadata?.role as string) === 'admin'
                        ? 'primary'
                        : 'default'
                    }
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography variant='body2'>
                  <strong>Member since:</strong>{' '}
                  {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Quick Stats
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant='h4' color='primary'>
                      0
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Courses Enrolled
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant='h4' color='primary'>
                      0%
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Progress
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                No recent activity yet. Start exploring courses to see your
                activity here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h6' gutterBottom>
                Quick Actions
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Browse courses, view your progress, and manage your learning
                path.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
