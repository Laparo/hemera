import { expect, test } from '@playwright/test';

const isExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;

function decodeJsonLd(content: string): any {
  try {
    const decoded = Buffer.from(content, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

test.describe('Academy SEO & A11y', () => {
  test('JSON-LD vorhanden und valide', async ({ page }) => {
    await page.goto('/academy', {
      waitUntil: isExternalBase ? 'domcontentloaded' : 'networkidle',
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
