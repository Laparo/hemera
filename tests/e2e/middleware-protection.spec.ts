import { expect, test } from '@playwright/test';

/**
 * T008: Middleware Protection Contract Test
 * File: tests/e2e/middleware-protection.spec.ts
 *
 * This test validates the MiddlewareContract from contracts/README.md
 * Tests the Clerk middleware route protection functionality
 */

test.describe('Middleware Protection Contract', () => {
  test('should protect all /protected routes', async ({ page }) => {
    // This test will fail until Clerk middleware is implemented

    const protectedRoutes = [
      '/protected/dashboard',
      '/protected/courses',
      '/protected/admin',
      '/protected/settings', // Additional protected route
      '/protected/profile', // Additional protected route
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);

      // Should redirect to sign-in page
      await expect(page).toHaveURL(/\/sign-in/);

      // Should preserve return URL for post-authentication redirect
      const currentUrl = page.url();
      expect(currentUrl).toContain('redirect_url');
    }
  });

  test('should allow access to public routes', async ({ page }) => {
    // Test that public routes are accessible without authentication

    const publicRoutes = [
      '/', // Home page
      '/sign-in', // Sign-in page
      '/sign-up', // Sign-up page
      '/about', // Public about page (if exists)
      '/api/health', // Health check endpoint
    ];

    for (const route of publicRoutes) {
      const response = await page.goto(route);

      // Should not redirect to sign-in
      expect(page.url()).toContain(route);

      // Should return successful response (or at least not auth-related error)
      if (response) {
        expect(response.status()).not.toBe(401);
        expect(response.status()).not.toBe(403);
      }
    }
  });

  test('should handle middleware authentication errors gracefully', async ({
    page,
  }) => {
    // Test middleware error handling when Clerk service is unavailable

    // Mock Clerk authentication service failure
    await page.route('**/clerk-frontend-api/**', route => route.abort());
    await page.route('**/clerk.*.js', route => route.abort());

    await page.goto('/protected/dashboard');

    // Should handle middleware errors gracefully
    // This could manifest as:
    // 1. Redirect to error page
    // 2. Redirect to sign-in with error message
    // 3. Show service unavailable page
    const hasErrorPage = page.url().includes('/error');
    const hasSignInRedirect = page.url().includes('/sign-in');
    const hasServiceError = await page
      .locator('[data-testid=service-error]')
      .isVisible();

    expect(hasErrorPage || hasSignInRedirect || hasServiceError).toBeTruthy();
  });

  test('should preserve return URL after authentication', async ({ page }) => {
    // Test that users are redirected back to intended page after sign-in

    // Attempt to access specific protected page
    await page.goto('/protected/courses');

    // Should redirect to sign-in with return URL
    await expect(page).toHaveURL(/\/sign-in/);
    const signInUrl = page.url();
    expect(signInUrl).toContain('redirect_url');
    expect(signInUrl).toContain('protected%2Fcourses');

    // Sign in
    await page.fill('[data-testid=email-input]', 'user@example.com');
    await page.fill('[data-testid=password-input]', 'userpassword123');
    await page.click('[data-testid=sign-in-button]');

    // Should redirect back to originally requested page
    await expect(page).toHaveURL('/protected/courses');
  });

  test('should handle concurrent middleware requests', async ({ page }) => {
    // Test middleware performance with multiple simultaneous requests

    // Open multiple tabs/requests to protected routes
    const pages = await Promise.all([
      page.context().newPage(),
      page.context().newPage(),
      page.context().newPage(),
    ]);

    // Navigate all pages to protected routes simultaneously
    const navigationPromises = pages.map((p, index) =>
      p.goto(`/protected/dashboard?tab=${index}`)
    );

    await Promise.all(navigationPromises);

    // All should redirect to sign-in
    for (const p of pages) {
      await expect(p).toHaveURL(/\/sign-in/);
    }

    // Clean up
    await Promise.all(pages.map(p => p.close()));
  });

  test('should handle middleware with different HTTP methods', async ({
    page,
  }) => {
    // Test middleware protection for various HTTP methods

    // Test GET request (already covered by navigation)
    await page.goto('/protected/dashboard');
    await expect(page).toHaveURL(/\/sign-in/);

    // Test POST request to protected API endpoint
    const postResponse = await page.request.post('/api/protected/data', {
      data: { test: 'data' },
    });
    expect(postResponse.status()).toBe(401); // Unauthorized

    // Test PUT request
    const putResponse = await page.request.put('/api/protected/settings', {
      data: { setting: 'value' },
    });
    expect(putResponse.status()).toBe(401); // Unauthorized

    // Test DELETE request
    const deleteResponse = await page.request.delete(
      '/api/protected/resource/123'
    );
    expect(deleteResponse.status()).toBe(401); // Unauthorized
  });

  test('should respect middleware configuration for API routes', async ({
    page,
  }) => {
    // Test that API routes are properly protected by middleware

    const protectedApiRoutes = [
      '/api/user/profile',
      '/api/courses/enrolled',
      '/api/admin/users',
    ];

    for (const route of protectedApiRoutes) {
      const response = await page.request.get(route);
      expect(response.status()).toBe(401); // Should be unauthorized
    }

    // Public API routes should be accessible
    const publicApiRoutes = [
      '/api/health',
      '/api/auth/providers', // Public auth info
    ];

    for (const route of publicApiRoutes) {
      const response = await page.request.get(route);
      expect(response.status()).not.toBe(401); // Should not be unauthorized
    }
  });

  test('should handle middleware session validation', async ({ page }) => {
    // Test middleware behavior with valid and invalid sessions

    // Test with invalid session token
    await page.context().addCookies([
      {
        name: '__session', // Clerk session cookie name
        value: 'invalid-session-token',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/protected/dashboard');

    // Should still redirect to sign-in (invalid session)
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should handle middleware performance requirements', async ({
    page,
  }) => {
    // Test that middleware meets performance requirements

    const startTime = Date.now();

    await page.goto('/protected/dashboard');

    const endTime = Date.now();
    const redirectTime = endTime - startTime;

    // Middleware redirect should be fast (<100ms as per performance goals)
    expect(redirectTime).toBeLessThan(100);
  });

  test('should handle middleware edge cases', async ({ page }) => {
    // Test various edge cases in middleware behavior

    // Test with malformed URLs
    await page.goto('/protected/../admin');
    await expect(page).toHaveURL(/\/sign-in/);

    // Test with query parameters
    await page.goto('/protected/dashboard?param=value&other=123');
    const signInUrl = page.url();
    expect(signInUrl).toContain('redirect_url');
    expect(signInUrl).toContain('param%3Dvalue');

    // Test with hash fragments
    await page.goto('/protected/dashboard#section');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should handle middleware with different user agents', async ({
    page,
  }) => {
    // Test middleware works with different browsers/clients

    // Test with mobile user agent
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    });

    await page.goto('/protected/dashboard');
    await expect(page).toHaveURL(/\/sign-in/);

    // Test with bot user agent (should still protect)
    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    });

    await page.goto('/protected/dashboard');
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('should maintain middleware security headers', async ({ page }) => {
    // Test that middleware adds appropriate security headers

    const response = await page.goto('/protected/dashboard');

    // Check for security headers (these might be added by middleware)
    const headers = response?.headers();

    // These are optional but good security practices
    // Middleware might add headers like:
    // - X-Frame-Options
    // - X-Content-Type-Options
    // - Referrer-Policy
    // - Content-Security-Policy

    // At minimum, should not expose sensitive information
    expect(headers?.['server']).not.toContain('Clerk');
    expect(headers?.['x-powered-by']).toBeFalsy();
  });
});

/**
 * Expected Test Results (before implementation):
 * ❌ All tests should FAIL initially
 * ❌ No Clerk middleware configuration exists
 * ❌ Protected routes are not protected
 * ❌ No authentication checks on API routes
 * ❌ No return URL preservation
 * ❌ No error handling for auth service failures
 * ❌ No performance optimizations
 * ❌ No security headers
 *
 * These failures confirm that the middleware contract tests are properly
 * defined and will validate the Clerk middleware implementation once
 * the middleware.ts file is configured correctly.
 */
