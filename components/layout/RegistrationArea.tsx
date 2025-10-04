import { FC, ReactNode } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

/**
 * RegistrationArea component for CTA
 * 
 * Provides reusable call-to-action section with:
 * - Registration and conversion focus
 * - Multiple CTA buttons
 * - Customizable messaging
 * - Responsive design
 * - Background and styling options
 */

export interface RegistrationAreaProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryCta?: {
    text: string;
    href: string;
    variant?: 'contained' | 'outlined';
    color?: 'primary' | 'secondary';
  };
  secondaryCta?: {
    text: string;
    href: string;
    variant?: 'contained' | 'outlined';
    color?: 'primary' | 'secondary';
  };
  backgroundColor?: string;
  textColor?: string;
  children?: ReactNode;
  testId?: string;
}

export const RegistrationArea: FC<RegistrationAreaProps> = ({
  title = 'Ready to Start Learning?',
  subtitle,
  description = 'Join our community of learners and take the next step in your career journey',
  primaryCta = {
    text: 'Get Started',
    href: '/auth/signin',
    variant: 'contained',
    color: 'primary',
  },
  secondaryCta = {
    text: 'Browse Courses',
    href: '/courses',
    variant: 'outlined',
    color: 'primary',
  },
  backgroundColor = 'grey.100',
  textColor,
  children,
  testId = 'registration-area',
}) => {
  return (
    <Box
      component="section"
      data-testid={testId}
      sx={{
        bgcolor: backgroundColor,
        py: { xs: 6, md: 8 },
        ...(textColor && { color: textColor }),
      }}
    >
      <Container maxWidth="md">
        <Box textAlign="center">
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 'bold',
              mb: 3,
            }}
          >
            {title}
          </Typography>
          
          {subtitle && (
            <Typography
              variant="h3"
              component="h3"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 'normal',
                mb: 3,
                color: textColor ? 'inherit' : 'text.secondary',
              }}
            >
              {subtitle}
            </Typography>
          )}
          
          {description && (
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mb: 4,
                color: textColor ? 'inherit' : 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              {description}
            </Typography>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            mb: children ? 4 : 0,
          }}>
            {primaryCta && (
              <Button
                variant={primaryCta.variant || 'contained'}
                color={primaryCta.color || 'primary'}
                size="large"
                href={primaryCta.href}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  minWidth: '160px',
                }}
              >
                {primaryCta.text}
              </Button>
            )}
            
            {secondaryCta && (
              <Button
                variant={secondaryCta.variant || 'outlined'}
                color={secondaryCta.color || 'primary'}
                size="large"
                href={secondaryCta.href}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  minWidth: '160px',
                }}
              >
                {secondaryCta.text}
              </Button>
            )}
          </Box>
          
          {children && (
            <Box>
              {children}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default RegistrationArea;