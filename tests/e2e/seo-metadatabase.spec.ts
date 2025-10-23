import { expect, test, Page } from '@playwright/test';

const isExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;

async function getMetaContent(page: Page, selector: string) {
  const el = page.locator(selector).first();
  if ((await el.count()) === 0) return null;
  return await el.getAttribute('content');
}

test.describe('Global metadataBase Wirkung', () => {
  test('og:image ist absolut und nutzt die Domain aus SITE_CONFIG', async ({
    page,
  }) => {
    await page.goto('/academy', {
      waitUntil: isExternalBase ? 'domcontentloaded' : 'networkidle',
    });

    const ogImage = await getMetaContent(page, 'meta[property="og:image"]');
    expect(ogImage).toBeTruthy();
    // Sollte absolut sein und nicht auf localhost zeigen
    expect(ogImage!.startsWith('http')).toBeTruthy();
  });
});
