'use client';

import { SignIn } from '@clerk/nextjs';
import { Box } from '@mui/material';

export default function TestSignInPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Box data-testid='simple-sign-in'>
        <SignIn />
      </Box>
    </Box>
  );
}
