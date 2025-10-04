import { FC } from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import type { CourseWithSEO } from '@/lib/api/courses';
import CourseCard from '@/components/course/CourseCard';

/**
 * CourseOverview component for course grid
 * 
 * Provides reusable course overview section with:
 * - Course grid layout
 * - Featured courses display
 * - Empty state handling
 * - Responsive design
 * - Call-to-action integration
 */

export interface CourseOverviewProps {
  title?: string;
  subtitle?: string;
  courses: CourseWithSEO[];
  maxCourses?: number;
  showViewAllButton?: boolean;
  viewAllHref?: string;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  emptyStateDescription?: string;
  testId?: string;
}

export const CourseOverview: FC<CourseOverviewProps> = ({
  title = 'Featured Courses',
  subtitle,
  courses,
  maxCourses,
  showViewAllButton = true,
  viewAllHref = '/courses',
  emptyStateTitle = 'No Courses Available Yet',
  emptyStateSubtitle = 'We\'re working hard to bring you amazing courses. Check back soon!',
  emptyStateDescription = 'Want to be notified when new courses are available? Sign up for our newsletter to stay updated.',
  testId = 'course-overview',
}) => {
  const displayCourses = maxCourses ? courses.slice(0, maxCourses) : courses;
  const hasMoreCourses = maxCourses && courses.length > maxCourses;

  return (
    <Box
      component="section"
      data-testid={testId}
      sx={{ py: { xs: 6, md: 10 } }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 'bold',
              mb: subtitle ? 2 : 0,
            }}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography
              variant="h3"
              component="h3"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                color: 'text.secondary',
                fontWeight: 'normal',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {/* Course Grid or Empty State */}
        {displayCourses.length > 0 ? (
          <>
            <Grid container spacing={4}>
              {displayCourses.map((course) => (
                <Grid item xs={12} sm={6} lg={4} key={course.id}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>

            {/* View All Button */}
            {(showViewAllButton && hasMoreCourses) || (showViewAllButton && courses.length > 0) ? (
              <Box textAlign="center" sx={{ mt: 6 }}>
                <Button
                  variant="outlined"
                  size="large"
                  href={viewAllHref}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                  }}
                >
                  {hasMoreCourses ? `View All ${courses.length} Courses` : 'View All Courses'}
                </Button>
              </Box>
            ) : null}
          </>
        ) : (
          <Box
            textAlign="center"
            sx={{
              py: 8,
              px: 2,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              {emptyStateTitle}
            </Typography>
            
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              {emptyStateSubtitle}
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
            >
              {emptyStateDescription}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CourseOverview;