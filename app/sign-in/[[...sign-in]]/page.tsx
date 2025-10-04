import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <SignIn 
        path="/sign-in" 
        routing="path" 
        signUpUrl="/sign-up"
        redirectUrl="/protected"
      />
    </div>
  );
}