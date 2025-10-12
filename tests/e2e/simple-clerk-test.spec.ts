import { expect, test } from '@playwright/test';

test('Einfacher Clerk Anmeldetest', async ({ page }) => {
  console.log('🧪 Starte einfachen Clerk Test');

  try {
    // Browser vorbereiten
    await page.context().clearCookies();

    // Zur Sign-In Seite
    await page.goto('http://localhost:3000/sign-in', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    console.log('📍 Aktuelle URL:', page.url());

    // Warte auf Seite
    await page.waitForTimeout(5000);

    // Seiten-Info sammeln
    const title = await page.title();
    const bodyText = await page.textContent('body');

    console.log('📄 Seite geladen:', {
      title,
      url: page.url(),
      bodyLength: bodyText?.length || 0,
    });

    // Screenshot
    await page.screenshot({ path: 'simple-clerk-test.png', fullPage: true });

    // Clerk Komponenten suchen
    const hasClerkForm =
      (await page.locator('.cl-rootBox, .cl-card, input').count()) > 0;
    const hasAnyInput = (await page.locator('input').count()) > 0;
    const inputCount = await page.locator('input').count();

    console.log('🔍 Gefundene Elemente:', {
      hasClerkForm,
      hasAnyInput,
      inputCount,
    });

    // Alle Inputs auflisten
    const inputs = await page.locator('input').all();
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const type = (await input.getAttribute('type')) || 'text';
      const name = (await input.getAttribute('name')) || 'unknown';
      const placeholder = (await input.getAttribute('placeholder')) || '';
      console.log(
        `Input ${i + 1}: type="${type}", name="${name}", placeholder="${placeholder}"`
      );
    }

    // Test bestehen wenn mindestens ein Input gefunden wird
    expect(inputCount).toBeGreaterThan(0);
  } catch (error) {
    console.error('❌ Test Fehler:', error);
    await page.screenshot({ path: 'error-clerk-test.png', fullPage: true });
    throw error;
  }
});
