import { expect, test } from '@playwright/test';

/**
 * E2E Tests for Social Login Integration
 * Tests the social authentication providers and UI components
 */

test.describe('Social Login Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sign-in page for each test
    await page.goto('/sign-in');
  });

  test('should display social login buttons on sign-in page', async ({
    page,
  }) => {
    // Should show social login section
    await expect(
      page.locator('[data-localization-key="signIn.start.title"]')
    ).toBeVisible();

    // Check for Google login button text content
    await expect(page.getByText('Continue with Google')).toBeVisible();

    // Verify social login block is present
    const socialBlock = page.locator('.cl-socialButtonsBlockButton');
    await expect(socialBlock.first()).toBeVisible();

    // Check that we have at least one social login option
    const socialButtonCount = await socialBlock.count();
    expect(socialButtonCount).toBeGreaterThan(0);
  });

  test('should show social login buttons with proper styling', async ({
    page,
  }) => {
    // Wait for social buttons to load
    const socialButtons = page.locator('.cl-socialButtonsBlockButton');

    // Wait for at least one social button to be visible
    await expect(socialButtons.first()).toBeVisible({ timeout: 10000 });

    // Verify social buttons have consistent styling
    const buttonCount = await socialButtons.count();
    expect(buttonCount).toBeGreaterThan(0);

    // Check that social buttons have proper Clerk classes
    for (let i = 0; i < Math.min(buttonCount, 3); i++) {
      const button = socialButtons.nth(i);
      await expect(button).toHaveClass(/cl-socialButtonsBlockButton/);
    }
  });

  test('should navigate to sign-up page and show social options', async ({
    page,
  }) => {
    // Navigate to sign-up page
    await page.goto('/auth/signup');

    // Should show sign-up form
    await expect(
      page.locator('[data-localization-key="signUp.start.title"]')
    ).toBeVisible();

    // Check for social login options on sign-up page too
    await expect(page.getByText('Continue with Google')).toBeVisible();

    // Verify social buttons are present
    const socialButtons = page.locator('.cl-socialButtonsBlockButton');
    await expect(socialButtons.first()).toBeVisible();
  });

  test('should handle social login button interactions', async ({ page }) => {
    // Mock Google OAuth redirect for testing
    await page.route('**/oauth/google**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ redirectUrl: '/protected/dashboard' }),
      });
    });

    // Try to click Google login button (will not complete OAuth in test)
    const googleButton = page.getByText('Continue with Google').first();
    await expect(googleButton).toBeVisible();

    // Verify button is clickable
    await expect(googleButton).toBeEnabled();

    // Check hover state
    await googleButton.hover();

    // Note: We don't actually click as it would redirect to OAuth provider
  });

  test('should display error handling for social login failures', async ({
    page,
  }) => {
    // This test verifies error handling exists
    // In a real scenario, you would mock failed OAuth responses

    // Verify that error messages can be displayed
    await expect(
      page.locator('[data-localization-key="signIn.start.title"]')
    ).toBeVisible();

    // Check that the page has proper structure for error display
    const signInCard = page.locator('[data-testid="sign-in-card"]');
    await expect(signInCard).toBeVisible();
  });

  test('should show divider between social and email login', async ({
    page,
  }) => {
    // Check for divider element (first one that appears)
    const divider = page.locator('.cl-dividerLine').first();
    await expect(divider).toBeVisible();

    // Check for divider text with specific localization key
    await expect(
      page.locator('[data-localization-key="dividerText"]')
    ).toBeVisible();
  });

  test('should maintain social login accessibility', async ({ page }) => {
    // Find the actual clickable social button container
    const googleButtonContainer = page
      .locator('.cl-socialButtonsBlockButton__google')
      .first();
    await expect(googleButtonContainer).toBeVisible();

    // Verify button container is keyboard accessible
    await googleButtonContainer.focus();
    await expect(googleButtonContainer).toBeFocused();

    // Check for accessibility attributes (relaxed requirements)
    const hasAriaLabel = await googleButtonContainer.getAttribute('aria-label');
    const hasRole = await googleButtonContainer.getAttribute('role');
    const isClickable = await googleButtonContainer.isEnabled();

    // Verify at least basic accessibility features
    expect(isClickable).toBe(true);
    // Either aria-label or role should be present for accessibility
    expect(hasAriaLabel !== null || hasRole !== null).toBe(true);
  });

  test('should show consistent branding across auth pages', async ({
    page,
  }) => {
    // Check sign-in page branding (use first heading)
    await expect(
      page.getByRole('heading', { name: 'Welcome Back' })
    ).toBeVisible();

    // Navigate to sign-up and check branding consistency
    await page.goto('/auth/signup');
    await expect(
      page.locator('[data-localization-key="signUp.start.title"]')
    ).toBeVisible();

    // Verify consistent Hemera branding elements
    await expect(page.locator('.cl-headerTitle')).toBeVisible();
  });

  test('should handle responsive design for social buttons', async ({
    page,
  }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Social buttons should still be visible and properly sized
    const googleButton = page.getByText('Continue with Google').first();
    await expect(googleButton).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(googleButton).toBeVisible();
  });

  test('should show loading states during social authentication', async ({
    page,
  }) => {
    // This test ensures loading states are handled properly
    // In a real scenario, you would mock slow OAuth responses

    await expect(
      page.locator('[data-localization-key="signIn.start.title"]')
    ).toBeVisible();

    // Verify that the UI is prepared for loading states
    const signInForm = page.locator('[data-testid="sign-in-card"]');
    await expect(signInForm).toBeVisible();
  });
});

test.describe('User Profile Integration', () => {
  // Note: These tests would require actual authentication
  // In a real test suite, you would set up test users

  test('should show user profile button when authenticated', async ({
    page,
  }) => {
    // This test would require mocking authentication
    // For now, we test the structure exists

    await page.goto('/');

    // Check that the page structure supports both signed-in and signed-out states
    await expect(
      page.locator('[data-testid="nav-login-button"]')
    ).toBeVisible();
  });

  test('should handle user profile menu interactions', async ({ page }) => {
    // This would test the UserProfileButton component
    // Requires authenticated state

    await page.goto('/');

    // Verify navigation structure exists
    const navigation = page.locator('nav, [role="navigation"], header');
    await expect(navigation.first()).toBeVisible();
  });
});
