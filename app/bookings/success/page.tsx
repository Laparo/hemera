'use client';

import { CheckCircle, Error } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (!sessionId || !bookingId) {
      setError('Fehlende Parameter für die Buchungsbestätigung');
      setLoading(false);
      return;
    }

    // TODO: Verify booking with API
    setLoading(false);
  }, [sessionId, bookingId]);

  if (loading) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <CircularProgress size={32} sx={{ mb: 2 }} />
            <Typography>Buchung wird überprüft...</Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth='md' sx={{ py: 4 }}>
        <Card>
          <CardHeader>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Error color='error' sx={{ mr: 1 }} />
              <Typography variant='h6' color='error'>
                Fehler bei der Buchung
              </Typography>
            </Box>
          </CardHeader>
          <CardContent>
            <Typography color='text.secondary' sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant='contained'
                component={Link}
                href='/courses'
                fullWidth
              >
                Zurück zu den Kursen
              </Button>
              <Button
                variant='outlined'
                component={Link}
                href='/dashboard'
                fullWidth
              >
                Dashboard
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      <Card>
        <CardHeader>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle color='success' sx={{ mr: 1 }} />
            <Typography variant='h6' color='success.main'>
              Buchung erfolgreich!
            </Typography>
          </Box>
        </CardHeader>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant='h5' gutterBottom>
                Kurs erfolgreich gebucht
              </Typography>
              <Typography color='text.secondary'>
                Deine Buchung wurde erfolgreich abgeschlossen.
              </Typography>
            </Box>

            <Alert severity='info'>
              Du erhältst in Kürze eine Bestätigungs-E-Mail mit allen Details
              deiner Buchung.
            </Alert>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant='contained'
                component={Link}
                href='/bookings'
                fullWidth
              >
                Meine Buchungen
              </Button>
              <Button
                variant='outlined'
                component={Link}
                href='/courses'
                fullWidth
              >
                Weitere Kurse
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <Container maxWidth='md' sx={{ py: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <CircularProgress size={32} sx={{ mb: 2 }} />
              <Typography>Lade...</Typography>
            </CardContent>
          </Card>
        </Container>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  );
}
