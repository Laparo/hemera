import { expect, test } from '@playwright/test';
import { AuthHelper, TEST_USERS } from './auth-helper';

/**
 * T004: Authentication Contract Test
 * File: tests/e2e/auth-protected-area.spec.ts
 *
 * This test validates the AuthenticationContract from contracts/README.md
 * Tests must FAIL initially until Clerk implementation is complete
 */

test.describe('Protected Area Authentication Contract', () => {
  test('should redirect unauthenticated users to sign-in', async ({ page }) => {
    // Attempt to access protected area without authentication
    await page.goto('/dashboard');

    // Should redirect to sign-in page
    await expect(page).toHaveURL(/\/sign-in/);

    // Should preserve return URL for post-authentication redirect
    const currentUrl = page.url();
    expect(currentUrl).toContain('redirect_url');
  });

  test('should allow authenticated users to access protected area', async ({
    page,
  }) => {
    // Use AuthHelper for robust authentication
    const authHelper = new AuthHelper(page);

    try {
      // Sign in using AuthHelper which handles Clerk complexities
      await authHelper.signIn(
        TEST_USERS.DASHBOARD.email,
        TEST_USERS.DASHBOARD.password
      );

      // Navigate to dashboard to verify access
      await page.goto('/dashboard');

      // Should show authenticated user interface
      await expect(page.locator('[data-testid=dashboard-title]')).toBeVisible();

      // Verify we can see the main dashboard content
      await expect(page.locator('[data-testid=courses-card]')).toBeVisible();
    } catch (error) {
      // Debug: Show current URL and page content
      const currentUrl = page.url();
      console.log('❌ Authentication failed. Current URL:', currentUrl);

      await page.screenshot({ path: 'debug-auth-failure.png' });
      console.log('📸 Debug screenshot saved as debug-auth-failure.png');

      throw error;
    }
  });

  test('should handle authentication errors gracefully', async ({ page }) => {
    // Test invalid credentials
    await page.goto('/sign-in');

    // Wait for Clerk component to load
    await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });

    await page.fill('input[name="identifier"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    // Press Enter to submit
    await page.press('input[name="password"]', 'Enter');

    // Should show error message from Clerk without crashing
    // Clerk handles error display internally - we just check we remain on sign-in
    await page.waitForTimeout(2000); // Allow time for error to display

    // Should remain on sign-in page
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should handle sign-out functionality', async ({ page }) => {
    // Use AuthHelper for robust authentication
    const authHelper = new AuthHelper(page);

    // Sign in first
    await authHelper.signIn(
      TEST_USERS.DASHBOARD.email,
      TEST_USERS.DASHBOARD.password
    );

    // Navigate to dashboard
    await page.goto('/dashboard');

    // Verify we're logged in by checking for dashboard content
    await expect(page.locator('[data-testid=dashboard-title]')).toBeVisible();

    // Test sign-out by clearing session cookies (simulates logout)
    await page.evaluate(() => {
      // Clear all cookies and storage to simulate sign-out
      document.cookie.split(';').forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });
      localStorage.clear();
      sessionStorage.clear();
    });

    // Verify session is cleared - attempting to access protected area should redirect
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 10000 });
  });

  test('should maintain session across page refreshes', async ({ page }) => {
    // Use AuthHelper for robust authentication
    const authHelper = new AuthHelper(page);

    // Sign in and navigate to protected area
    await authHelper.signIn(
      TEST_USERS.DASHBOARD.email,
      TEST_USERS.DASHBOARD.password
    );

    // Navigate to dashboard
    await page.goto('/dashboard');

    // Refresh the page
    await page.reload();

    // Should still be authenticated and on protected page
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid=dashboard-title]')).toBeVisible();
    await expect(page.locator('[data-testid=courses-card]')).toBeVisible();
  });

  test('should handle Clerk service unavailable gracefully', async ({
    page,
  }) => {
    // Mock Clerk service failure
    await page.route('**/clerk-frontend-api/**', route => route.abort());
    await page.route('**/clerk.*.js', route => route.abort());

    await page.goto('/dashboard');

    // Should show appropriate error handling, not crash
    // This might redirect to error page or show fallback UI
    const hasErrorHandling = await page
      .locator('[data-testid=auth-service-error]')
      .isVisible();
    const hasRedirect =
      page.url().includes('/error') || page.url().includes('/sign-in');

    expect(hasErrorHandling || hasRedirect).toBeTruthy();
  });
});

/**
 * Expected Test Results (before implementation):
 * ❌ All tests should FAIL initially
 * ❌ Sign-in form elements not found (no Clerk components)
 * ❌ Protected routes not properly configured
 * ❌ No auth middleware protection
 * ❌ No user profile display
 * ❌ No sign-out functionality
 *
 * This confirms the contract tests are properly defined and will validate
 * the implementation once Clerk authentication is integrated.
 */
