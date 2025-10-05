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
          data-testid='sign-in-card'
          sx={{
            width: '100%',
            '& .cl-rootBox': {
              width: '100%',
            },
            '& .cl-card': {
              boxShadow: 'none',
              border: 'none',
            },
            '& .cl-formFieldInput[name="identifier"]': {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
              },
            },
          }}
        >
          <SignIn
            appearance={{
              elements: {
                rootBox: {
                  width: '100%',
                },
                card: {
                  boxShadow: 'none',
                  border: 'none',
                  backgroundColor: 'transparent',
                },
                formButtonPrimary: {
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                },
                formFieldInput: {
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                  '&:focus': {
                    borderColor: '#1976d2',
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
