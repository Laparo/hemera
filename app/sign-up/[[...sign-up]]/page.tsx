import { SignUp } from '@clerk/nextjs';
import { Box, Container, Paper, Typography } from '@mui/material';

export default function SignUpPage() {
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
          Join Hemera Academy
        </Typography>

        <Typography
          variant='body1'
          color='text.secondary'
          sx={{ mb: 4, textAlign: 'center' }}
        >
          Create your account and start your learning journey today
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
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: {
                  'data-testid': 'sign-up-button',
                },
                formFieldInput: {
                  '&[name="emailAddress"]': {
                    'data-testid': 'email-input',
                  },
                  '&[name="password"]': {
                    'data-testid': 'password-input',
                  },
                  '&[name="firstName"]': {
                    'data-testid': 'first-name-input',
                  },
                  '&[name="lastName"]': {
                    'data-testid': 'last-name-input',
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
