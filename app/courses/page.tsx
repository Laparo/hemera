import { getPublishedCourses } from '@/lib/api/courses';
import { PERFORMANCE_CONFIG } from '@/lib/seo/constants';
import { generateCourseListMetadata } from '@/lib/seo/metadata';
import { SCHEMA_COMBINATIONS } from '@/lib/seo/schemas';
import { BookOnlineOutlined } from '@mui/icons-material';
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

export const metadata: Metadata = generateCourseListMetadata();
export const revalidate = PERFORMANCE_CONFIG.isr.revalidate;

export default async function CoursesPage() {
  const courses = await getPublishedCourses();
  const jsonLdSchemas = SCHEMA_COMBINATIONS.courseList(courses);

  return (
    <>
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

        <Box
          component='section'
          data-testid='course-overview'
          sx={{ py: { xs: 6, md: 8 } }}
        >
          <Container maxWidth='lg'>
            {courses.length > 0 ? (
              <Grid container spacing={4}>
                {courses.map(course => (
                  <Grid item xs={12} md={6} lg={4} key={course.id}>
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
                          data-testid='course-title'
                          sx={{ fontWeight: 'bold' }}
                        >
                          {course.title}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          paragraph
                          data-testid='course-description'
                        >
                          {course.description && course.description.length > 120
                            ? course.description.substring(0, 120) + '...'
                            : course.description ||
                              'Keine Beschreibung verfügbar'}
                        </Typography>
                        <Typography
                          variant='body2'
                          color='primary'
                          sx={{
                            mb: 2,
                            fontWeight: 'medium',
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                          }}
                          data-testid='course-level'
                        >
                          Beginner
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
                            {course.price && Number(course.price) > 0
                              ? '€' + (Number(course.price) / 100).toFixed(2)
                              : 'Kostenlos'}
                          </Typography>
                        </Box>
                        <Button
                          component={Link}
                          href={'/bookings/new?courseId=' + course.id}
                          variant='contained'
                          fullWidth
                          startIcon={<BookOnlineOutlined />}
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
              <Box
                textAlign='center'
                sx={{ py: 8 }}
                data-testid='course-fallback-message'
              >
                <Typography variant='h6' color='text.secondary' gutterBottom>
                  Bald verfügbar!
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  Neue Kurse kommen bald. Bleiben Sie dran für spannende
                  Lernmöglichkeiten.
                </Typography>
              </Box>
            )}
          </Container>
        </Box>
      </main>
    </>
  );
}
