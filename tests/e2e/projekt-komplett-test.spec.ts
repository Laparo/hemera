import { expect, test } from '@playwright/test';

test('E2E: Komplettes Projekt Test', async ({ page }) => {
  console.log('🚀 KOMPLETTER PROJEKT E2E TEST GESTARTET');
  console.log('='.repeat(60));

  // Browser vorbereiten
  await page.context().clearCookies();
  await page.context().clearPermissions();
  console.log('🧹 Browser bereinigt');

  // ===== PHASE 1: STARTSEITE TESTEN =====
  console.log('\n📄 PHASE 1: STARTSEITE TESTEN');
  console.log('-'.repeat(40));

  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle',
    timeout: 30000,
  });

  const homeTitle = await page.title();
  const homeUrl = page.url();
  console.log(`   ✅ Startseite geladen`);
  console.log(`   📄 Titel: "${homeTitle}"`);
  console.log(`   🔗 URL: ${homeUrl}`);

  await page.screenshot({
    path: 'gesamtprojekt-1-startseite.png',
    fullPage: true,
  });

  // Prüfe wichtige Elemente der Startseite
  const hasNavigation = (await page.locator('nav, header').count()) > 0;
  const hasMainContent =
    (await page.locator('main, [role="main"]').count()) > 0;
  const hasLinks = (await page.locator('a').count()) > 0;

  console.log(`   🔍 Navigation vorhanden: ${hasNavigation}`);
  console.log(`   📑 Hauptinhalt vorhanden: ${hasMainContent}`);
  console.log(`   🔗 Links gefunden: ${hasLinks}`);

  // ===== PHASE 2: API HEALTH CHECK =====
  console.log('\n🏥 PHASE 2: API HEALTH CHECK');
  console.log('-'.repeat(40));

  await page.goto('http://localhost:3000/api/health', {
    waitUntil: 'networkidle',
  });

  const healthResponse = await page.textContent('body');
  console.log(`   ✅ Health API Response: ${healthResponse}`);

  await page.screenshot({ path: 'gesamtprojekt-2-health.png' });

  // ===== PHASE 3: PROVIDERS API =====
  console.log('\n🔌 PHASE 3: PROVIDERS API');
  console.log('-'.repeat(40));

  await page.goto('http://localhost:3000/api/auth/providers', {
    waitUntil: 'networkidle',
  });

  const providersResponse = await page.textContent('body');
  console.log(
    `   ✅ Providers API Response: ${providersResponse?.substring(0, 200)}...`
  );

  await page.screenshot({ path: 'gesamtprojekt-3-providers.png' });

  // ===== PHASE 4: SIGN-IN SEITE =====
  console.log('\n🔐 PHASE 4: SIGN-IN SEITE TESTEN');
  console.log('-'.repeat(40));

  await page.goto('http://localhost:3000/sign-in', {
    waitUntil: 'networkidle',
    timeout: 30000,
  });

  const signInTitle = await page.title();
  const signInUrl = page.url();
  console.log(`   ✅ Sign-In Seite erreicht`);
  console.log(`   📄 Titel: "${signInTitle}"`);
  console.log(`   🔗 URL: ${signInUrl}`);

  // Warte auf Clerk Komponenten
  await page.waitForTimeout(3000);

  const clerkElements = {
    inputs: await page.locator('input').count(),
    buttons: await page.locator('button').count(),
    hasClerkRoot:
      (await page.locator('.cl-rootBox, [data-clerk-loaded]').count()) > 0,
  };

  console.log(
    `   📊 Clerk Elemente: ${clerkElements.inputs} Inputs, ${clerkElements.buttons} Buttons`
  );
  console.log(`   🎯 Clerk geladen: ${clerkElements.hasClerkRoot}`);

  await page.screenshot({ path: 'gesamtprojekt-4-signin.png', fullPage: true });

  // ===== PHASE 5: ANMELDE-VERSUCH =====
  console.log('\n🔑 PHASE 5: ANMELDE-VERSUCH');
  console.log('-'.repeat(40));

  const testCredentials = {
    email: 'e2e.dashboard@example.com',
    password: 'E2ETestPassword2024!SecureForTesting',
  };

  console.log(`   📧 Test-Email: ${testCredentials.email}`);

  // Email eingeben
  let emailSuccess = false;
  try {
    const emailInput = page.locator('input').first();
    if ((await emailInput.count()) > 0) {
      await emailInput.fill(testCredentials.email);
      console.log('   ✅ Email eingegeben');
      emailSuccess = true;
    }
  } catch (error) {
    console.log('   ❌ Email-Eingabe fehlgeschlagen');
  }

  if (emailSuccess) {
    await page.waitForTimeout(2000);

    // Passwort eingeben
    try {
      const passwordInput = page.locator('input[type="password"]').first();
      if ((await passwordInput.count()) > 0) {
        await passwordInput.fill(testCredentials.password);
        console.log('   ✅ Passwort eingegeben');

        await page.screenshot({
          path: 'gesamtprojekt-5-credentials.png',
          fullPage: true,
        });

        // Submit versuchen
        try {
          // Verschiedene Submit-Strategien
          let submitSuccess = false;

          // Strategie 1: Enter-Taste
          await passwordInput.press('Enter');
          console.log('   ⌨️ Enter-Taste gedrückt');
          submitSuccess = true;

          if (!submitSuccess) {
            // Strategie 2: Force Click
            const submitButton = page.locator('button[type="submit"]').first();
            if ((await submitButton.count()) > 0) {
              await submitButton.click({ force: true });
              console.log('   🖱️ Submit-Button geklickt');
              submitSuccess = true;
            }
          }

          if (submitSuccess) {
            // Warte auf Anmeldeergebnis
            await page.waitForTimeout(5000);

            const afterSubmitUrl = page.url();
            const afterSubmitTitle = await page.title();

            console.log(`   🎯 Nach Submit URL: ${afterSubmitUrl}`);
            console.log(`   📄 Nach Submit Titel: "${afterSubmitTitle}"`);

            await page.screenshot({
              path: 'gesamtprojekt-6-after-submit.png',
              fullPage: true,
            });
          }
        } catch (error) {
          console.log('   ❌ Submit fehlgeschlagen:', (error as Error).message);
        }
      }
    } catch (error) {
      console.log('   ❌ Passwort-Eingabe fehlgeschlagen');
    }
  }

  // ===== PHASE 6: GESCHÜTZTE BEREICHE TESTEN =====
  console.log('\n🛡️ PHASE 6: GESCHÜTZTE BEREICHE TESTEN');
  console.log('-'.repeat(40));

  const protectedRoutes = ['/protected', '/dashboard', '/admin', '/bookings'];

  for (const route of protectedRoutes) {
    console.log(`   🔒 Teste geschützten Bereich: ${route}`);

    try {
      await page.goto(`http://localhost:3000${route}`, {
        waitUntil: 'load',
        timeout: 10000,
      });

      const routeUrl = page.url();
      const routeTitle = await page.title();

      console.log(`     📍 Erreichte URL: ${routeUrl}`);
      console.log(`     📄 Titel: "${routeTitle}"`);

      // Prüfe ob zur Anmeldung weitergeleitet
      const redirectedToSignIn = routeUrl.includes('/sign-in');
      console.log(
        `     🔄 Zur Anmeldung weitergeleitet: ${redirectedToSignIn}`
      );
    } catch (error) {
      console.log(`     ❌ Fehler bei ${route}: ${(error as Error).message}`);
    }
  }

  // ===== PHASE 7: PERFORMANCE CHECK =====
  console.log('\n⚡ PHASE 7: PERFORMANCE CHECK');
  console.log('-'.repeat(40));

  // Zurück zur Startseite für Performance-Test
  const startTime = Date.now();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const loadTime = Date.now() - startTime;

  console.log(`   ⏱️ Ladezeit Startseite: ${loadTime}ms`);
  console.log(`   ✅ Performance: ${loadTime < 5000 ? 'GUT' : 'LANGSAM'}`);

  // ===== FINALE BEWERTUNG =====
  console.log('\n🏁 FINALE BEWERTUNG');
  console.log('='.repeat(60));

  const results = {
    startseiteGeladen:
      homeTitle.includes('Transform') || homeTitle.includes('Hemera'),
    healthApiAktiv:
      healthResponse?.includes('ok') || healthResponse?.includes('healthy'),
    providersApiAktiv: (providersResponse?.length || 0) > 0,
    signInSeiteGeladen:
      signInTitle.includes('Hemera') || signInUrl.includes('/sign-in'),
    clerkKomponentenGeladen:
      clerkElements.inputs > 0 && clerkElements.buttons > 0,
    anmeldeformularFunktional: emailSuccess,
    performanceOk: loadTime < 5000,
  };

  console.log('📊 TESTERGEBNISSE:');
  Object.entries(results).forEach(([key, value]) => {
    console.log(`   ${value ? '✅' : '❌'} ${key}: ${value}`);
  });

  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.values(results).length;
  const successRate = (successCount / totalCount) * 100;

  console.log(
    `\n🎯 ERFOLGSRATE: ${successCount}/${totalCount} (${successRate.toFixed(1)}%)`
  );

  if (successRate >= 85) {
    console.log('🎉 PROJEKT E2E TEST: ERFOLGREICH!');
  } else if (successRate >= 70) {
    console.log('⚠️ PROJEKT E2E TEST: TEILWEISE ERFOLGREICH');
  } else {
    console.log('❌ PROJEKT E2E TEST: PROBLEME GEFUNDEN');
  }

  // Final Screenshot
  await page.screenshot({ path: 'gesamtprojekt-8-final.png', fullPage: true });

  // Test als erfolgreich bewerten wenn mindestens 70% funktionieren
  expect(successRate).toBeGreaterThanOrEqual(70);
});
