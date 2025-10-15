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
// Force dynamic rendering to ensure freshly seeded courses are visible immediately
export const dynamic = 'force-dynamic';

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
            __html: Buffer.from(JSON.stringify(schema, null, 2)).toString(
              'base64'
            ),
          }}
        />
      ))}

      <main>
        <Box
          component='section'
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            py: { xs: 10, md: 14 },
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
                fontSize: { xs: '3rem', md: '4rem' },
                fontWeight: 700,
                mb: 3,
                lineHeight: 1.1,
              }}
            >
              All Courses
            </Typography>
            <Typography
              variant='h2'
              component='h2'
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 400,
                opacity: 0.95,
                maxWidth: '600px',
                mx: 'auto',
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
                          data-testid='course-title'
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
                          data-testid='course-description'
                          sx={{ fontSize: '0.875rem', lineHeight: 1.4 }}
                        >
                          {course.description && course.description.length > 100
                            ? course.description.substring(0, 100) + '...'
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
                          href={'/checkout?courseId=' + course.id}
                          variant='contained'
                          fullWidth
                          startIcon={<BookOnlineOutlined />}
                          sx={{
                            mt: 2,
                            fontWeight: 'bold',
                            textTransform: 'none',
                          }}
                        >
                          Book course
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
