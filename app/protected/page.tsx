import { auth } from '@clerk/nextjs/server';
import { currentUser } from '@clerk/nextjs/server';
import Link from "next/link";
import { Container, Typography, Button } from "@mui/material";
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Protected Area
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress || "User"}!
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        This is a protected page that requires authentication. Only signed-in users can access this content.
      </Typography>
      
      <Button 
        component={Link} 
        href="/" 
        variant="outlined" 
        sx={{ mr: 2 }}
      >
        Back to Home
      </Button>
    </Container>
  );
}
