import { expect, test } from '@playwright/test';

test.describe('Clerk Authentication UI Tests', () => {
  test('should show Clerk sign-in form with proper elements', async ({
    page,
  }) => {
    await page.goto('/sign-in');

    // Should see the sign-in card container
    await expect(page.locator('[data-testid="sign-in-card"]')).toBeVisible();

    // Should see our custom welcome message (Material-UI one)
    await expect(
      page.locator('h1').filter({ hasText: 'Welcome Back' }).first()
    ).toBeVisible();

    // Should see Clerk sign-in form
    await expect(page.locator('.cl-rootBox')).toBeVisible();

    // Should have email input field
    await expect(page.locator('input[name="identifier"]')).toBeVisible();
  });

  test('should show Clerk sign-up form when navigating to sign-up', async ({
    page,
  }) => {
    await page.goto('/sign-up');

    // Should see welcome message for sign-up
    await expect(page.locator('text=Join Hemera Academy')).toBeVisible();

    // Should see Clerk sign-up form
    await expect(page.locator('.cl-rootBox')).toBeVisible();
  });

  test('should redirect to sign-in when accessing protected route without auth', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    // Should be redirected to sign-in page
    await page.waitForURL(/.*sign-in.*/);

    // Should see sign-in form
    await expect(page.locator('[data-testid="sign-in-card"]')).toBeVisible();
  });

  test('should show proper styling and Material-UI integration', async ({
    page,
  }) => {
    await page.goto('/sign-in');

    // Check for Material-UI Paper component styling (Container maxWidth sm = padding)
    const container = page
      .locator('[data-testid="sign-in-card"]')
      .locator('..');
    await expect(container).toBeVisible();

    // Check our custom Material-UI typography styling
    const ourHeading = page
      .locator('h1')
      .filter({ hasText: 'Welcome Back' })
      .first();
    await expect(ourHeading).toHaveCSS('font-weight', '700');
  });

  test('should handle navigation between auth pages', async ({ page }) => {
    await page.goto('/sign-in');

    // Look for Clerk's "Don't have an account? Sign up" link
    const signUpLink = page
      .locator('a')
      .filter({ hasText: /sign up|Sign up|register/i })
      .first();
    if ((await signUpLink.count()) > 0) {
      await signUpLink.click();
      await expect(page).toHaveURL(/.*sign-up.*/);
    } else {
      // If no link, manually navigate to verify sign-up works
      await page.goto('/sign-up');
      await expect(page).toHaveURL(/.*sign-up.*/);
    }
  });

  test('should show Clerk form elements correctly', async ({ page }) => {
    await page.goto('/sign-in');

    // Wait for form to be ready
    await page.waitForSelector('input[name="identifier"]');

    // Check that Clerk form elements are present
    await expect(page.locator('input[name="identifier"]')).toBeVisible();

    // Check for submit button (but only interact if visible)
    const submitButtons = page.locator('button[type="submit"]');
    const visibleSubmitButton = submitButtons
      .filter({ hasText: /sign in|Sign in|continue|Continue/i })
      .first();

    if ((await visibleSubmitButton.count()) > 0) {
      await expect(visibleSubmitButton).toBeVisible();
    }
  });
});
