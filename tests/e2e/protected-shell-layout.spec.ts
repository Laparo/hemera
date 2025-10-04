import { expect, test } from '@playwright/test';

test.describe('Protected Area - Layout & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Note: For full testing, Clerk test environment would be configured here
    // This test validates redirect behavior without auth
    await page.goto('/protected');
  });

  test('should redirect to sign-in when not authenticated', async ({
    page,
  }) => {
    // Should be redirected to Clerk sign-in
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  // Note: These tests would require Clerk test setup for authenticated scenarios
  test.skip('should show protected layout when authenticated', async ({
    page,
  }) => {
    // This would require authenticated state
    await expect(
      page.locator('[data-testid="protected-layout"]')
    ).toBeVisible();
    await expect(page.locator('[data-testid="main-navigation"]')).toBeVisible();
  });

  test.skip('should show user session info when authenticated', async ({
    page,
  }) => {
    // This would require authenticated state
    await expect(
      page.locator('[data-testid="session-indicator"]')
    ).toBeVisible();
  });

  test.skip('should show role-based navigation', async ({ page }) => {
    // This would require authenticated state with different roles
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Kurse')).toBeVisible();
    // Admin tab would be conditional based on user role
  });
});
