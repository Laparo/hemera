import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from '@/lib/auth/options';
import { Container, Typography } from '@mui/material';

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <Container maxWidth='sm' sx={{ py: 8 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Unauthorized
        </Typography>
        <Typography>
          Please <Link href='/api/auth/signin'>sign in</Link> to continue.
        </Typography>
      </Container>
    );
  }
  return (
    <Container maxWidth='sm' sx={{ py: 8 }}>
      <Typography variant='h4' component='h1' gutterBottom>
        Protected
      </Typography>
      <Typography>
        Welcome, {session.user?.email ?? session.user?.name ?? 'User'}.
      </Typography>
    </Container>
  );
}
