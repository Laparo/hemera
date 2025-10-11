'use client';

import { useUser } from '@clerk/nextjs';
import {
  ArrowForwardOutlined,
  AttachMoneyOutlined,
  CheckCircleOutlined,
  PendingOutlined,
  SchoolOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Booking {
  id: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  currency: string;
  paymentStatus: string;
  createdAt: string;
}

interface DashboardStats {
  totalBookings: number;
  confirmedBookings: number;
  pendingPayments: number;
  totalSpent: number;
}

const UserDashboard: React.FC = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingPayments: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();

        if (data.success) {
          const bookingsData = data.data.bookings || [];
          setBookings(bookingsData);

          // Calculate stats
          const totalBookings = bookingsData.length;
          const confirmedBookings = bookingsData.filter(
            (b: Booking) => b.paymentStatus === 'PAID'
          ).length;
          const pendingPayments = bookingsData.filter(
            (b: Booking) => b.paymentStatus === 'PENDING'
          ).length;
          const totalSpent = bookingsData
            .filter((b: Booking) => b.paymentStatus === 'PAID')
            .reduce((sum: number, b: Booking) => sum + b.coursePrice, 0);

          setStats({
            totalBookings,
            confirmedBookings,
            pendingPayments,
            totalSpent,
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard data'
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircleOutlined />;
      case 'PENDING':
        return <PendingOutlined />;
      default:
        return <PendingOutlined />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
          data-testid='dashboard-title'
        >
          Willkommen zurück, {user?.firstName || 'User'}!
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Hier finden Sie eine Übersicht über Ihre Buchungen und Aktivitäten.
        </Typography>
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Dashboard Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction='row' spacing={2} alignItems='center'>
                <SchoolOutlined color='primary' sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Gesamte Buchungen
                  </Typography>
                  <Typography variant='h5' fontWeight='bold'>
                    {stats.totalBookings}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction='row' spacing={2} alignItems='center'>
                <CheckCircleOutlined color='success' sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Bestätigte Buchungen
                  </Typography>
                  <Typography variant='h5' fontWeight='bold'>
                    {stats.confirmedBookings}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction='row' spacing={2} alignItems='center'>
                <PendingOutlined color='warning' sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Ausstehende Zahlungen
                  </Typography>
                  <Typography variant='h5' fontWeight='bold'>
                    {stats.pendingPayments}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack direction='row' spacing={2} alignItems='center'>
                <AttachMoneyOutlined color='primary' sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    Gesamtausgaben
                  </Typography>
                  <Typography variant='h5' fontWeight='bold'>
                    €{(stats.totalSpent / 100).toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bookings List */}
      <Card data-testid='courses-card'>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Meine Buchungen
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {bookings.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <SchoolOutlined
                sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant='h6' color='text.secondary' gutterBottom>
                Keine Buchungen
              </Typography>
              <Typography variant='body2' color='text.secondary' paragraph>
                Sie haben noch keine Kurse gebucht. Entdecken Sie unser Angebot!
              </Typography>
              <Button
                component={Link}
                href='/courses'
                variant='contained'
                endIcon={<ArrowForwardOutlined />}
              >
                Kurse entdecken
              </Button>
            </Box>
          ) : (
            <Stack spacing={2}>
              {bookings.map(booking => (
                <Card key={booking.id} variant='outlined'>
                  <CardContent>
                    <Grid container spacing={2} alignItems='center'>
                      <Grid item xs={12} md={6}>
                        <Stack direction='row' spacing={2} alignItems='center'>
                          <SchoolOutlined color='primary' />
                          <Box>
                            <Typography variant='subtitle1' fontWeight='bold'>
                              {booking.courseTitle}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              Gebucht am{' '}
                              {new Date(booking.createdAt).toLocaleDateString(
                                'de-DE'
                              )}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography variant='body1' fontWeight='bold'>
                          {booking.currency}{' '}
                          {(booking.coursePrice / 100).toFixed(2)}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Stack
                          direction='row'
                          spacing={1}
                          alignItems='center'
                          justifyContent='flex-end'
                        >
                          <Chip
                            icon={getStatusIcon(booking.paymentStatus)}
                            label={
                              booking.paymentStatus === 'PAID'
                                ? 'Bezahlt'
                                : 'Ausstehend'
                            }
                            color={getStatusColor(booking.paymentStatus) as any}
                            size='small'
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDashboard;
