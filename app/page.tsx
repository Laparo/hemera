import { getFeaturedCourses } from '@/lib/api/courses';
import { generateLandingPageMetadata } from '@/lib/seo/metadata';
import { SCHEMA_COMBINATIONS } from '@/lib/seo/schemas';
import NextCourseBanner from '@/components/NextCourseBanner';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';

/**
 * Landing page with SSG and SEO optimization
 *
 * Features:
 * - Static generation for optimal performance
 * - SEO-optimized metadata and structured data
 * - Hero section with clear value proposition
 * - Featured courses overview
 * - Call-to-action registration area
 */

export const metadata: Metadata = generateLandingPageMetadata();

export default async function HomePage() {
  const featuredCourses = await getFeaturedCourses(3);

  // For now, use homepage schema instead of landingPage
  const jsonLdSchemas = SCHEMA_COMBINATIONS.homepage();

  return (
    <>
      {/* JSON-LD Structured Data */}
      {jsonLdSchemas.map((schema, index) => (
        <script
          key={index}
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 2),
          }}
        />
      ))}

      <NextCourseBanner />

      <main style={{ paddingTop: '64px' }}>
        {/* Hero Section */}
        <Box
          component='section'
          data-testid='hero-section'
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            py: { xs: 12, md: 16 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(135deg, rgba(0,86,210,0.9) 0%, rgba(0,65,163,0.9) 100%)',
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 2 }}>
            <Typography
              variant='h1'
              component='h1'
              gutterBottom
              sx={{
                fontSize: { xs: '3rem', md: '4.5rem' },
                fontWeight: 700,
                mb: 4,
                lineHeight: 1.1,
              }}
            >
              Transform Your Career with
              <br />
              Expert-Led Courses
            </Typography>

            <Typography
              variant='h2'
              component='h2'
              sx={{
                fontSize: { xs: '1.25rem', md: '1.75rem' },
                fontWeight: 400,
                mb: 6,
                opacity: 0.95,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.4,
              }}
            >
              Join thousands of students advancing their careers in technology,
              business, and creative skills with Hemera Academy
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                variant='contained'
                color='secondary'
                size='large'
                href='/courses'
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                }}
              >
                Explore Courses
              </Button>

              <Button
                variant='outlined'
                color='secondary'
                size='large'
                href='/sign-in'
                data-testid='hero-login-button'
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderColor: 'secondary.main',
                  color: 'secondary.main',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'secondary.main',
                    color: 'secondary.contrastText',
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Course Overview Section */}
        <Box
          component='section'
          data-testid='course-overview'
          sx={{ py: { xs: 6, md: 10 } }}
        >
          <Container maxWidth='lg'>
            <Typography
              variant='h2'
              component='h2'
              align='center'
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 'bold',
                mb: 6,
              }}
            >
              Featured Courses
            </Typography>

            {featuredCourses.length > 0 ? (
              <Grid container spacing={4}>
                {featuredCourses.map(course => (
                  <Grid item xs={12} md={4} key={course.id}>
                    <Card
                      data-testid='course-card'
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        },
                      }}
                    >
                      {/* Course Image Placeholder */}
                      <Box
                        sx={{
                          height: 160,
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant='h4'
                          sx={{ color: 'primary.contrastText' }}
                        >
                          {course.title.charAt(0)}
                        </Typography>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant='h6'
                          component='h3'
                          gutterBottom
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          {course.title}
                        </Typography>

                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ mb: 2, fontSize: '0.875rem' }}
                        >
                          Instructor: Expert Teacher
                        </Typography>

                        {/* Rating */}
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        >
                          <Typography variant='body2' sx={{ mr: 1 }}>
                            ⭐⭐⭐⭐⭐
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            (4.8)
                          </Typography>
                        </Box>

                        <Typography
                          variant='body2'
                          color='text.secondary'
                          paragraph
                          sx={{ fontSize: '0.875rem', lineHeight: 1.4 }}
                        >
                          {course.description && course.description.length > 100
                            ? `${course.description.substring(0, 100)}...`
                            : course.description ||
                              'Keine Beschreibung verfügbar'}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 2,
                          }}
                        >
                          <Typography variant='body2' color='text.secondary'>
                            8 Stunden
                          </Typography>

                          <Typography
                            variant='h6'
                            component='span'
                            sx={{ fontWeight: 'bold' }}
                          >
                            {course.price && course.price > 0
                              ? `€${(course.price / 100).toFixed(2)}`
                              : 'Kostenlos'}
                          </Typography>
                        </Box>
                        <Button
                          component={Link}
                          href={`/checkout?courseId=${course.id}`}
                          variant='contained'
                          fullWidth
                          sx={{
                            mt: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                          }}
                        >
                          Book Course
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box textAlign='center' sx={{ py: 4 }}>
                <Typography variant='h6' color='text.secondary'>
                  New courses coming soon! Stay tuned for exciting learning
                  opportunities.
                </Typography>
              </Box>
            )}

            <Box textAlign='center' sx={{ mt: 6 }}>
              <Button
                variant='outlined'
                size='large'
                href='/courses'
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                }}
              >
                View All Courses
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Registration CTA Section */}
        <Box
          component='section'
          data-testid='registration-area'
          sx={{
            bgcolor: 'grey.50',
            py: { xs: 8, md: 12 },
            borderTop: '1px solid',
            borderColor: 'grey.200',
          }}
        >
          <Container maxWidth='md'>
            <Box textAlign='center'>
              <Typography
                variant='h2'
                component='h2'
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 3,
                  color: 'text.primary',
                }}
              >
                Ready to Start Learning?
              </Typography>

              <Typography
                variant='h3'
                component='h3'
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  color: 'text.secondary',
                  mb: 6,
                  lineHeight: 1.5,
                }}
              >
                Join our community of learners and take the next step in your
                career journey
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  variant='contained'
                  color='primary'
                  size='large'
                  href='/sign-in'
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    textTransform: 'none',
                  }}
                >
                  Get Started
                </Button>

                <Button
                  variant='outlined'
                  color='primary'
                  size='large'
                  href='/courses'
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '4px',
                    textTransform: 'none',
                  }}
                >
                  Browse Courses
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          component='footer'
          sx={{
            bgcolor: 'grey.900',
            color: 'grey.300',
            py: 6,
          }}
        >
          <Container maxWidth='lg'>
            <Grid container spacing={4}>
              <Grid item xs={12} md={3}>
                <Typography
                  variant='h6'
                  sx={{ color: 'white', mb: 2, fontWeight: 600 }}
                >
                  Hemera Academy
                </Typography>
                <Typography variant='body2' sx={{ mb: 2 }}>
                  Transform your career with expert-led courses in technology,
                  business, and creative skills.
                </Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography
                  variant='h6'
                  sx={{ color: 'white', mb: 2, fontWeight: 600 }}
                >
                  Courses
                </Typography>
                <Box component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <li>
                    <Link
                      href='/courses'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      All Courses
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/courses?category=tech'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      Technology
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/courses?category=business'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      Business
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/courses?category=design'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      Design
                    </Link>
                  </li>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography
                  variant='h6'
                  sx={{ color: 'white', mb: 2, fontWeight: 600 }}
                >
                  Support
                </Typography>
                <Box component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <li>
                    <Link
                      href='/help'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/contact'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/faq'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/feedback'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      Feedback
                    </Link>
                  </li>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography
                  variant='h6'
                  sx={{ color: 'white', mb: 2, fontWeight: 600 }}
                >
                  Company
                </Typography>
                <Box component='ul' sx={{ listStyle: 'none', p: 0, m: 0 }}>
                  <li>
                    <Link
                      href='/about'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/careers'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/press'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      Press
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='/investors'
                      style={{ color: 'grey.400', textDecoration: 'none' }}
                    >
                      Investors
                    </Link>
                  </li>
                </Box>
              </Grid>
            </Grid>

            <Box
              sx={{
                borderTop: '1px solid grey.800',
                mt: 6,
                pt: 4,
                textAlign: 'center',
              }}
            >
              <Typography variant='body2' sx={{ color: 'grey.500' }}>
                © 2025 Hemera Academy. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </main>
    </>
  );
}
