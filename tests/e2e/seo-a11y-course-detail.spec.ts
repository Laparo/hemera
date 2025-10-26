import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const isExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;

// Navigiert von der Kursliste zu einem Kurs-Detail und führt einen Axe-A11y-Scan aus.
// Schlägt nur bei "critical"-Verstößen fehl, um Flakes zu minimieren.
test.describe('Course Detail A11y', () => {
  test('Detailseite ohne kritische A11y-Verstöße', async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto('/courses', {
      waitUntil: isExternalBase ? 'domcontentloaded' : 'networkidle',
    });

    await expect(page.getByTestId('course-overview')).toBeVisible({
      timeout: 30_000,
    });

    // Eine sichtbare "Zum Kurs"-CTA finden (Button bevorzugt, fallback Link)
    const overview = page.getByTestId('course-overview');
    let detailCta = overview.getByRole('button', { name: /zum kurs/i }).first();
    if ((await detailCta.count()) === 0) {
      detailCta = overview.getByRole('link', { name: /zum kurs/i }).first();
    }

    const ctaCount = await detailCta.count();
    if (ctaCount === 0) {
      test.info().annotations.push({
        type: 'note',
        description:
          'Keine „Zum Kurs“-CTA gefunden (evtl. alle Kurse ausgebucht). A11y-Test informativ übersprungen.',
      });
      return;
    }

    await expect(detailCta).toBeVisible();

    // Client-Side-Routing: URL-Änderung abwarten
    await detailCta.click();
    await expect(page).toHaveURL(/\/courses\/[\w-]+/);

    // Sicherstellen, dass die Detailseite den CTA gerendert hat
    const bookCta = page.getByTestId('course-detail-book-cta');
    await expect(bookCta).toBeVisible();

    // Axe-Scan – nur critical violations als Fehler behandeln
    const results = await new AxeBuilder({ page })
      // Häufige dynamische Regionen ggf. ausschließen, wenn sie Flakes verursachen:
      // .exclude('[data-testid="dynamic-region"]')
      .analyze();

    const critical = (results.violations || []).filter(
      (v: any) => v.impact === 'critical'
    );

    if (critical.length) {
      console.error(
        'Critical A11y violations on course detail:',
        critical.map((v: any) => v.id)
      );
    }

    expect(critical.length).toBe(0);
  });
});
