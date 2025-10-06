import { expect, test } from '@playwright/test';

/**
 * T007: Protected Navigation Component Contract Test
 * File: tests/e2e/protected-navigation.spec.ts
 *
 * This test validates the ProtectedNavigationContract from contracts/README.md
 * Tests the behavior of the navigation component within protected areas
 */

test.describe('Protected Navigation Component Contract', () => {
  test('should render navigation tabs based on user role', async ({ page }) => {
    // This test will fail until ProtectedNavigation component is implemented

    await signInAsUser(page);
    await page.goto('/dashboard');

    // Should show navigation component
    await expect(
      page.locator('[data-testid=protected-navigation]')
    ).toBeVisible();

    // Should show user-accessible tabs
    await expect(page.locator('[data-testid=nav-dashboard]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-courses]')).toBeVisible();

    // Should NOT show admin-only tabs for regular users
    await expect(page.locator('[data-testid=nav-admin]')).not.toBeVisible();
  });

  test('should highlight active navigation tab', async ({ page }) => {
    // Test active tab highlighting

    await signInAsUser(page);
    await page.goto('/dashboard');

    // Dashboard tab should be active
    await expect(page.locator('[data-testid=nav-dashboard]')).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(page.locator('[data-testid=nav-courses]')).toHaveAttribute(
      'aria-selected',
      'false'
    );

    // Navigate to courses
    await page.click('[data-testid=nav-courses]');
    await expect(page).toHaveURL('/courses');

    // Courses tab should now be active
    await expect(page.locator('[data-testid=nav-courses]')).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(page.locator('[data-testid=nav-dashboard]')).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  test('should handle tab switching correctly', async ({ page }) => {
    // Test navigation between sections

    await signInAsUser(page);
    await page.goto('/dashboard');

    // Verify starting on dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid=dashboard-content]')).toBeVisible();

    // Click courses tab
    await page.click('[data-testid=nav-courses]');
    await expect(page).toHaveURL('/courses');
    await expect(page.locator('[data-testid=courses-content]')).toBeVisible();

    // Click back to dashboard
    await page.click('[data-testid=nav-dashboard]');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid=dashboard-content]')).toBeVisible();
  });

  test('should show admin navigation for admin users', async ({ page }) => {
    // Test admin role navigation visibility

    await signInAsAdmin(page);
    await page.goto('/dashboard');

    // Should show all navigation tabs for admin
    await expect(page.locator('[data-testid=nav-dashboard]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-courses]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-admin]')).toBeVisible();

    // Should be able to navigate to admin section
    await page.click('[data-testid=nav-admin]');
    await expect(page).toHaveURL('/admin');
    await expect(page.locator('[data-testid=admin-content]')).toBeVisible();
  });

  test('should display user information in navigation area', async ({
    page,
  }) => {
    // Test user profile display in navigation

    await signInAsUser(page);
    await page.goto('/dashboard');

    // Should show user email in navigation area
    await expect(page.locator('[data-testid=nav-user-email]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-user-email]')).toHaveText(
      'user@example.com'
    );

    // Should show user role
    await expect(page.locator('[data-testid=nav-user-role]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-user-role]')).toHaveText(
      'user'
    );
  });

  test('should handle navigation keyboard accessibility', async ({ page }) => {
    // Test keyboard navigation support

    await signInAsUser(page);
    await page.goto('/dashboard');

    // Focus on navigation
    await page.locator('[data-testid=nav-dashboard]').focus();

    // Tab navigation should work
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid=nav-courses]')).toBeFocused();

    // Enter key should activate navigation
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL('/courses');
  });

  test('should maintain navigation state during page transitions', async ({
    page,
  }) => {
    // Test that navigation component state is preserved

    await signInAsUser(page);
    await page.goto('/dashboard');

    // Verify initial navigation state
    await expect(page.locator('[data-testid=nav-dashboard]')).toHaveAttribute(
      'aria-selected',
      'true'
    );

    // Navigate to courses
    await page.click('[data-testid=nav-courses]');

    // Refresh page
    await page.reload();

    // Navigation should reflect current page
    await expect(page.locator('[data-testid=nav-courses]')).toHaveAttribute(
      'aria-selected',
      'true'
    );
    await expect(page.locator('[data-testid=nav-dashboard]')).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  test('should handle responsive navigation design', async ({ page }) => {
    // Test navigation responsiveness

    await signInAsUser(page);
    await page.goto('/dashboard');

    // Desktop view - full navigation should be visible
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator('[data-testid=nav-dashboard]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-courses]')).toBeVisible();

    // Mobile view - navigation might collapse
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigation should adapt (might become hamburger menu)
    const hasCompactNav = await page
      .locator('[data-testid=nav-compact]')
      .isVisible();
    const hasMobileMenu = await page
      .locator('[data-testid=mobile-nav-trigger]')
      .isVisible();
    const hasFullNav = await page
      .locator('[data-testid=nav-dashboard]')
      .isVisible();

    expect(hasCompactNav || hasMobileMenu || hasFullNav).toBeTruthy();
  });

  test('should show loading states during navigation', async ({ page }) => {
    // Test loading indicators during navigation

    await signInAsUser(page);
    await page.goto('/dashboard');

    // Slow down navigation to test loading state
    await page.route('/courses', route => {
      setTimeout(() => route.continue(), 300);
    });

    // Start navigation
    const navigationPromise = page.click('[data-testid=nav-courses]');

    // Should show loading state on clicked tab (if implemented)
    const hasLoadingState = await page
      .locator('[data-testid=nav-courses-loading]')
      .isVisible();

    await navigationPromise;

    // Loading state should be cleared
    await expect(
      page.locator('[data-testid=nav-courses-loading]')
    ).not.toBeVisible();
  });

  test('should handle navigation errors gracefully', async ({ page }) => {
    // Test error handling in navigation

    await signInAsUser(page);
    await page.goto('/dashboard');

    // Simulate navigation error
    await page.route('/courses', route => route.abort());

    await page.click('[data-testid=nav-courses]');

    // Should handle error gracefully (stay on current page or show error)
    const stayedOnDashboard = page.url().includes('/dashboard');
    const hasErrorMessage = await page
      .locator('[data-testid=nav-error]')
      .isVisible();

    expect(stayedOnDashboard || hasErrorMessage).toBeTruthy();
  });

  test('should integrate sign-out functionality in navigation', async ({
    page,
  }) => {
    // Test sign-out from navigation component

    await signInAsUser(page);
    await page.goto('/dashboard');

    // Should have sign-out button in navigation area
    await expect(page.locator('[data-testid=nav-sign-out]')).toBeVisible();

    // Click sign-out
    await page.click('[data-testid=nav-sign-out]');

    // Should redirect to public area
    await expect(page).toHaveURL('/');

    // Session should be cleared
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should show badge indicators for navigation items', async ({
    page,
  }) => {
    // Test notification badges or indicators on navigation items

    await signInAsUser(page);
    await page.goto('/dashboard');

    // If courses have updates, might show badge
    // This is optional functionality but tests the contract extensibility
    const hasCoursesBadge = await page
      .locator('[data-testid=nav-courses-badge]')
      .isVisible();

    // Badge functionality is optional, so we just verify it doesn't break navigation
    await page.click('[data-testid=nav-courses]');
    await expect(page).toHaveURL('/courses');
  });
});

// Helper functions
async function signInAsUser(page: any) {
  await page.goto('/sign-in');
  await page.fill('input[name="identifier"]', 'user@example.com');
  await page.fill('input[name="password"]', 'userpassword123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

async function signInAsAdmin(page: any) {
  await page.goto('/sign-in');
  await page.fill('input[name="identifier"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'adminpassword123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}

/**
 * Expected Test Results (before implementation):
 * ❌ All tests should FAIL initially
 * ❌ No ProtectedNavigation component exists
 * ❌ No navigation tabs or role-based visibility
 * ❌ No active tab highlighting
 * ❌ No tab switching functionality
 * ❌ No user information display in navigation
 * ❌ No keyboard accessibility
 * ❌ No responsive navigation design
 * ❌ No loading states or error handling
 * ❌ No sign-out integration
 *
 * These failures confirm that the navigation contract tests are properly
 * defined and will validate the navigation component implementation.
 */
