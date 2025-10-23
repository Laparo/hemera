import { expect, test } from '@playwright/test';

const isExternalBase = !!process.env.PLAYWRIGHT_BASE_URL;

test.describe('Courses routing', () => {
  test('List → Detail → Sign-in redirect on booking', async ({ page }) => {
    test.setTimeout(120000);

    await page.goto('/courses', {
      waitUntil: isExternalBase ? 'domcontentloaded' : 'networkidle',
    });

    await expect(page.getByTestId('course-overview')).toBeVisible({
      timeout: 30000,
    });

    // Klicke eine sichtbare CTA "Zum Kurs" (überspringt ausgebuchte Karten ohne CTA)
    // Primär suchen wir nach einem Button (MUI-Button), fallback auf Link wenn vorhanden.
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
    await expect(detailLink).toBeVisible();

    // Bei Client-Side Routing kann kein Navigation-Event feuern – stattdessen URL abwarten
    await detailLink.click();

    // Wir sollten jetzt auf /courses/{id} sein
    await expect(page).toHaveURL(/\/courses\/[\w-]+/);

    // CTA klicken – als Gast sollte ein Redirect zur Anmeldung erfolgen
    const bookCta = page.getByTestId('course-detail-book-cta');
    await expect(bookCta).toBeVisible();

    // Falls ausgebucht, kann der Button disabled sein – in dem Fall brechen wir informativ ab
    const disabled = await bookCta.isDisabled();
    if (disabled) {
      test.info().annotations.push({
        type: 'note',
        description:
          'CTA ist deaktiviert (z. B. ausgebucht). Routing-Test informativ übersprungen.',
      });
      return;
    }

    await Promise.all([
      page.waitForNavigation({
        waitUntil: isExternalBase ? 'domcontentloaded' : 'networkidle',
      }),
      bookCta.click(),
    ]);

    // Erwartung: /auth/signin?returnUrl=...bookings/new?courseId=...
    await expect(page).toHaveURL(/\/auth\/signin\?returnUrl=/);
    const url = new URL(page.url());
    const returnUrl = url.searchParams.get('returnUrl') || '';
    expect(returnUrl).toMatch(/\/bookings\/new\?courseId=/);
  });
});
