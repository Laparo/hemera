import { expect, test } from '@playwright/test';

test.describe('Clerk Anmeldeprozess Test', () => {
  test('Teste kompletten Anmeldeprozess', async ({ page }) => {
    console.log('🧪 Teste kompletten Clerk Anmeldeprozess');

    // Browser Cookies löschen
    await page.context().clearCookies();
    await page.context().clearPermissions();

    // Gehe zur Sign-In Seite
    await page.goto('http://localhost:3000/sign-in', {
      waitUntil: 'networkidle',
    });

    // Warte auf Clerk-Komponente
    await page.waitForTimeout(3000);

    console.log('📍 URL nach Navigation:', page.url());

    // Screenshot der aktuellen Seite
    await page.screenshot({
      path: 'anmeldeprozess-1-start.png',
      fullPage: true,
    });

    // Log Seiteninhalte
    const title = await page.title();
    const bodyText = await page.textContent('body');

    console.log('📄 Seiteninformationen:', {
      title,
      url: page.url(),
      bodyPreview: bodyText?.substring(0, 500) + '...',
    });

    // Prüfe auf Clerk Elemente
    const clerkElements = {
      hasClerkRoot: (await page.locator('.cl-rootBox').count()) > 0,
      hasClerkCard: (await page.locator('.cl-card').count()) > 0,
      hasEmailInput:
        (await page.locator('input[name="identifier"]').count()) > 0,
      hasPasswordInput:
        (await page.locator('input[name="password"]').count()) > 0,
      hasSignInButton:
        (await page.locator('button[type="submit"]').count()) > 0,
      hasAnyInput: (await page.locator('input').count()) > 0,
      hasAnyButton: (await page.locator('button').count()) > 0,
    };

    console.log('🔍 Clerk Elemente gefunden:', clerkElements);

    // Teste verschiedene Selektoren für Eingabefelder
    const inputSelectors = [
      'input[name="identifier"]',
      'input[type="email"]',
      'input[placeholder*="email"]',
      'input[placeholder*="Email"]',
      '.cl-formFieldInput',
      'input',
    ];

    let emailInput = null;
    for (const selector of inputSelectors) {
      const count = await page.locator(selector).count();
      if (count > 0) {
        console.log(`✅ Gefunden: ${selector} (${count} Elemente)`);
        emailInput = page.locator(selector).first();
        break;
      } else {
        console.log(`❌ Nicht gefunden: ${selector}`);
      }
    }

    if (emailInput) {
      console.log('🎯 Versuche E-Mail einzugeben...');

      // Test-Credentials
      const email = 'e2e.dashboard@example.com';
      const password = 'E2ETestPassword2024!SecureForTesting';

      try {
        // E-Mail eingeben
        await emailInput.fill(email);
        console.log('✅ E-Mail eingegeben');

        // Screenshot nach E-Mail Eingabe
        await page.screenshot({
          path: 'anmeldeprozess-2-email.png',
          fullPage: true,
        });

        // Nach Passwort-Feld suchen
        await page.waitForTimeout(1000);

        const passwordSelectors = [
          'input[name="password"]',
          'input[type="password"]',
          'input[placeholder*="password"]',
          'input[placeholder*="Password"]',
        ];

        let passwordInput = null;
        for (const selector of passwordSelectors) {
          const count = await page.locator(selector).count();
          if (count > 0) {
            console.log(`✅ Passwort-Feld gefunden: ${selector}`);
            passwordInput = page.locator(selector).first();
            break;
          }
        }

        if (passwordInput) {
          await passwordInput.fill(password);
          console.log('✅ Passwort eingegeben');

          // Screenshot nach Passwort Eingabe
          await page.screenshot({
            path: 'anmeldeprozess-3-password.png',
            fullPage: true,
          });

          // Submit Button finden und klicken
          const submitSelectors = [
            'button[type="submit"]',
            'button:has-text("Sign in")',
            'button:has-text("Continue")',
            'button:has-text("Anmelden")',
            '.cl-formButtonPrimary',
            'button',
          ];

          let submitButton = null;
          for (const selector of submitSelectors) {
            const count = await page.locator(selector).count();
            if (count > 0) {
              console.log(`✅ Submit-Button gefunden: ${selector}`);
              submitButton = page.locator(selector).first();
              break;
            }
          }

          if (submitButton) {
            await submitButton.click();
            console.log('✅ Submit-Button geklickt');

            // Warte auf Navigation oder Antwort
            await page.waitForTimeout(5000);

            const finalUrl = page.url();
            console.log('🎯 Finale URL:', finalUrl);

            // Screenshot nach Submit
            await page.screenshot({
              path: 'anmeldeprozess-4-after-submit.png',
              fullPage: true,
            });

            // Prüfe ob Anmeldung erfolgreich war
            const isOnDashboard =
              finalUrl.includes('/dashboard') ||
              finalUrl.includes('/protected');
            const hasErrorMessage =
              (await page.locator('text=Invalid').count()) > 0 ||
              (await page.locator('text=Error').count()) > 0 ||
              (await page.locator('.cl-formFieldError').count()) > 0;

            console.log('📊 Anmeldeergebnis:', {
              finalUrl,
              isOnDashboard,
              hasErrorMessage,
              pageTitle: await page.title(),
            });

            // Test als erfolgreich markieren wenn wir weitergeleitet wurden
            expect(finalUrl).not.toBe('http://localhost:3000/sign-in');
          } else {
            console.log('❌ Kein Submit-Button gefunden');
            expect(false).toBe(true); // Fail the test
          }
        } else {
          console.log('❌ Kein Passwort-Feld gefunden');
          expect(false).toBe(true); // Fail the test
        }
      } catch (error) {
        console.log('❌ Fehler beim Ausfüllen:', error);
        await page.screenshot({
          path: 'anmeldeprozess-error.png',
          fullPage: true,
        });
        throw error;
      }
    } else {
      console.log('❌ Kein E-Mail-Input gefunden');

      // Debug: Alle verfügbaren Elemente auflisten
      const allInputs = await page.locator('input').all();
      const allButtons = await page.locator('button').all();

      console.log('🔍 Alle Input-Elemente:');
      for (let i = 0; i < allInputs.length; i++) {
        const input = allInputs[i];
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const placeholder = await input.getAttribute('placeholder');
        const id = await input.getAttribute('id');
        console.log(
          `  Input ${i}: type="${type}", name="${name}", placeholder="${placeholder}", id="${id}"`
        );
      }

      console.log('🔍 Alle Button-Elemente:');
      for (let i = 0; i < allButtons.length; i++) {
        const button = allButtons[i];
        const type = await button.getAttribute('type');
        const text = await button.textContent();
        console.log(
          `  Button ${i}: type="${type}", text="${text?.substring(0, 30)}"`
        );
      }

      expect(false).toBe(true); // Fail the test
    }
  });
});
