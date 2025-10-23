import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const isExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;

test.describe('Courses SEO & A11y', () => {
  test('JSON-LD vorhanden und A11y ohne kritische Verstöße', async ({
    page,
  }) => {
    test.setTimeout(120000);

    await page.goto('/courses', {
      waitUntil: isExternalBase ? 'domcontentloaded' : 'networkidle',
    });

    await expect(page.getByTestId('course-overview')).toBeVisible({
      timeout: 30000,
    });

    // SEO: JSON-LD vorhanden und parsebar (base64 in diesem Projekt)
    const base64Schemas = await page.$$eval(
      'script[type="application/ld+json"]',
      els => els.map(e => e.textContent || '')
    );

    expect(base64Schemas.length).toBeGreaterThan(0);

    let parsedAny = false;
    for (const content of base64Schemas) {
      if (!content) continue;
      try {
        const jsonStr = Buffer.from(content, 'base64').toString('utf8');
        const data = JSON.parse(jsonStr);
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          if (item && typeof item['@context'] === 'string') {
            parsedAny = true;
            break;
          }
        }
      } catch {
        // ignore malformed
      }
      if (parsedAny) break;
    }
    expect(parsedAny).toBeTruthy();

    // A11y: Axe-Scan (nur schwere Verstöße failen lassen)
    const results = await new AxeBuilder({ page }).analyze();

    const critical = (results.violations || []).filter(
      (v: any) => v.impact === 'critical'
    );
    if (critical.length) {
      console.error(
        'Critical A11y violations:',
        critical.map((v: any) => v.id)
      );
    }
    expect(critical.length).toBe(0);
  });
});
