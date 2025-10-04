import { FC, ReactNode } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

/**
 * HeroSection component for landing page
 * 
 * Provides reusable hero section with:
 * - Primary headline and subheadline
 * - Call-to-action buttons
 * - Responsive design
 * - SEO-optimized heading structure
 * - Customizable styling
 */

export interface HeroSectionProps {
  title: string;
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
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  children?: ReactNode;
  testId?: string;
}

export const HeroSection: FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  backgroundImage,
  backgroundColor = 'primary.main',
  textColor = 'primary.contrastText',
  children,
  testId = 'hero-section',
}) => {
  return (
    <Box
      component="section"
      data-testid={testId}
      sx={{
        bgcolor: backgroundColor,
        color: textColor,
        py: { xs: 8, md: 12 },
        textAlign: 'center',
        position: 'relative',
        ...(backgroundImage && {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }),
      }}
    >
      {backgroundImage && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1,
          }}
        />
      )}
      
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 'bold',
            mb: 3,
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        
        {subtitle && (
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 'normal',
              mb: description ? 2 : 4,
              opacity: 0.9,
            }}
          >
            {subtitle}
          </Typography>
        )}
        
        {description && (
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              mb: 4,
              opacity: 0.8,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            {description}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          {primaryCta && (
            <Button
              variant={primaryCta.variant || 'contained'}
              color={primaryCta.color || 'secondary'}
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
              color={secondaryCta.color || 'inherit'}
              size="large"
              href={secondaryCta.href}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                minWidth: '160px',
                borderColor: textColor === 'primary.contrastText' ? 'rgba(255, 255, 255, 0.5)' : undefined,
                color: textColor === 'primary.contrastText' ? 'white' : undefined,
                '&:hover': {
                  borderColor: textColor === 'primary.contrastText' ? 'white' : undefined,
                  backgroundColor: textColor === 'primary.contrastText' ? 'rgba(255, 255, 255, 0.1)' : undefined,
                },
              }}
            >
              {secondaryCta.text}
            </Button>
          )}
        </Box>
        
        {children && (
          <Box sx={{ mt: 4 }}>
            {children}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HeroSection;