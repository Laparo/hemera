import { Metadata } from 'next';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { generateCourseListMetadata } from '@/lib/seo/metadata';
import { SCHEMA_COMBINATIONS, generateCourseSchema } from '@/lib/seo/schemas';
import { getPublishedCourses } from '@/lib/api/courses';
import { formatCoursePrice, formatCourseDuration } from '@/lib/api/courses';
import { PERFORMANCE_CONFIG } from '@/lib/seo/constants';

/**
 * Course list page with ISR (24h revalidation)
 *
 * Features:
 * - ISR with 24-hour revalidation
 * - SEO-optimized metadata and structured data
 * - Course cards with essential information
 * - Level indicators and pricing
 * - Responsive grid layout
 */

export const metadata: Metadata = generateCourseListMetadata();

// Enable ISR with 24-hour revalidation
export const revalidate = PERFORMANCE_CONFIG.isr.revalidate;

export default async function CoursesPage() {
  const courses = await getPublishedCourses();
  const jsonLdSchemas = SCHEMA_COMBINATIONS.courseList(courses);

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

      <main>
        {/* Page Header */}
        <Box
          component='section'
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            py: { xs: 6, md: 8 },
            textAlign: 'center',
          }}
        >
          <Container maxWidth='md'>
            <Typography
              variant='h1'
              component='h1'
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', md: '3rem' },
                fontWeight: 'bold',
                mb: 2,
              }}
            >
              All Courses
            </Typography>

            <Typography
              variant='h2'
              component='h2'
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                fontWeight: 'normal',
                opacity: 0.9,
              }}
            >
              Explore our complete catalog of expert-led courses
            </Typography>
          </Container>
        </Box>

        {/* Courses Grid */}
        <Box
          component='section'
          data-testid='course-overview'
          sx={{ py: { xs: 6, md: 8 } }}
        >
          <Container maxWidth='lg'>
            {courses.length > 0 ? (
              <>
                <Typography
                  variant='h6'
                  component='p'
                  color='text.secondary'
                  sx={{ mb: 4 }}
                >
                  {courses.length} course{courses.length !== 1 ? 's' : ''}{' '}
                  available
                </Typography>

                <Grid container spacing={4}>
                  {courses.map(course => (
                    <Grid item xs={12} sm={6} lg={4} key={course.id}>
                      <Card
                        data-testid='course-card'
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 3,
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          {/* Course Level Badge */}
                          <Box sx={{ mb: 2 }}>
                            <Chip
                              label={course.level}
                              size='small'
                              color={
                                course.level === 'BEGINNER'
                                  ? 'success'
                                  : course.level === 'INTERMEDIATE'
                                    ? 'warning'
                                    : 'error'
                              }
                              sx={{ fontWeight: 'bold' }}
                              data-testid='course-level'
                            />
                          </Box>

                          {/* Course Title */}
                          <Typography
                            variant='h5'
                            component='h3'
                            gutterBottom
                            sx={{
                              fontWeight: 'bold',
                              mb: 2,
                              lineHeight: 1.3,
                            }}
                            data-testid='course-title'
                          >
                            {course.title}
                          </Typography>

                          {/* Course Description */}
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            paragraph
                            sx={{ mb: 3 }}
                            data-testid='course-description'
                          >
                            {course.description.length > 150
                              ? `${course.description.substring(0, 150)}...`
                              : course.description}
                          </Typography>

                          {/* Course Meta Information */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mt: 'auto',
                              pt: 2,
                              borderTop: '1px solid',
                              borderColor: 'divider',
                            }}
                          >
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              sx={{ fontWeight: 'medium' }}
                            >
                              {formatCourseDuration(course.duration)}
                            </Typography>

                            <Typography
                              variant='h6'
                              component='span'
                              sx={{
                                fontWeight: 'bold',
                                color:
                                  course.price && Number(course.price) > 0
                                    ? 'primary.main'
                                    : 'success.main',
                              }}
                            >
                              {formatCoursePrice(course.price)}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : (
              <Box
                textAlign='center'
                sx={{
                  py: 8,
                  px: 2,
                }}
                data-testid='courses-fallback'
              >
                <Typography
                  variant='h4'
                  component='h2'
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  Bald verfügbar
                </Typography>

                <Typography variant='h6' color='text.secondary' sx={{ mb: 4 }}>
                  We&apos;re working hard to bring you amazing courses. Check
                  back soon!
                </Typography>

                <Typography variant='body1' color='text.secondary'>
                  Want to be notified when new courses are available?
                  <br />
                  Sign up for our newsletter to stay updated.
                </Typography>
              </Box>
            )}
          </Container>
        </Box>
      </main>
    </>
  );
}
