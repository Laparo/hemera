import { isAdmin, requireAuth } from '@/lib/auth/server';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

// Force Node.js runtime for server-side authentication
export const runtime = 'nodejs';

export default async function ProtectedPage() {
  // Server-side auth check - will redirect if not authenticated
  const session = await requireAuth();
  const userIsAdmin = await isAdmin();

  return (
    <Box>
      <Typography variant='h4' component='h1' gutterBottom>
        Dashboard
      </Typography>

      <Typography variant='subtitle1' color='text.secondary' paragraph>
        Willkommen zurück, {session.email || session.userId}!
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Meine Kurse
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Hier werden Ihre aktuellen Kurse angezeigt (Feature wird in
                späteren Releases implementiert).
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6' component='h2' gutterBottom>
                Lernfortschritt
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Verfolgen Sie Ihren Lernfortschritt (Feature wird in späteren
                Releases implementiert).
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {userIsAdmin && (
          <Grid item xs={12}>
            <Card
              sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}
            >
              <CardContent>
                <Typography variant='h6' component='h2' gutterBottom>
                  Administrator-Bereich
                </Typography>
                <Typography variant='body2'>
                  Als Administrator haben Sie Zugriff auf erweiterte Funktionen.
                  Der Admin-Bereich wird in späteren Releases implementiert.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
