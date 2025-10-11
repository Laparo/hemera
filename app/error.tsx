'use client';

import { ErrorOutline, Refresh } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { useRollbar } from '@rollbar/react';
import React from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const rollbar = useRollbar();

  React.useEffect(() => {
    // Log the error to your error reporting service
    console.error('Application error:', error);

    // Report error to Rollbar following official Next.js documentation
    rollbar.error(error);
  }, [error, rollbar]);

  return (
    <Container maxWidth='md' sx={{ py: 8 }}>
      <Box
        display='flex'
        flexDirection='column'
        alignItems='center'
        textAlign='center'
        gap={3}
      >
        <ErrorOutline sx={{ fontSize: 64, color: 'error.main' }} />

        <Typography variant='h4' component='h1' gutterBottom>
          Ein Fehler ist aufgetreten
        </Typography>

        <Typography variant='body1' color='text.secondary' maxWidth='sm'>
          Es tut uns leid, aber beim Laden der Seite ist ein Problem
          aufgetreten. Bitte versuchen Sie es erneut.
        </Typography>

        {process.env.NODE_ENV === 'development' && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              maxWidth: '100%',
              overflow: 'auto',
            }}
          >
            <Typography
              variant='caption'
              component='pre'
              sx={{ whiteSpace: 'pre-wrap' }}
            >
              {error.message}
            </Typography>
            {error.digest && (
              <Typography variant='caption' color='text.secondary'>
                Error ID: {error.digest}
              </Typography>
            )}
          </Box>
        )}

        <Box display='flex' gap={2} mt={2}>
          <Button variant='contained' startIcon={<Refresh />} onClick={reset}>
            Erneut versuchen
          </Button>

          <Button
            variant='outlined'
            onClick={() => (window.location.href = '/')}
          >
            Zur Startseite
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
