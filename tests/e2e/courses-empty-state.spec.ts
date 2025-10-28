import { expect, test } from '@playwright/test';
import { gotoStable } from './helpers/nav';

const isExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;

test.describe('Courses empty state', () => {
  test.beforeAll(async ({ request }) => {
    try {
      await request.get('http://localhost:3000/', { timeout: 3000 });
      await request.get('http://localhost:3000/courses', { timeout: 3000 });
    } catch {
      // best-effort
    }
  });

  test('zeigt leeren Zustand, wenn keine Kurse vorhanden', async ({ page }) => {
    await gotoStable(page, '/courses', { waitForTestId: 'course-overview' });

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
