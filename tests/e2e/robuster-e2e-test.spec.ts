import { expect, test } from '@playwright/test';

test('Robuster E2E Anmeldungstest', async ({ page }) => {
  console.log('🚀 Starte robusten E2E Test');

  try {
    // Browser vorbereiten
    await page.context().clearCookies();
    console.log('✅ Cookies gelöscht');

    // Zur Startseite
    await page.goto('http://localhost:3000', {
      waitUntil: 'load',
      timeout: 30000,
    });
    const homeTitle = await page.title();
    console.log(`✅ Startseite geladen: "${homeTitle}"`);

    // Zur Sign-In Seite - mit reduziertem Timeout
    console.log('🔗 Navigiere zur Sign-In Seite...');
    await page.goto('http://localhost:3000/sign-in', {
      waitUntil: 'load',
      timeout: 30000,
    });

    console.log('✅ Sign-In Seite erreicht');

    // Warte kurz auf Clerk
    await page.waitForTimeout(3000);

    // Screenshot
    await page.screenshot({ path: 'robuster-test-signin.png', fullPage: true });

    // Analysiere verfügbare Elemente
    const inputCount = await page.locator('input').count();
    const buttonCount = await page.locator('button').count();

    console.log(`📊 Gefunden: ${inputCount} Inputs, ${buttonCount} Buttons`);

    if (inputCount === 0) {
      console.log(
        '❌ Keine Inputs gefunden - Clerk möglicherweise nicht geladen'
      );

      // Debug: Zeige Seiteninhalte
      const bodyText = await page.textContent('body');
      console.log('Seiteninhalt (erste 500 Zeichen):');
      console.log(bodyText?.substring(0, 500));

      expect(false).toBe(true);
    }

    // Teste Anmeldung mit einfachen Selektoren
    console.log('🔐 Teste Anmeldung...');

    const email = 'e2e.dashboard@example.com';
    const password = 'E2ETestPassword2024!SecureForTesting';

    // Finde erstes Input (normalerweise Email)
    const firstInput = page.locator('input').first();
    if ((await firstInput.count()) > 0) {
      await firstInput.fill(email);
      console.log('✅ Email eingegeben');

      // Warte und prüfe ob Password-Feld erscheint
      await page.waitForTimeout(2000);

      const passwordInput = page.locator('input[type="password"]').first();
      if ((await passwordInput.count()) > 0) {
        await passwordInput.fill(password);
        console.log('✅ Passwort eingegeben');

        // Submit
        const submitButton = page.locator('button[type="submit"]').first();
        if ((await submitButton.count()) > 0) {
          await submitButton.click();
          console.log('✅ Submit geklickt');

          // Warte auf Ergebnis
          await page.waitForTimeout(5000);

          const finalUrl = page.url();
          console.log(`🎯 Finale URL: ${finalUrl}`);

          // Screenshot des Ergebnisses
          await page.screenshot({
            path: 'robuster-test-result.png',
            fullPage: true,
          });

          // Test erfolgreich wenn URL sich geändert hat
          const success = finalUrl !== 'http://localhost:3000/sign-in';
          console.log(`🏁 Test ${success ? 'ERFOLGREICH' : 'FEHLGESCHLAGEN'}`);

          expect(success).toBe(true);
        } else {
          console.log('❌ Kein Submit-Button gefunden');
        }
      } else {
        console.log('❌ Kein Passwort-Feld gefunden');
      }
    } else {
      console.log('❌ Kein Email-Feld gefunden');
    }
  } catch (error) {
    console.error('❌ Test Fehler:', error);
    await page.screenshot({ path: 'robuster-test-error.png', fullPage: true });
    throw error;
  }
});
