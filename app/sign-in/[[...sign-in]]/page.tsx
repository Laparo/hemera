import { SignIn } from '@clerk/nextjs';
import { Box, Container, Paper, Typography } from '@mui/material';

export default function SignInPage() {
  return (
    <Container maxWidth='sm' sx={{ mt: 8, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          component='h1'
          variant='h4'
          sx={{ mb: 3, fontWeight: 'bold' }}
        >
          Welcome Back
        </Typography>

        <Typography
          variant='body1'
          color='text.secondary'
          sx={{ mb: 4, textAlign: 'center' }}
        >
          Sign in to your Hemera Academy account to continue learning
        </Typography>

        <Box
          sx={{
            width: '100%',
            '& .cl-rootBox': {
              width: '100%',
            },
            '& .cl-card': {
              boxShadow: 'none',
              border: 'none',
            },
          }}
        >
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: {
                  'data-testid': 'sign-in-button',
                },
                formFieldInput: {
                  '&[name="identifier"]': {
                    'data-testid': 'email-input',
                  },
                  '&[name="password"]': {
                    'data-testid': 'password-input',
                  },
                },
              },
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
}
