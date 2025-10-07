'use client';

export default function DebugEnvPage() {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL;
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL;
  const afterSignInUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL;
  const afterSignUpUrl = process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Debug</h1>
      <div style={{ marginTop: '20px' }}>
        <p>
          <strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:</strong>{' '}
          {clerkPublishableKey
            ? `${clerkPublishableKey.substring(0, 20)}...`
            : 'NOT SET'}
        </p>
        <p>
          <strong>NEXT_PUBLIC_CLERK_SIGN_IN_URL:</strong>{' '}
          {signInUrl || 'NOT SET'}
        </p>
        <p>
          <strong>NEXT_PUBLIC_CLERK_SIGN_UP_URL:</strong>{' '}
          {signUpUrl || 'NOT SET'}
        </p>
        <p>
          <strong>NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:</strong>{' '}
          {afterSignInUrl || 'NOT SET'}
        </p>
        <p>
          <strong>NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:</strong>{' '}
          {afterSignUpUrl || 'NOT SET'}
        </p>
      </div>
    </div>
  );
}
