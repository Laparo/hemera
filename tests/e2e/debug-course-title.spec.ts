import { test } from '@playwright/test';

test('debug course page title', async ({ page }) => {
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Browser console error:', msg.text());
    }
  });

  // Listen for page errors
  page.on('pageerror', error => {
    console.log('Page error:', error.message);
  });

  await page.goto('/courses');

  // Get the actual title
  const title = await page.title();
  console.log('Actual title:', title);

  // Check if the page loaded correctly
  const heading = await page.locator('h1').first().textContent();
  console.log('First h1 heading:', heading);

  // Check if the navigation is present
  const navCount = await page.locator('nav').count();
  console.log('Navigation count:', navCount);

  // Check if JSON-LD scripts are present
  const jsonScripts = await page
    .locator('script[type="application/ld+json"]')
    .count();
  console.log('JSON-LD scripts count:', jsonScripts);

  // Get the page content
  const content = await page.content();
  console.log('Page contains "All Courses":', content.includes('All Courses'));
  console.log('Page contains "Courses":', content.includes('Courses'));
  console.log('Page contains "Error":', content.includes('Error'));

  // Check for title tags in HTML
  const titleElement = await page.locator('title').textContent();
  console.log('Title element content:', titleElement);
});
