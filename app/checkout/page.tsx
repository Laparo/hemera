export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import CheckoutPageClient from '@/components/checkout/CheckoutPageClient';
import { Box, CircularProgress } from '@mui/material';
import { Suspense } from 'react';

export default function CheckoutPage() {
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
      <CheckoutPageClient />
    </Suspense>
  );
}
