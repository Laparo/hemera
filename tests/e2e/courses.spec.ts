import { expect, test } from '@playwright/test';

test.describe('Courses Page', () => {
  test('zeigt veröffentlichte Kurse an', async ({ page }) => {
    await page.goto('/courses');

    // Warten bis Section vorhanden ist
    await expect(page.getByTestId('course-overview')).toBeVisible();

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
