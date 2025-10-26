'use client';

import CourseDetail from '@/components/CourseDetail';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  generateBreadcrumbSchema as genBreadcrumb,
  generateCourseSchema as genCourseSchema,
  generateWebPageSchema as genWebPageSchema,
  generateOrganizationSchema as genOrgSchema,
} from '@/lib/seo/schemas';
import { SITE_CONFIG } from '@/lib/seo/constants';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Container,
  CircularProgress,
  Alert,
  Button,
  Link as MuiLink,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  price: number;
  currency: string;
  capacity?: number | null;
  date?: string | Date | null;
  startTime?: string | Date | null;
  endTime?: string | Date | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  availableSpots?: number | null;
  totalBookings?: number;
  userBookingStatus?: string | null;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const courseId = params.id as string;

  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch course from our courses API
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Kurs nicht gefunden');
        }
        throw new Error('Fehler beim Laden des Kurses');
      }

      const data = await response.json();
      if (data?.success && data?.data) {
        setCourse(data.data);
      } else {
        throw new Error('Kurs nicht gefunden');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ein unbekannter Fehler ist aufgetreten'
      );
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId, fetchCourse]);

  const handleBookCourse = async (courseId: string) => {
    const target = `/bookings/new?courseId=${encodeURIComponent(courseId)}`;

    if (!isSignedIn) {
      // Redirect to sign-in, then continue with internal booking flow after login
      const returnUrl = target;
      router.push(`/auth/signin?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    setBookingLoading(true);
    try {
      router.push(target);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        <AppBar position='static' color='default' elevation={1}>
          <Toolbar>
            <IconButton
              edge='start'
              onClick={() => router.back()}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <CircularProgress size={20} />
              <Typography variant='h6'>Lade Kurs...</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <MuiLink href='/courses' color='inherit' underline='hover'>
                Alle Kurse
              </MuiLink>
              <MuiLink href='/dashboard' color='inherit' underline='hover'>
                Dashboard
              </MuiLink>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth='lg' sx={{ py: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}
          >
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        <AppBar position='static' color='default' elevation={1}>
          <Toolbar>
            <IconButton
              edge='start'
              onClick={() => router.back()}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant='h6' sx={{ flexGrow: 1 }}>
              Kurs
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <MuiLink href='/courses' color='inherit' underline='hover'>
                Alle Kurse
              </MuiLink>
              <MuiLink href='/dashboard' color='inherit' underline='hover'>
                Dashboard
              </MuiLink>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth='md' sx={{ py: 8 }}>
          <Alert severity='error' sx={{ mb: 3 }}>
            <Typography variant='h6' gutterBottom>
              {error}
            </Typography>
            <Typography variant='body2' gutterBottom>
              Der angeforderte Kurs konnte nicht geladen werden.
            </Typography>
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant='outlined' onClick={() => router.back()}>
              Zurück
            </Button>
            <Button variant='contained' onClick={() => router.push('/courses')}>
              Alle Kurse ansehen
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <>
      {/* JSON-LD Strukturierte Daten */}
      {(() => {
        const url = `${SITE_CONFIG.url}/courses/${course.id}`;
        const startDateISO = course.startTime
          ? new Date(course.startTime).toISOString()
          : course.date
            ? new Date(course.date).toISOString()
            : undefined;
        const endDateISO = course.endTime
          ? new Date(course.endTime).toISOString()
          : undefined;
        const inStock =
          (course.availableSpots ?? null) === null
            ? true
            : (course.availableSpots ?? 0) > 0;

        const offer = {
          '@type': 'Offer',
          price: (course.price ?? 0) > 0 ? String(course.price / 100) : '0',
          priceCurrency: 'EUR',
          availability: `https://schema.org/${inStock ? 'InStock' : 'OutOfStock'}`,
          url,
          ...(course.availableSpots !== null &&
          course.availableSpots !== undefined
            ? {
                inventoryLevel: {
                  '@type': 'QuantitativeValue',
                  value: course.availableSpots,
                },
              }
            : {}),
        } as const;

        const courseSchema = {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: course.title,
          description:
            course.description ||
            'Kursdetails der Hemera Academy: Inhalte, Termine und Buchungsinformationen.',
          provider: {
            '@type': 'EducationalOrganization',
            name: 'Hemera Academy',
            url: SITE_CONFIG.url,
          },
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'online',
            ...(startDateISO ? { startDate: startDateISO } : {}),
            ...(endDateISO ? { endDate: endDateISO } : {}),
            location: {
              '@type': 'VirtualLocation',
              url,
            },
          },
          offers: offer,
          url,
          inLanguage: 'de-DE',
        } as const;

        const schemas = [
          genOrgSchema(),
          genWebPageSchema({
            title: course.title,
            description:
              course.description ||
              'Kursdetails der Hemera Academy: Inhalte, Termine und Buchungsinformationen.',
            url,
            type: 'Course',
          }),
          genBreadcrumb([
            { name: 'Start', url: SITE_CONFIG.url },
            { name: 'Kurse', url: `${SITE_CONFIG.url}/courses` },
            { name: course.title, url },
          ]),
          courseSchema,
        ];

        return schemas.map((schema, index) => (
          <script
            key={`jsonld-${index}`}
            type='application/ld+json'
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ));
      })()}

      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
        {/* Header */}
        <AppBar position='static' color='default' elevation={1}>
          <Toolbar>
            <IconButton
              edge='start'
              onClick={() => router.back()}
              sx={{ mr: 2 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant='h6' sx={{ flexGrow: 1 }}>
              {course.title}
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <MuiLink href='/courses' color='inherit' underline='hover'>
                Alle Kurse
              </MuiLink>
              {isSignedIn && (
                <MuiLink href='/dashboard' color='inherit' underline='hover'>
                  Dashboard
                </MuiLink>
              )}
              {!isSignedIn && isLoaded && (
                <MuiLink href='/auth/signin' color='primary' underline='hover'>
                  Anmelden
                </MuiLink>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box component='main'>
          {(() => {
            // Kompatible Props für die Komponente herstellen (Date-Objekte statt ISO-Strings)
            const courseForComponent = {
              ...course,
              date: course.date ? new Date(course.date as any) : null,
            } as any;
            return (
              <CourseDetail
                course={courseForComponent}
                isLoading={false}
                onBookNow={handleBookCourse}
              />
            );
          })()}
        </Box>

        {/* Footer */}
        <Box
          component='footer'
          sx={{
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            mt: 8,
            py: 3,
          }}
        >
          <Container maxWidth='lg'>
            <Typography variant='body2' color='text.secondary' align='center'>
              © 2025 Hemera Learning Platform. Alle Rechte vorbehalten.
            </Typography>
          </Container>
        </Box>
      </Box>
    </>
  );
}
