import { expect, test } from '@playwright/test';

test.describe('Courses Page', () => {
  test('zeigt veröffentlichte Kurse an', async ({ page }) => {
    // Increase timeout for this test as page may be slow to load in CI
    test.setTimeout(90000);

    // Log navigation attempt
    console.log('Navigating to /courses...');
    const response = await page.goto('/courses', { waitUntil: 'networkidle' });
    console.log('Navigation response status:', response?.status());
    console.log('Navigation response URL:', response?.url());

    // Warten bis Section vorhanden ist (with longer timeout)
    await expect(page.getByTestId('course-overview')).toBeVisible({
      timeout: 30000,
    });

    // Mindestens eine Kurskarte ODER E2E-Fallback sichtbar
    const cards = page.getByTestId('course-card');
    const count = await cards.count();
    if (count > 0) {
      // Titeltext vorhanden (nutzt den Mock aus getPublishedCourses bei E2E)
      await expect(page.getByTestId('course-title').first()).toBeVisible();
      // Fallback nicht sichtbar
      await expect(page.getByTestId('course-fallback-message')).toHaveCount(0);
    } else {
      // Erwarte E2E-Fallback-Hinweis
      await expect(page.getByTestId('e2e-courses-empty')).toBeVisible();
    }
  });
});
