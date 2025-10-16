export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { Box, CircularProgress } from '@mui/material';
import { Suspense } from 'react';
import CustomSignInClient from '@/components/auth/CustomSignInClient';

export default function CustomSignInPage() {
  return (
    <Suspense
      fallback={
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight='50vh'
        >
          <CircularProgress />
        </Box>
      }
    >
      <CustomSignInClient />
    </Suspense>
  );
}
