'use client';

import { useUser } from '@clerk/nextjs';
import {
  AttachMoneyOutlined,
  SchoolOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
}

function CheckoutContent() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Fetch course details
  useEffect(() => {
    // Don't fetch if user is not loaded yet or not authenticated
    if (!isLoaded) return;

    if (!user) {
      // User not authenticated, will be redirected by the other useEffect
      return;
    }

    if (!courseId) {
      setError('No course selected');
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Course not found');
        }
        const data = await response.json();
        setCourse(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, isLoaded, user]);

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push(
        '/sign-in?redirect_url=' + encodeURIComponent(window.location.href)
      );
    }
  }, [isLoaded, user, router]);

  const handleCheckout = async () => {
    if (!course || !user) return;

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/courses`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message =
          errorData?.error ||
          errorData?.details ||
          'Failed to create checkout session';
        const meta = errorData?.code ? ` (Code: ${errorData.code})` : '';
        throw new Error(`${message}${meta}`);
      }

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProcessing(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <Container maxWidth='md' sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth='md' sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant='body1' sx={{ mt: 2 }}>
          Redirecting to sign in...
        </Typography>
      </Container>
    );
  }

  if (error && !course) {
    return (
      <Container maxWidth='md' sx={{ mt: 4 }}>
        <Alert severity='error'>{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant='outlined' onClick={() => router.push('/courses')}>
            Back to Courses
          </Button>
        </Box>
      </Container>
    );
  }

  if (!course) {
    return null;
  }

  const steps = ['Course Selection', 'Review & Payment', 'Confirmation'];

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      {/* Header with Stepper */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant='h3'
          component='h1'
          gutterBottom
          align='center'
          sx={{ mb: 2 }}
        >
          Checkout
        </Typography>

        <Stepper activeStep={1} alternativeLabel sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
        {/* Course Summary */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <ShoppingCartOutlined color='primary' />
              Order Summary
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 60,
                    bgcolor: 'primary.light',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SchoolOutlined
                    sx={{ color: 'primary.contrastText', fontSize: 24 }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant='h6' gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {course.description || 'No description available'}
                  </Typography>
                  <Chip
                    label='Beginner Level'
                    size='small'
                    variant='outlined'
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              <Divider />

              <Stack spacing={2}>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='body1'>Course Price</Typography>
                  <Typography variant='body1'>
                    {course.currency} {(course.price / 100).toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='body2' color='text.secondary'>
                    Duration
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    8 hours
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction='row' justifyContent='space-between'>
                  <Typography variant='h6'>Total</Typography>
                  <Typography variant='h6' color='primary'>
                    {course.currency} {(course.price / 100).toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Payment Section */}
        <Box sx={{ width: { xs: '100%', md: 400 } }}>
          <Paper
            elevation={2}
            sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}
          >
            <Typography variant='h5' gutterBottom>
              Payment Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Alert severity='info' sx={{ mb: 3 }}>
              You will be redirected to Stripe&apos;s secure checkout page to
              complete your payment.
            </Alert>

            <Stack spacing={2}>
              <Button
                variant='outlined'
                fullWidth
                onClick={() => router.push('/courses')}
                disabled={processing}
                size='large'
              >
                Back to Courses
              </Button>

              <Button
                variant='contained'
                fullWidth
                onClick={handleCheckout}
                disabled={processing}
                startIcon={
                  processing ? (
                    <CircularProgress size={20} />
                  ) : (
                    <AttachMoneyOutlined />
                  )
                }
                size='large'
                sx={{ py: 1.5 }}
              >
                {processing ? 'Processing...' : 'Complete Purchase'}
              </Button>
            </Stack>

            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ mt: 2, display: 'block', textAlign: 'center' }}
            >
              Secure payment powered by Stripe
            </Typography>
          </Paper>
        </Box>
      </Stack>
    </Container>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <CheckoutContent />
    </Suspense>
  );
}
