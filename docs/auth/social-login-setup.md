# Social Login Configuration Guide

This guide explains how to set up social login providers with Clerk in Hemera Academy.

## Overview

Hemera Academy uses [Clerk](https://clerk.dev) for authentication, which provides built-in support
for social login providers. No additional server-side configuration is needed - everything is
managed through the Clerk Dashboard.

## Supported Providers

- ✅ **Google** - OAuth 2.0
- ✅ **GitHub** - OAuth 2.0
- ✅ **Microsoft** - OAuth 2.0/OpenID Connect
- ✅ **Apple** - Sign in with Apple
- ✅ **Discord** - OAuth 2.0
- ✅ **Twitter/X** - OAuth 2.0

## Setup Instructions

### 1. Configure Providers in Clerk Dashboard

1. Visit your [Clerk Dashboard](https://dashboard.clerk.dev)
2. Navigate to **User & Authentication** → **Social Connections**
3. Enable the social providers you want to use
4. Follow Clerk's provider-specific setup guides

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials:
   - **Application type**: Web application
   - **Authorized redirect URIs**: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
5. Copy Client ID and Secret to Clerk Dashboard

### 3. GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App:
   - **Application name**: Hemera Academy
   - **Homepage URL**: `https://your-app-domain.com`
   - **Authorization callback URL**:
     `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
3. Copy Client ID and Secret to Clerk Dashboard

### 4. Microsoft OAuth Setup

1. Go to [Azure Portal](https://portal.azure.com/) → Azure Active Directory
2. Register a new application:
   - **Name**: Hemera Academy
   - **Supported account types**: Accounts in any organizational directory and personal Microsoft
     accounts
   - **Redirect URI**: `https://your-clerk-domain.clerk.accounts.dev/v1/oauth_callback`
3. Copy Application (client) ID and Secret to Clerk Dashboard

## Environment Variables

The following environment variables are **optional** for Clerk social logins:

```bash
# Feature flags
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=true
NEXT_PUBLIC_ENABLE_EMAIL_VERIFICATION=true
NEXT_PUBLIC_ENABLE_TWO_FACTOR=false
```

**Note**: Unlike custom OAuth implementations, Clerk handles all OAuth credentials securely in their
dashboard. You don't need to store client secrets in your environment variables.

## Testing Social Logins

### Development Testing

1. Ensure your Clerk instance is configured for development
2. Add `localhost:3000` to allowed origins in Clerk Dashboard
3. Test each provider in development mode

### Production Testing

1. Update redirect URIs to production domains
2. Verify SSL certificates are valid
3. Test with real social accounts

## UI Customization

Social login buttons are automatically styled to match your app theme:

```tsx
// Components automatically include social login styling
import { SignIn, SignUp } from '@clerk/nextjs';

// Custom styling is applied via Clerk appearance API
<SignIn appearance={clerkAppearance} />;
```

## Error Handling

Common social login errors and solutions:

### "Invalid Redirect URI"

- Verify redirect URI in provider settings matches Clerk's requirement
- Check for trailing slashes or protocol mismatches

### "App Not Approved"

- Some providers require app verification for production use
- Submit verification requests if needed

### "User Denied Access"

- Normal user behavior - handle gracefully in UI
- Provide alternative login methods

## Security Considerations

1. **Redirect URI Validation**
   - Always use HTTPS in production
   - Verify exact URI matches in provider settings

2. **Scope Limitations**
   - Request only necessary permissions
   - Review scopes for each provider

3. **User Data Handling**
   - Clerk automatically handles user data securely
   - Review data retention policies

## Troubleshooting

### Debug Mode

Enable debug logging in development:

```tsx
// Add to your layout or page component
if (process.env.NODE_ENV === 'development') {
  console.log('Clerk environment:', {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  });
}
```

### Common Issues

1. **Social buttons not appearing**
   - Check Clerk Dashboard provider configuration
   - Verify environment variables are set

2. **OAuth errors in production**
   - Verify production domain in provider settings
   - Check SSL certificate validity

3. **User information missing**
   - Review scope permissions for each provider
   - Check Clerk user object mapping

## Provider-Specific Notes

### Google

- Requires verified domain for production apps
- May require app verification for certain scopes

### GitHub

- Works with both personal and organization accounts
- Consider GitHub Teams integration for enterprise

### Microsoft

- Supports both personal and work/school accounts
- Azure AD B2C integration available for enterprise

### Apple

- iOS app configuration may be needed for seamless experience
- Requires Apple Developer account

## Support

For additional help:

- [Clerk Documentation](https://docs.clerk.dev)
- [Clerk Discord Community](https://discord.com/invite/b5rXHjb)
- Provider-specific documentation for OAuth setup
