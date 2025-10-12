import { test } from '@playwright/test';

test.describe('Debug Clerk Dashboard Access', () => {
  test('Test Clerk authentication and dashboard access', async ({ page }) => {
    console.log('🧹 Starting debug test with clean browser state...');

    // Starte mit sauberer Authentifizierung
    await page.goto('http://localhost:3000/sign-in');

    console.log('📄 Page loaded, checking Clerk form...');

    // Warte auf Clerk-Formular
    await page.waitForSelector('[data-testid="sign-in-card"]', {
      timeout: 10000,
    });
    console.log('✅ Clerk sign-in form found');

    // Fülle E-Mail aus
    await page.fill('[name="identifier"]', 'e2e.dashboard@example.com');
    console.log('📧 Email filled');

    // Klicke weiter
    await page.click('button[data-localization-key="formButtonPrimary"]');
    console.log('🔘 Clicked continue button');

    // Warte auf Passwort-Feld
    await page.waitForSelector('[name="password"]', { timeout: 5000 });
    console.log('🔑 Password field appeared');

    // Fülle Passwort aus
    await page.fill(
      '[name="password"]',
      'E2ETestPassword2024!SecureForTesting'
    );
    console.log('🔑 Password filled');

    // Klicke Sign In
    await page.click('button[data-localization-key="formButtonPrimary"]');
    console.log('🔘 Clicked sign in button');

    // Warte und beobachte was passiert
    console.log('⏳ Waiting for authentication to complete...');
    await page.waitForTimeout(3000);

    const currentURL = page.url();
    console.log('🌐 Current URL after auth attempt:', currentURL);

    // Prüfe, ob wir weitergeleitet wurden
    if (currentURL.includes('/dashboard')) {
      console.log('✅ Successfully redirected to dashboard!');

      // Prüfe auf Dashboard-Elemente
      const dashboardTitle = await page.locator(
        '[data-testid="dashboard-title"]'
      );
      const isVisible = await dashboardTitle.isVisible();
      console.log('📊 Dashboard title visible:', isVisible);

      if (isVisible) {
        const titleText = await dashboardTitle.textContent();
        console.log('📊 Dashboard title text:', titleText);
      }
    } else {
      console.log('❌ Not redirected to dashboard. Current URL:', currentURL);

      // Schaue, was auf der aktuellen Seite ist
      const pageTitle = await page.title();
      console.log('📄 Page title:', pageTitle);

      // Prüfe auf Fehlermeldungen
      const errorMessages = await page
        .locator('.cl-formFieldError, .error, [role="alert"]')
        .allTextContents();
      if (errorMessages.length > 0) {
        console.log('❌ Error messages found:', errorMessages);
      }

      // Manuell zur Dashboard-Seite navigieren
      console.log('🔄 Manually navigating to dashboard...');
      await page.goto('http://localhost:3000/dashboard');
      await page.waitForTimeout(2000);

      const dashboardURL = page.url();
      console.log('🌐 Dashboard URL after manual navigation:', dashboardURL);

      if (dashboardURL.includes('/dashboard')) {
        console.log('✅ Dashboard accessible after manual navigation');

        const dashboardTitle = await page.locator(
          '[data-testid="dashboard-title"]'
        );
        const isVisible = await dashboardTitle.isVisible();
        console.log('📊 Dashboard title visible after manual nav:', isVisible);

        if (isVisible) {
          const titleText = await dashboardTitle.textContent();
          console.log('📊 Dashboard title text:', titleText);
        }
      } else {
        console.log('❌ Redirected away from dashboard:', dashboardURL);
      }
    }

    // Screenshot für Debugging
    await page.screenshot({
      path: 'debug-clerk-final-state.png',
      fullPage: true,
    });
    console.log('📸 Screenshot saved: debug-clerk-final-state.png');
  });
});
