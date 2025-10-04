import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <SignUp 
        path="/sign-up" 
        routing="path" 
        signInUrl="/sign-in"
        redirectUrl="/protected"
      />
    </div>
  );
}