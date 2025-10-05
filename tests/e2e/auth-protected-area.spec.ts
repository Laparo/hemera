import { expect, test } from '@playwright/test';

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
    await page.goto('/protected/dashboard');

    // Should redirect to sign-in page
    await expect(page).toHaveURL(/\/sign-in/);

    // Should preserve return URL for post-authentication redirect
    const currentUrl = page.url();
    expect(currentUrl).toContain('redirect_url');
  });

  test('should allow authenticated users to access protected area', async ({
    page,
  }) => {
    // Step 1: Sign in with Clerk
    await page.goto('/sign-in');

    // Wait for Clerk component to load
    await page.waitForSelector('[data-testid=email-input]', { timeout: 10000 });

    // Fill in test credentials
    await page.fill('[data-testid=email-input]', 'test-user@example.com');
    await page.fill('[data-testid=password-input]', 'testpassword123');
    await page.click('[data-testid=sign-in-button]');

    // Should redirect to protected dashboard after successful sign-in
    await expect(page).toHaveURL('/protected/dashboard', { timeout: 15000 });

    // Should show authenticated user interface
    await expect(page.locator('[data-testid=dashboard-title]')).toBeVisible();
    await expect(page.locator('[data-testid=user-menu]')).toBeVisible();
  });

  test('should handle authentication errors gracefully', async ({ page }) => {
    // Test invalid credentials
    await page.goto('/sign-in');

    // Wait for Clerk component to load
    await page.waitForSelector('[data-testid=email-input]', { timeout: 10000 });

    await page.fill('[data-testid=email-input]', 'invalid@example.com');
    await page.fill('[data-testid=password-input]', 'wrongpassword');
    await page.click('[data-testid=sign-in-button]');

    // Should show error message from Clerk without crashing
    // Clerk handles error display internally - we just check we remain on sign-in
    await page.waitForTimeout(2000); // Allow time for error to display

    // Should remain on sign-in page
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should handle sign-out functionality', async ({ page }) => {
    // Sign in first
    await page.goto('/sign-in');
    await page.waitForSelector('[data-testid=email-input]', { timeout: 10000 });
    await page.fill('[data-testid=email-input]', 'test-user@example.com');
    await page.fill('[data-testid=password-input]', 'testpassword123');
    await page.click('[data-testid=sign-in-button]');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/protected/dashboard', { timeout: 15000 });

    // Click user menu to access sign-out
    await page.click('[data-testid=user-menu]');

    // Wait for menu to open and click sign out (Clerk handles this internally)
    await page.waitForTimeout(1000);

    // Look for sign out option in Clerk's user menu
    const signOutButton = page.locator('text=Sign out').first();
    if (await signOutButton.isVisible()) {
      await signOutButton.click();
    }

    // Should redirect to public area
    await expect(page).toHaveURL('/', { timeout: 10000 });

    // Verify session is cleared - attempting to access protected area should redirect
    await page.goto('/protected/dashboard');
    await expect(page).toHaveURL(/\/sign-in/, { timeout: 10000 });
  });

  test('should maintain session across page refreshes', async ({ page }) => {
    // Sign in and navigate to protected area
    await page.goto('/sign-in');
    await page.waitForSelector('[data-testid=email-input]', { timeout: 10000 });
    await page.fill('[data-testid=email-input]', 'test-user@example.com');
    await page.fill('[data-testid=password-input]', 'testpassword123');
    await page.click('[data-testid=sign-in-button]');

    await expect(page).toHaveURL('/protected/dashboard', { timeout: 15000 });

    // Refresh the page
    await page.reload();

    // Should still be authenticated and on protected page
    await expect(page).toHaveURL('/protected/dashboard');
    await expect(page.locator('[data-testid=dashboard-title]')).toBeVisible();
    await expect(page.locator('[data-testid=user-menu]')).toBeVisible();
  });

  test('should handle Clerk service unavailable gracefully', async ({
    page,
  }) => {
    // Mock Clerk service failure
    await page.route('**/clerk-frontend-api/**', route => route.abort());
    await page.route('**/clerk.*.js', route => route.abort());

    await page.goto('/protected/dashboard');

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
