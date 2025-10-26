'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import {
  CalendarToday,
  People,
  Euro,
  CheckCircle,
  HourglassEmpty,
  EventBusy,
  PlayCircleOutline,
  FormatQuote,
} from '@mui/icons-material';

interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  currency: string;
  capacity?: number | null;
  date?: Date | null;
  isPublished: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  availableSpots?: number | null;
  totalBookings?: number;
  userBookingStatus?: string | null;
}

interface CourseDetailProps {
  course: Course;
  onBookNow?: (courseId: string) => void;
  isLoading?: boolean;
}

const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  onBookNow,
  isLoading = false,
}) => {
  const [isBooking, setIsBooking] = useState(false);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleBookNow = async () => {
    if (onBookNow && !isBooking) {
      setIsBooking(true);
      try {
        await onBookNow(course.id);
      } finally {
        setIsBooking(false);
      }
    }
  };

  const getBookingButtonText = () => {
    if (isBooking) return 'Buchung läuft...';
    if (course.userBookingStatus === 'PAID') return 'Bereits gebucht';
    if (course.userBookingStatus === 'PENDING') return 'Zahlung ausstehend';
    if (course.availableSpots === 0) return 'Ausgebucht';
    return 'Jetzt buchen';
  };

  const isBookingDisabled = (): boolean => {
    return Boolean(
      isBooking ||
        course.userBookingStatus === 'PAID' ||
        (course.availableSpots !== null && course.availableSpots === 0) ||
        !course.isPublished ||
        (course.date && course.date < new Date())
    );
  };

  const getDisableReason = (): string | null => {
    if (!isBookingDisabled()) return null;
    if (course.userBookingStatus === 'PAID')
      return 'Du hast diesen Kurs bereits gebucht.';
    if (course.availableSpots !== null && course.availableSpots === 0)
      return 'Dieser Kurs ist aktuell ausgebucht.';
    if (!course.isPublished)
      return 'Dieser Kurs ist noch nicht veröffentlicht.';
    if (course.date && course.date < new Date())
      return 'Der Kurstermin liegt in der Vergangenheit.';
    if (isBooking) return 'Buchung läuft...';
    return 'Buchung derzeit nicht möglich.';
  };

  if (isLoading) {
    return (
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Box aria-busy='true' aria-live='polite'>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{ height: 300, bgcolor: 'grey.200', borderRadius: 2, mb: 2 }}
            />
            <Box
              sx={{
                height: 40,
                bgcolor: 'grey.200',
                borderRadius: 1,
                mb: 2,
                width: '75%',
              }}
            />
            <Box
              sx={{ height: 20, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }}
            />
            <Box
              sx={{
                height: 20,
                bgcolor: 'grey.200',
                borderRadius: 1,
                width: '80%',
              }}
            />
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Main Content - Left Column */}
        <Grid item xs={12} md={8}>
          {/* Hero Section with Image */}
          <Card sx={{ mb: 3 }}>
            {course.image && (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 400,
                  bgcolor: 'grey.100',
                }}
              >
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            )}
            <CardContent>
              <Typography
                variant='h3'
                component='h1'
                gutterBottom
                fontWeight='bold'
              >
                {course.title}
              </Typography>

              {/* Status Badges */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip label='Interne Buchung' color='primary' size='small' />

                {!course.isPublished && (
                  <Chip
                    label='Nicht veröffentlicht'
                    color='warning'
                    size='small'
                  />
                )}

                {course.userBookingStatus === 'PAID' && (
                  <Chip
                    icon={<CheckCircle />}
                    label='Gebucht'
                    color='success'
                    size='small'
                  />
                )}

                {course.userBookingStatus === 'PENDING' && (
                  <Chip
                    icon={<HourglassEmpty />}
                    label='Zahlung ausstehend'
                    color='warning'
                    size='small'
                  />
                )}

                {course.availableSpots === 0 && (
                  <Chip
                    label='Ausgebucht'
                    color='error'
                    size='small'
                    data-testid='course-detail-sold-out-badge'
                  />
                )}

                {course.date && course.date < new Date() && (
                  <Chip icon={<EventBusy />} label='Vergangen' size='small' />
                )}
              </Box>

              {/* Course Meta Information */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                {course.date && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarToday fontSize='small' color='action' />
                    <Typography variant='body2' color='text.secondary'>
                      {format(course.date, 'PPP', { locale: de })}
                    </Typography>
                  </Box>
                )}

                {course.capacity && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People fontSize='small' color='action' />
                    <Typography variant='body2' color='text.secondary'>
                      {course.availableSpots !== null
                        ? `${course.availableSpots} von ${course.capacity} Plätzen verfügbar`
                        : `${course.capacity} Plätze`}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Euro fontSize='small' color='action' />
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    fontWeight='medium'
                  >
                    {formatCurrency(course.price, course.currency)}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Course Description */}
              {course.description && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant='h5' gutterBottom fontWeight='bold'>
                    Kursbeschreibung
                  </Typography>
                  <Typography
                    variant='body1'
                    color='text.secondary'
                    sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
                  >
                    {course.description}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Video Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <PlayCircleOutline color='primary' />
                <Typography variant='h5' fontWeight='bold'>
                  Kursimpressionen
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 400,
                  bgcolor: 'grey.200',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant='body1' color='text.secondary'>
                  Video-Placeholder: Hier werden bald Kursimpressionen zu sehen
                  sein
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Participant Testimonial Section */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
              >
                <FormatQuote color='primary' />
                <Typography variant='h5' fontWeight='bold'>
                  Erfahrungen aus der Praxis
                </Typography>
              </Box>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: 'grey.50',
                  borderLeft: 4,
                  borderColor: 'primary.main',
                  position: 'relative',
                }}
              >
                <Typography
                  variant='body1'
                  paragraph
                  sx={{ fontStyle: 'italic', lineHeight: 1.8 }}
                >
                  &quot;Dieser Kurs hat meine Erwartungen übertroffen. Die
                  praktischen Übungen und die kompetente Betreuung haben mir
                  geholfen, mein Wissen direkt anzuwenden. Ich kann diesen Kurs
                  jedem empfehlen, der sich in diesem Bereich weiterentwickeln
                  möchte.&quot;
                </Typography>
                <Typography
                  variant='subtitle2'
                  color='text.secondary'
                  fontWeight='bold'
                >
                  — Maria Schmidt, Kursteilnehmerin
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Booking Card */}
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant='h5' gutterBottom fontWeight='bold'>
                Buchungsinformationen
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    Preis:
                  </Typography>
                  <Typography variant='h6' fontWeight='bold' color='primary'>
                    {formatCurrency(course.price, course.currency)}
                  </Typography>
                </Box>

                {course.capacity && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>
                      Verfügbare Plätze:
                    </Typography>
                    <Typography variant='body1' fontWeight='medium'>
                      {course.availableSpots ?? course.capacity}
                    </Typography>
                  </Box>
                )}

                {course.totalBookings !== undefined && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography variant='body2' color='text.secondary'>
                      Bereits gebucht:
                    </Typography>
                    <Typography variant='body1' fontWeight='medium'>
                      {course.totalBookings}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Booking Button */}
              {onBookNow && (
                <Box>
                  <Button
                    variant='contained'
                    size='large'
                    fullWidth
                    onClick={handleBookNow}
                    disabled={isBookingDisabled()}
                    aria-disabled={isBookingDisabled()}
                    aria-busy={isBooking || undefined}
                    data-testid='course-detail-book-cta'
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                    }}
                  >
                    {getBookingButtonText()}
                  </Button>

                  {/* Screen reader status */}
                  <span
                    style={{ position: 'absolute', left: '-10000px' }}
                    aria-live='polite'
                  >
                    {isBooking ? 'Buchung läuft' : ''}
                  </span>

                  {isBookingDisabled() && getDisableReason() && (
                    <Alert
                      severity='info'
                      sx={{ mt: 2 }}
                      data-testid='course-detail-disable-reason'
                    >
                      {getDisableReason()}
                    </Alert>
                  )}
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography
                variant='caption'
                color='text.secondary'
                display='block'
                textAlign='center'
              >
                Erstellt{' '}
                {formatDistanceToNow(course.createdAt, {
                  addSuffix: true,
                  locale: de,
                })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetail;
