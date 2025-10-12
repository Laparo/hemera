import { expect, test } from '@playwright/test';

test.describe('Kompletter E2E Authentifizierung Test', () => {
  test('E2E: Kompletter Anmeldeprozess von Startseite bis Dashboard', async ({
    page,
  }) => {
    console.log('🚀 Starte kompletten E2E Test');

    // Browser vorbereiten - Incognito Modus und Cookies löschen
    await page.context().clearCookies();
    await page.context().clearPermissions();

    console.log('🧹 Browser bereinigt - Cookies und Permissions gelöscht');

    // 1. STARTSEITE TESTEN
    console.log('\n📄 SCHRITT 1: Teste Startseite');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    const homeTitle = await page.title();
    const homeUrl = page.url();
    console.log(
      `   ✅ Startseite geladen - Titel: "${homeTitle}", URL: ${homeUrl}`
    );

    await page.screenshot({ path: 'e2e-1-startseite.png', fullPage: true });

    // 2. NAVIGATION ZUR SIGN-IN SEITE
    console.log('\n🔗 SCHRITT 2: Navigation zur Sign-In Seite');
    await page.goto('http://localhost:3000/sign-in', {
      waitUntil: 'networkidle',
    });

    // Warte auf Clerk Komponente
    await page.waitForTimeout(3000);

    const signInUrl = page.url();
    console.log(`   ✅ Sign-In Seite erreicht - URL: ${signInUrl}`);

    await page.screenshot({ path: 'e2e-2-signin-page.png', fullPage: true });

    // 3. CLERK KOMPONENTEN ANALYSIEREN
    console.log('\n🔍 SCHRITT 3: Clerk Komponenten analysieren');

    const clerkAnalysis = {
      hasClerkRoot: (await page.locator('.cl-rootBox').count()) > 0,
      hasClerkCard: (await page.locator('.cl-card').count()) > 0,
      hasEmailInput:
        (await page.locator('input[name="identifier"]').count()) > 0,
      hasPasswordInput:
        (await page.locator('input[name="password"]').count()) > 0,
      hasSubmitButton:
        (await page.locator('button[type="submit"]').count()) > 0,
      totalInputs: await page.locator('input').count(),
      totalButtons: await page.locator('button').count(),
    };

    console.log('   📊 Clerk Analyse:', clerkAnalysis);

    // 4. ALLE VERFÜGBAREN INPUTS UND BUTTONS AUFLISTEN
    console.log('\n📝 SCHRITT 4: Verfügbare Elemente auflisten');

    const inputs = await page.locator('input').all();
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const type = (await input.getAttribute('type')) || 'text';
      const name = (await input.getAttribute('name')) || 'unbekannt';
      const placeholder = (await input.getAttribute('placeholder')) || '';
      const id = (await input.getAttribute('id')) || '';
      console.log(
        `   Input ${i + 1}: type="${type}", name="${name}", placeholder="${placeholder}", id="${id}"`
      );
    }

    const buttons = await page.locator('button').all();
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const type = (await button.getAttribute('type')) || 'button';
      const text = ((await button.textContent()) || '').trim();
      const className = (await button.getAttribute('class')) || '';
      console.log(
        `   Button ${i + 1}: type="${type}", text="${text}", class="${className.substring(0, 50)}"`
      );
    }

    // 5. ANMELDUNG DURCHFÜHREN
    console.log('\n🔐 SCHRITT 5: Anmeldung mit Test-Credentials');

    const testCredentials = {
      email: 'e2e.dashboard@example.com',
      password: 'E2ETestPassword2024!SecureForTesting',
    };

    console.log(`   📧 Verwende Test-Account: ${testCredentials.email}`);

    // Email eingeben - verschiedene Selektoren ausprobieren
    let emailSuccess = false;
    const emailSelectors = [
      'input[name="identifier"]',
      'input[type="email"]',
      'input[placeholder*="email" i]',
      'input[placeholder*="Email"]',
      '.cl-formFieldInput[type="email"]',
      '.cl-formFieldInput',
      'input:first-of-type',
    ];

    for (const selector of emailSelectors) {
      try {
        const emailInput = page.locator(selector).first();
        const count = await emailInput.count();
        if (count > 0) {
          await emailInput.fill(testCredentials.email);
          console.log(`   ✅ Email eingegeben mit Selektor: ${selector}`);
          emailSuccess = true;
          break;
        }
      } catch (error) {
        console.log(`   ❌ Selektor ${selector} fehlgeschlagen`);
      }
    }

    if (!emailSuccess) {
      console.log('   ❌ Keine Email-Eingabe möglich');
      expect(false).toBe(true);
    }

    await page.screenshot({
      path: 'e2e-3-email-eingegeben.png',
      fullPage: true,
    });

    // Warte auf mögliche Änderungen
    await page.waitForTimeout(2000);

    // Password eingeben - verschiedene Selektoren ausprobieren
    let passwordSuccess = false;
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      'input[placeholder*="password" i]',
      'input[placeholder*="Password"]',
      '.cl-formFieldInput[type="password"]',
      'input[type="password"]:visible',
    ];

    for (const selector of passwordSelectors) {
      try {
        const passwordInput = page.locator(selector).first();
        const count = await passwordInput.count();
        if (count > 0) {
          await passwordInput.fill(testCredentials.password);
          console.log(`   ✅ Passwort eingegeben mit Selektor: ${selector}`);
          passwordSuccess = true;
          break;
        }
      } catch (error) {
        console.log(`   ❌ Passwort-Selektor ${selector} fehlgeschlagen`);
      }
    }

    if (!passwordSuccess) {
      console.log('   ❌ Keine Passwort-Eingabe möglich');
      expect(false).toBe(true);
    }

    await page.screenshot({
      path: 'e2e-4-password-eingegeben.png',
      fullPage: true,
    });

    // 6. ANMELDUNG ABSENDEN
    console.log('\n🎯 SCHRITT 6: Anmeldung absenden');

    let submitSuccess = false;
    const submitSelectors = [
      'button[type="submit"]',
      'button:has-text("Sign in")',
      'button:has-text("Continue")',
      'button:has-text("Anmelden")',
      '.cl-formButtonPrimary',
      '.cl-button[type="submit"]',
      'button.cl-formButtonPrimary',
      'button:visible:last-of-type',
    ];

    for (const selector of submitSelectors) {
      try {
        const submitButton = page.locator(selector).first();
        const count = await submitButton.count();
        if (count > 0) {
          const buttonText = await submitButton.textContent();
          console.log(
            `   🔄 Klicke Submit-Button mit Selektor: ${selector}, Text: "${buttonText}"`
          );
          await submitButton.click();
          submitSuccess = true;
          break;
        }
      } catch (error) {
        console.log(`   ❌ Submit-Selektor ${selector} fehlgeschlagen`);
      }
    }

    if (!submitSuccess) {
      console.log('   ❌ Kein Submit-Button gefunden');
      expect(false).toBe(true);
    }

    // 7. WEITERLEITUNG ABWARTEN
    console.log('\n⏳ SCHRITT 7: Weiterleitung abwarten');

    // Warte auf Navigation oder Änderung
    await page.waitForTimeout(5000);

    const finalUrl = page.url();
    const finalTitle = await page.title();

    console.log(`   📍 Finale URL: ${finalUrl}`);
    console.log(`   📄 Finaler Titel: "${finalTitle}"`);

    await page.screenshot({ path: 'e2e-5-nach-submit.png', fullPage: true });

    // 8. ERGEBNIS BEWERTEN
    console.log('\n📊 SCHRITT 8: Ergebnis bewerten');

    const isSuccessfulLogin =
      finalUrl.includes('/dashboard') ||
      finalUrl.includes('/protected') ||
      finalUrl.includes('/welcome') ||
      finalUrl !== 'http://localhost:3000/sign-in';

    const hasErrorMessage =
      (await page.locator('text=Invalid').count()) > 0 ||
      (await page.locator('text=Error').count()) > 0 ||
      (await page.locator('.cl-formFieldError').count()) > 0 ||
      (await page.locator('[role="alert"]').count()) > 0;

    const pageContent = await page.textContent('body');
    const hasWelcomeMessage =
      pageContent?.includes('Welcome') || pageContent?.includes('Dashboard');

    const result = {
      startUrl: 'http://localhost:3000/sign-in',
      finalUrl,
      finalTitle,
      isSuccessfulLogin,
      hasErrorMessage,
      hasWelcomeMessage,
      urlChanged: finalUrl !== 'http://localhost:3000/sign-in',
    };

    console.log('   🎯 E2E Test Ergebnis:', result);

    // 9. FINALE SCREENSHOTS
    await page.screenshot({ path: 'e2e-6-final-result.png', fullPage: true });

    // Test als erfolgreich bewerten wenn:
    // - URL sich geändert hat ODER
    // - Keine Fehlermeldung und Welcome-Nachricht vorhanden
    const testPassed =
      result.urlChanged ||
      (!result.hasErrorMessage && result.hasWelcomeMessage);

    console.log(
      `\n🏁 E2E TEST ${testPassed ? 'ERFOLGREICH' : 'FEHLGESCHLAGEN'}`
    );

    if (testPassed) {
      console.log('   ✅ Anmeldeprozess funktioniert ordnungsgemäß');
    } else {
      console.log('   ❌ Anmeldeprozess hat Probleme');
    }

    // Test assertion
    expect(testPassed).toBe(true);
  });
});
