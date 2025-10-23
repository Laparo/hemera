import { expect, test } from '@playwright/test';

const isExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;

test.describe('Courses empty state', () => {
  test('zeigt leeren Zustand, wenn keine Kurse vorhanden', async ({ page }) => {
    await page.goto('/courses', {
      waitUntil: isExternalBase ? 'domcontentloaded' : 'networkidle',
    });

    const cards = page.getByTestId('course-card');
    const count = await cards.count();

    if (count > 0) {
      test.info().annotations.push({
        type: 'note',
        description: 'Kurse vorhanden – Empty-State informativ übersprungen.',
      });
      return;
    }

    await expect(page.getByTestId('e2e-courses-empty')).toBeVisible();
    await expect(page.getByText(/Bald verfügbar!/i)).toBeVisible();
  });
});
