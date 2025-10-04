import { expect, test } from '@playwright/test';

/**
 * E2E Tests for Clerk Authentication Integration
 * Tests the actual implemented login flow with Clerk
 */

test.describe('Clerk Authentication E2E Tests', () => {
  test('should redirect unauthenticated users to Clerk sign-in', async ({
    page,
  }) => {
    // Attempt to access protected area without authentication
    await page.goto('/protected/dashboard');

    // Should redirect to Clerk sign-in page
    await expect(page).toHaveURL(/\/sign-in/);

    // Should show Clerk sign-in form
    await expect(page.locator('h1')).toContainText('Sign in');
    await expect(page.getByText('Welcome back!')).toBeVisible();
  });

  test('should show login buttons on homepage', async ({ page }) => {
    await page.goto('/');

    // Check navigation login button
    await expect(page.locator('[data-testid=nav-login-button]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-login-button]')).toContainText(
      'Login'
    );

    // Check hero section login button
    await expect(page.locator('[data-testid=hero-login-button]')).toBeVisible();
    await expect(page.locator('[data-testid=hero-login-button]')).toContainText(
      'Login'
    );

    // Check signup button
    await expect(page.locator('[data-testid=nav-signup-button]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-signup-button]')).toContainText(
      'Sign Up'
    );
  });

  test('should navigate to Clerk sign-in from homepage buttons', async ({
    page,
  }) => {
    await page.goto('/');

    // Click navigation login button
    await page.click('[data-testid=nav-login-button]');

    // Should navigate to Clerk sign-in
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page.locator('h1')).toContainText('Sign in');

    // Go back to homepage
    await page.goto('/');

    // Click hero login button
    await page.click('[data-testid=hero-login-button]');

    // Should navigate to Clerk sign-in
    await expect(page).toHaveURL(/\/sign-in/);
    await expect(page.locator('h1')).toContainText('Sign in');
  });

  test('should show Clerk sign-in form with email/password options', async ({
    page,
  }) => {
    await page.goto('/sign-in');

    // Should show Clerk's sign-in form
    await expect(page.locator('h1')).toContainText('Sign in');

    // Should show Google sign-in option
    await expect(page.getByText('Continue with Google')).toBeVisible();

    // Should show email input
    await expect(page.locator('input[name="identifier"]')).toBeVisible();

    // Should show password section (might be hidden initially)
    await expect(page.getByText('Password')).toBeVisible({ timeout: 10000 });
  });

  test('should handle protected route access correctly', async ({ page }) => {
    // Test dashboard access
    await page.goto('/protected/dashboard');
    await expect(page).toHaveURL(/\/sign-in/);

    // Test my-courses access
    await page.goto('/protected/my-courses');
    await expect(page).toHaveURL(/\/sign-in/);

    // Test admin access
    await page.goto('/protected/admin');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should preserve redirect URL after sign-in', async ({ page }) => {
    // Try to access protected dashboard
    await page.goto('/protected/dashboard');

    // Should redirect to sign-in with redirect_url parameter
    await expect(page).toHaveURL(/\/sign-in/);

    const currentUrl = page.url();
    expect(currentUrl).toContain('redirect_url');
    expect(currentUrl).toContain('dashboard');
  });

  test('should show Clerk development mode indicators', async ({ page }) => {
    await page.goto('/sign-in');

    // Should show "Development mode" text (Clerk development indicator)
    await expect(page.getByText('Development mode')).toBeVisible();

    // Should show "Secured by Clerk" branding
    await expect(page.getByText('Secured by')).toBeVisible();
  });

  test('should handle navigation between auth pages', async ({ page }) => {
    await page.goto('/sign-in');

    // Should show link to sign-up
    const signUpLink = page.getByText('Sign up');
    await expect(signUpLink).toBeVisible();

    // Click sign-up link
    await signUpLink.click();

    // Should navigate to sign-up page
    await expect(page).toHaveURL(/\/sign-up/);
    await expect(page.locator('h1')).toContainText('Create your account');
  });

  test('should show error handling for invalid navigation', async ({
    page,
  }) => {
    // Try to access non-existent protected route
    const response = await page.goto('/protected/nonexistent');

    // Should either redirect to sign-in or show 404
    const isRedirect = page.url().includes('/sign-in');
    const is404 = response?.status() === 404;

    expect(isRedirect || is404).toBeTruthy();
  });

  test('should handle middleware protection correctly', async ({ page }) => {
    // Test various protected routes to ensure middleware is working
    const protectedRoutes = [
      '/protected/dashboard',
      '/protected/my-courses',
      '/protected/admin',
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);

      // Should redirect to sign-in for all protected routes
      await expect(page).toHaveURL(/\/sign-in/);
    }
  });
});

/**
 * Manual Test Instructions:
 *
 * To test the complete authentication flow manually:
 *
 * 1. Go to http://localhost:3000
 * 2. Click "Login" button in navigation or hero section
 * 3. Try signing in with:
 *    - Google OAuth (if configured)
 *    - Email/Password (create test account first)
 * 4. After successful sign-in, should redirect to dashboard
 * 5. Test navigation between protected pages
 * 6. Test sign-out functionality
 * 7. Verify session persistence across page refreshes
 *
 * Note: For actual login testing, you'll need:
 * - Valid Clerk API keys in .env.local
 * - Test user account or OAuth provider setup
 */
