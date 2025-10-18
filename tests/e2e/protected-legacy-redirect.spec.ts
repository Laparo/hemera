import { expect, test } from '@playwright/test';

test.describe('Legacy /protected redirect', () => {
  test('GET /protected/foo should redirect to /dashboard (final URL)', async ({
    page,
  }) => {
    await page.goto('/protected/foo');
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
