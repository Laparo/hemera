import { PublicNavigation } from '@/components/navigation/PublicNavigation';
import {
  formatCourseDuration,
  formatCoursePrice,
  getFeaturedCourses,
} from '@/lib/api/courses';
import { generateLandingPageMetadata } from '@/lib/seo/metadata';
import { SCHEMA_COMBINATIONS } from '@/lib/seo/schemas';
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

  const jsonLdSchemas = SCHEMA_COMBINATIONS.landingPage();

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

      {/* Public Navigation */}
      <PublicNavigation />

      <main>
        {/* Hero Section */}
        <Box
          component='section'
          data-testid='hero-section'
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            py: { xs: 8, md: 12 },
            textAlign: 'center',
          }}
        >
          <Container maxWidth='md'>
            <Typography
              variant='h1'
              component='h1'
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 'bold',
                mb: 3,
              }}
            >
              Transform Your Career with Expert-Led Courses
            </Typography>

            <Typography
              variant='h2'
              component='h2'
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 'normal',
                mb: 4,
                opacity: 0.9,
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
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant='h5'
                          component='h3'
                          gutterBottom
                          sx={{ fontWeight: 'bold' }}
                        >
                          {course.title}
                        </Typography>

                        <Typography
                          variant='body2'
                          color='text.secondary'
                          paragraph
                        >
                          {course.description.length > 120
                            ? `${course.description.substring(0, 120)}...`
                            : course.description}
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
                            {formatCourseDuration(course.duration)}
                          </Typography>

                          <Typography
                            variant='h6'
                            component='span'
                            sx={{ fontWeight: 'bold' }}
                          >
                            {formatCoursePrice(course.price)}
                          </Typography>
                        </Box>
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
            bgcolor: 'grey.100',
            py: { xs: 6, md: 8 },
          }}
        >
          <Container maxWidth='md'>
            <Box textAlign='center'>
              <Typography
                variant='h2'
                component='h2'
                gutterBottom
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 'bold',
                  mb: 3,
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
                  mb: 4,
                }}
              >
                Join our community of learners and take the next step in your
                career journey
              </Typography>

              <Button
                variant='contained'
                color='primary'
                size='large'
                href='/sign-in'
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  mr: 2,
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
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                Browse Courses
              </Button>
            </Box>
          </Container>
        </Box>
      </main>
    </>
  );
}
