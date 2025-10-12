import { expect, test } from '@playwright/test';

test('Test Clerk Fix - Simple Navigation', async ({ page }) => {
  console.log('🔄 Testing Clerk fix - simple navigation');

  // Navigate to sign-in page
  await page.goto('/sign-in');
  console.log('📍 Navigated to sign-in page');

  // Take a screenshot to see what's displayed
  await page.screenshot({ path: 'test-clerk-fix.png' });
  console.log('📸 Screenshot saved');

  // Check page title
  const title = await page.title();
  console.log('📄 Page title:', title);

  // Check URL
  const url = page.url();
  console.log('🔗 Current URL:', url);

  // Basic assertion
  expect(title).toContain('Hemera');
});
