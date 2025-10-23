import { expect, test } from '@playwright/test';

const isExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;

test.describe('Academy page', () => {
  test('renders and links to courses with correct metadata', async ({
    page,
  }) => {
    await page.goto('/academy', {
      waitUntil: isExternalBase ? 'domcontentloaded' : 'networkidle',
    });

    await expect(
      page.getByRole('heading', { level: 1, name: /hemera academy/i })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /alle kurse/i })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /kurse entdecken/i })
    ).toBeVisible();

    const title = await page.title();
    expect(title).toMatch(/Hemera Academy/i);
  });
});
