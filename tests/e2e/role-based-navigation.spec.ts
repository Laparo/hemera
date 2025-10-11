import { expect, test } from '@playwright/test';

/**
 * T005: Role Permission Contract Test
 * File: tests/e2e/role-based-navigation.spec.ts
 *
 * This test validates the RolePermissionContract from contracts/README.md
 * Tests role-based navigation visibility and access control
 */

test.describe('Role-Based Navigation Contract', () => {
  test('user role should see limited navigation sections', async ({ page }) => {
    // This test will fail until role-based navigation is implemented

    // Sign in as regular user
    await signInAsUser(page);

    // Should redirect to protected dashboard
    await expect(page).toHaveURL('/dashboard');

    // Verify user navigation is visible
    await expect(page.locator('[data-testid=nav-dashboard]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-courses]')).toBeVisible();

    // Admin navigation should NOT be visible for regular users
    await expect(page.locator('[data-testid=nav-admin]')).not.toBeVisible();
  });

  test('admin role should see all navigation sections', async ({ page }) => {
    // This test will fail until admin role implementation is complete

    // Sign in as admin user
    await signInAsAdmin(page);

    // Should redirect to protected dashboard
    await expect(page).toHaveURL('/dashboard');

    // Verify all navigation sections are visible for admin
    await expect(page.locator('[data-testid=nav-dashboard]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-courses]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-admin]')).toBeVisible();
  });

  test('should enforce role-based access to admin section', async ({
    page,
  }) => {
    // Test that regular users cannot access admin section even with direct URL

    // Sign in as regular user
    await signInAsUser(page);

    // Attempt to navigate directly to admin section
    await page.goto('/admin');

    // Should be denied access or redirected
    // This could manifest as:
    // 1. Redirect to dashboard with error message
    // 2. 403 Forbidden page
    // 3. Admin section showing "Access Denied" message
    const isOnDashboard = page.url().includes('/dashboard');
    const hasAccessDenied = await page
      .locator('[data-testid=access-denied]')
      .isVisible();
    const hasForbiddenStatus =
      page.url().includes('/403') || page.url().includes('/forbidden');

    expect(isOnDashboard || hasAccessDenied || hasForbiddenStatus).toBeTruthy();
  });

  test('should handle unknown/invalid roles gracefully', async ({ page }) => {
    // This test will fail until role fallback logic is implemented

    // Sign in with a user that has an unknown role
    await signInWithRole(page, 'unknown_role');

    // Should fallback to default user permissions
    await expect(page.locator('[data-testid=nav-dashboard]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-courses]')).toBeVisible();
    await expect(page.locator('[data-testid=nav-admin]')).not.toBeVisible();

    // Should show user role as default or display appropriate fallback
    const userRole = await page
      .locator('[data-testid=user-role]')
      .textContent();
    expect(userRole).toBe('user'); // Should fallback to 'user' role
  });

  test('should update navigation when role changes', async ({ page }) => {
    // Test dynamic role updates (if supported)

    // Start as regular user
    await signInAsUser(page);
    await expect(page.locator('[data-testid=nav-admin]')).not.toBeVisible();

    // Simulate role promotion to admin (this would typically happen via admin interface)
    // For testing, we might need to simulate this through API or refresh with new role
    await updateUserRole(page, 'admin');

    // Refresh or navigate to trigger role check
    await page.reload();

    // Should now see admin navigation
    await expect(page.locator('[data-testid=nav-admin]')).toBeVisible();
  });

  test('should show correct user information based on role', async ({
    page,
  }) => {
    // Test user profile display shows correct role information

    // Test with user role
    await signInAsUser(page);
    await expect(page.locator('[data-testid=user-role]')).toHaveText('user');

    // Sign out and test with admin role
    await page.click('[data-testid=sign-out-button]');
    await signInAsAdmin(page);
    await expect(page.locator('[data-testid=user-role]')).toHaveText('admin');
  });

  test('should maintain role consistency across navigation', async ({
    page,
  }) => {
    // Test that role-based permissions are consistent across all protected pages

    await signInAsUser(page);

    // Navigate through all accessible sections
    await page.click('[data-testid=nav-courses]');
    await expect(page).toHaveURL('/courses');
    await expect(page.locator('[data-testid=nav-admin]')).not.toBeVisible();

    await page.click('[data-testid=nav-dashboard]');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid=nav-admin]')).not.toBeVisible();
  });
});

// Helper functions for Clerk authentication
async function signInAsUser(page: any) {
  await page.goto('/sign-in');

  // Wait for Clerk Sign In component to load
  await page.waitForSelector('[data-testid="sign-in-card"]', {
    timeout: 10000,
  });

  // Wait for Clerk form fields to be available
  await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });

  // Use test user credentials with Clerk's actual input names
  await page.fill('input[name="identifier"]', 'user@example.com');
  await page.fill('input[name="password"]', 'userpassword123');

  // Use a more specific selector for Clerk submit button that's not hidden
  const submitButton = page.locator(
    'button[data-localization-key="formButtonPrimary"]:not([aria-hidden="true"])'
  );
  await submitButton.waitFor({ state: 'visible', timeout: 10000 });
  await submitButton.click();

  await page.waitForURL('/dashboard');
}

async function signInAsAdmin(page: any) {
  await page.goto('/sign-in');

  // Wait for Clerk Sign In component to load
  await page.waitForSelector('[data-testid="sign-in-card"]', {
    timeout: 10000,
  });

  // Wait for Clerk form fields to be available
  await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });

  // Use test admin credentials with Clerk's actual input names
  await page.fill('input[name="identifier"]', 'admin@example.com');
  await page.fill('input[name="password"]', 'adminpassword123');

  // Use a more specific selector for Clerk submit button that's not hidden
  const submitButton = page.locator(
    'button[data-localization-key="formButtonPrimary"]:not([aria-hidden="true"])'
  );
  await submitButton.waitFor({ state: 'visible', timeout: 10000 });
  await submitButton.click();

  // Wait for redirect to complete
  await page.waitForURL('/dashboard', { timeout: 15000 });
}

async function signInWithRole(page: any, role: string) {
  // This would need to be implemented based on how test users with specific roles are created
  // For now, simulate by signing in as user and then somehow setting the role
  await signInAsUser(page);

  // This is a placeholder - in real implementation, this might involve:
  // 1. API call to update user metadata
  // 2. Using a test user that already has the specified role
  // 3. Mocking the role in the auth context
  console.warn(
    `signInWithRole('${role}') not fully implemented - fallback to user role`
  );
}

async function updateUserRole(page: any, newRole: string) {
  // This would typically involve an API call to update user role
  // For testing purposes, this might be simulated through:
  // 1. Admin interface interaction
  // 2. Direct API call to update user metadata
  // 3. Database manipulation for test data
  console.warn(
    `updateUserRole('${newRole}') not implemented - requires admin interface`
  );
}

/**
 * Expected Test Results (before implementation):
 * ❌ All tests should FAIL initially
 * ❌ No role-based navigation components exist
 * ❌ No user/admin role differentiation
 * ❌ No access control for admin sections
 * ❌ No user profile with role display
 * ❌ Helper functions will fail (no Clerk integration)
 *
 * These failures confirm the contract tests are properly defined and will
 * validate the role-based access control implementation.
 */
