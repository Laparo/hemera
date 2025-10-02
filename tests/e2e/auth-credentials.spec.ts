import { test, expect } from '@playwright/test';

// E2E credentials sign-in for tests (only when E2E_AUTH=credentials)

test('credentials sign-in', async ({ request, page }) => {
  test.skip(process.env.E2E_AUTH !== 'credentials', 'E2E_AUTH=credentials not set');

  const email = 'e2e@example.com';
  const password = process.env.E2E_TEST_PASSWORD || 'password';

  // NextAuth credentials provider uses POST /api/auth/callback/<provider>
  const res = await request.post('/api/auth/callback/e2e-credentials', {
    form: { csrfToken: 'test', email, password },
  });
  expect(res.ok()).toBeTruthy();

  // Hit a protected page; session cookie should be set via redirect flow
  await page.goto('/protected');
  await expect(page.getByText(/Protected/i)).toBeVisible();
});
