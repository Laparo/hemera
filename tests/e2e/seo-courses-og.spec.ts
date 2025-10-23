import { expect, test, Page } from '@playwright/test';

const isExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;

async function getMetaContent(page: Page, selector: string) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return null;
  return await el.getAttribute('content');
}

test.describe('Courses OG metadata', () => {
  test('Course list: og:image ist absolut', async ({ page }) => {
    await page.goto('/courses', {
      waitUntil: isExternalBase ? 'domcontentloaded' : 'networkidle',
    });

    const ogImage = await getMetaContent(page, 'meta[property="og:image"]');
    expect(ogImage).toBeTruthy();
    expect(ogImage!.startsWith('http')).toBeTruthy();
  });

  test('Course detail: og:image ist, wenn vorhanden, absolut', async ({
    page,
  }) => {
    await page.goto('/courses', {
      waitUntil: isExternalBase ? 'domcontentloaded' : 'networkidle',
    });

    const overview = page.getByTestId('course-overview');
    let detailLink = overview
      .getByRole('button', { name: /zum kurs/i })
      .first();
    if ((await detailLink.count()) === 0) {
      detailLink = overview.getByRole('link', { name: /zum kurs/i }).first();
    }

    if ((await detailLink.count()) === 0) {
      test.info().annotations.push({
        type: 'note',
        description:
          'Keine „Zum Kurs“-CTA gefunden (evtl. alle Kurse ausgebucht). Test informativ übersprungen.',
      });
      return;
    }

    await detailLink.click();
    await expect(page).toHaveURL(/\/courses\/[\w-]+/);

    const ogImage = await getMetaContent(page, 'meta[property="og:image"]');
    if (!ogImage) {
      test.info().annotations.push({
        type: 'note',
        description:
          'Kein og:image auf Kursdetail vorhanden – Test informativ übersprungen.',
      });
      return;
    }
    expect(ogImage.startsWith('http')).toBeTruthy();
  });
});
