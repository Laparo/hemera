'use client';

import { useSignIn } from '@clerk/nextjs';
import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

export default function CustomSignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = useMemo(
    () => params?.get('redirect_url') || '/dashboard',
    [params]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isLoaded || !signIn) return;
    setSubmitting(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive?.({ session: result.createdSessionId });
        router.push(redirectTo);
      } else {
        // Other statuses like needs_second_factor
        setError(
          'Additional steps required. Please complete the sign-in flow.'
        );
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.message || 'Sign-in failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth='sm'>
      <Box
        component='form'
        onSubmit={onSubmit}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          py: 4,
        }}
      >
        <Typography component='h1' variant='h4' sx={{ mb: 1, fontWeight: 700 }}>
          Anmelden
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
          Melde dich mit E-Mail und Passwort an.
        </Typography>
        {error && (
          <Alert severity='error' sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}
        <TextField
          type='email'
          label='E-Mail'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete='email'
          disabled={!isLoaded || submitting}
        />
        <TextField
          type='password'
          label='Passwort'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete='current-password'
          disabled={!isLoaded || submitting}
        />
        <Button
          type='submit'
          variant='contained'
          size='large'
          disabled={!isLoaded || submitting}
          sx={{ mt: 1 }}
        >
          {submitting ? 'Wird angemeldet…' : 'Anmelden'}
        </Button>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
          Oder nutze die Standard-Seite: <a href='/sign-in'>/sign-in</a>
        </Typography>
      </Box>
    </Container>
  );
}
