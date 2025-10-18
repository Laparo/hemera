import { test, expect } from '@playwright/test';

// Verifies that legacy /protected/* paths are permanently redirected to /dashboard
// The rule is configured in next.config.mjs

test.describe('legacy /protected redirect', () => {
  test('permanent redirect to /dashboard', async ({ page, baseURL }) => {
    const resp = await page.goto('/protected/foo', {
      waitUntil: 'domcontentloaded',
    });
    expect(resp).not.toBeNull();
    // Playwright follows redirects by default; check final URL
    await expect(page).toHaveURL(new RegExp(`${baseURL}/dashboard/?$`));
  });
});
