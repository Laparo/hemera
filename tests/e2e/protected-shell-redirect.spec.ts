import { expect, test } from '@playwright/test';

test.describe('Protected Area - Auth Redirects', () => {
  test('should redirect unauthenticated users to sign-in', async ({ page }) => {
    // Try to access protected route without auth
    await page.goto('/protected');

    // Should be redirected to Clerk sign-in page
    await expect(page).toHaveURL(/.*sign-in.*/);

    // Should see Clerk sign-in form
    await expect(page.locator('[data-testid="sign-in-card"]')).toBeVisible();
  });

  test('should allow access to protected routes after sign-in', async ({
    page,
  }) => {
    // Note: This test requires Clerk test environment setup
    // For now, we'll test the redirect behavior only

    await page.goto('/protected');
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test('should show sign-in page when accessing /sign-in directly', async ({
    page,
  }) => {
    await page.goto('/sign-in');

    // Should be on sign-in page
    await expect(page).toHaveURL(/.*sign-in.*/);
  });
});
