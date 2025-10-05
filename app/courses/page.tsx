import { Metadata } from 'next';
import { Container, Typography, Box } from '@mui/material';
import { generateSEOMetadata as generateSEOMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Courses - Hemera Academy',
  description:
    'Explore our comprehensive collection of programming courses covering React, TypeScript, Next.js and more.',
});

export default function CoursesPage() {
  return (
    <Container maxWidth='lg' sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant='h1'
          component='h1'
          sx={{
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            fontWeight: 'bold',
            mb: 3,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Courses
        </Typography>

        <Typography
          variant='h5'
          component='h2'
          color='text.secondary'
          sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
        >
          Our comprehensive collection of programming courses is coming soon!
        </Typography>

        <Typography
          variant='body1'
          color='text.secondary'
          sx={{ maxWidth: 500, mx: 'auto' }}
        >
          We&apos;re working hard to bring you the best learning experience.
          This page will be updated with our course catalog once the database
          schema is finalized.
        </Typography>
      </Box>
    </Container>
  );
}
