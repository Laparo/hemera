import { test } from '@playwright/test';

test('debug homepage title', async ({ page }) => {
  await page.goto('/');

  // Get the actual title
  const title = await page.title();
  console.log('Homepage title:', title);
});
