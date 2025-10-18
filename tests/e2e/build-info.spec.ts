import { expect, test } from '@playwright/test';

/**
 * BuildInfo badge smoke test
 *
 * Validates that the BuildInfo badge renders in non-E2E production/testing contexts.
 * In CI production E2E (PLAYWRIGHT_BASE_URL is set), the app runs with real providers,
 * so the badge should be visible.
 */

test('build info badge is present on home', async ({ page }) => {
  // In E2E/dev mode, die App zeigt das BuildInfo-Badge immer an.
  await page.goto('/');
  // The badge may render asynchronously after hydration
  const badge = page.getByTestId('build-info');
  await expect(badge).toBeVisible({ timeout: 10000 });

  // Optionally check title attribute contains sensible info
  const title = await badge.getAttribute('title');
  expect(title || '').toContain('Build');
});
