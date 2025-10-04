import { FC } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import type { CourseWithSEO } from '@/lib/api/courses';
import { formatCoursePrice, formatCourseDuration } from '@/lib/api/courses';

/**
 * CourseCard component for individual courses
 *
 * Provides reusable course card with:
 * - Course information display
 * - Level indicators
 * - Pricing and duration
 * - Hover effects and interactions
 * - SEO-optimized structure
 */

export interface CourseCardProps {
  course: CourseWithSEO;
  variant?: 'default' | 'featured' | 'compact';
  showLevel?: boolean;
  showPrice?: boolean;
  showDuration?: boolean;
  maxDescriptionLength?: number;
  onClick?: (course: CourseWithSEO) => void;
  href?: string;
  testId?: string;
}

export const CourseCard: FC<CourseCardProps> = ({
  course,
  variant = 'default',
  showLevel = true,
  showPrice = true,
  showDuration = true,
  maxDescriptionLength = 150,
  onClick,
  href,
  testId = 'course-card',
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(course);
    } else if (href) {
      window.location.href = href;
    }
  };

  const truncatedDescription =
    course.description.length > maxDescriptionLength
      ? `${course.description.substring(0, maxDescriptionLength)}...`
      : course.description;

  const levelColor =
    course.level === 'BEGINNER'
      ? 'success'
      : course.level === 'INTERMEDIATE'
        ? 'warning'
        : 'error';

  const isClickable = onClick || href;

  return (
    <Card
      data-testid={testId}
      onClick={isClickable ? handleClick : undefined}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        cursor: isClickable ? 'pointer' : 'default',
        '&:hover': isClickable
          ? {
              transform: 'translateY(-4px)',
              boxShadow: 3,
            }
          : {
              transform: 'translateY(-2px)',
              boxShadow: 2,
            },
        ...(variant === 'featured' && {
          border: '2px solid',
          borderColor: 'primary.main',
        }),
        ...(variant === 'compact' && {
          maxWidth: 300,
        }),
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Course Level Badge */}
        {showLevel && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={course.level}
              size='small'
              color={levelColor}
              sx={{ fontWeight: 'bold' }}
              data-testid='course-level'
            />
          </Box>
        )}

        {/* Course Title */}
        <Typography
          variant='h5'
          component='h3'
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 2,
            lineHeight: 1.3,
            ...(variant === 'compact' && {
              fontSize: '1.25rem',
            }),
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
          sx={{
            mb: 3,
            ...(variant === 'compact' && {
              fontSize: '0.875rem',
            }),
          }}
          data-testid='course-description'
        >
          {truncatedDescription}
        </Typography>

        {/* Course Meta Information */}
        {(showDuration || showPrice) && (
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
            {showDuration && (
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ fontWeight: 'medium' }}
              >
                {formatCourseDuration(course.duration)}
              </Typography>
            )}

            {showPrice && (
              <Typography
                variant='h6'
                component='span'
                sx={{
                  fontWeight: 'bold',
                  color:
                    course.price && Number(course.price) > 0
                      ? 'primary.main'
                      : 'success.main',
                  ...(variant === 'compact' && {
                    fontSize: '1rem',
                  }),
                }}
              >
                {formatCoursePrice(course.price)}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
