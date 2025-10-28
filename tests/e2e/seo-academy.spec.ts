import { expect, test } from '@playwright/test';
import { gotoStable } from './helpers/nav';

const isExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;

function decodeJsonLd(content: string): any {
  try {
    return JSON.parse(content);
  } catch (e) {
    return null;
  }
}

test.describe('Academy SEO & A11y', () => {
  test('JSON-LD vorhanden und valide', async ({ page }) => {
    await gotoStable(page, '/academy');

    // Warte darauf, dass mindestens ein JSON-LD Script geladen ist
    await page.waitForSelector('script[type="application/ld+json"]', {
      state: 'attached',
      timeout: 10000,
    });

    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .all();
    expect(scripts.length).toBeGreaterThan(0);

    const jsons = [] as any[];
    for (const s of scripts) {
      const content = await s.textContent();
      if (!content) continue;
      const obj = decodeJsonLd(content);
      if (obj) jsons.push(obj);
    }

    // Es sollten mindestens Organization + WebPage/Breadcrumb vorhanden sein
    const types = jsons.map(j => j['@type']);
    expect(types).toContain('Organization');
    expect(
      types.some(t => t === 'WebPage' || t === 'BreadcrumbList')
    ).toBeTruthy();
  });
});
