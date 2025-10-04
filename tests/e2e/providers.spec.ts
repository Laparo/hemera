import { test, expect } from '@playwright/test';

// TODO: Update for Clerk authentication system
// The original test checked NextAuth providers endpoint
// Clerk handles authentication differently and doesn't expose a providers endpoint

test.skip('providers endpoint (needs Clerk implementation)', async ({ page }) => {
  // This test is temporarily disabled during the migration from NextAuth to Clerk
  // Clerk handles authentication providers differently than NextAuth
  // Authentication configuration is handled through Clerk's dashboard
});
