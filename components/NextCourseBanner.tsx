'use client';

import { Box, Button, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Course {
  id: string;
  title: string;
  date: string | null;
  slug: string;
}

export default function NextCourseBanner() {
  const [nextCourse, setNextCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextCourse = async () => {
      try {
        const response = await fetch('/api/courses/next');
        if (response.ok) {
          const course = await response.json();
          setNextCourse(course);
        }
      } catch (error) {
        console.error('Failed to fetch next course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNextCourse();
  }, []);

  if (loading || !nextCourse) {
    return null; // Don't show anything if loading or no course
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 64, // Below the AppBar (assuming default height)
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        maxWidth: 600,
        width: '90%',
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant='h6' component='div' sx={{ fontWeight: 'bold' }}>
          Nächster Kurs: {nextCourse.title}
        </Typography>
        {nextCourse.date && (
          <Typography variant='body2'>{formatDate(nextCourse.date)}</Typography>
        )}
      </Box>
      <Button
        variant='contained'
        color='secondary'
        component={Link}
        href={`/bookings/new?courseId=${nextCourse.id}`}
        sx={{ textTransform: 'none' }}
      >
        Book now
      </Button>
    </Paper>
  );
}
