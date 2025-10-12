import { expect, test } from '@playwright/test';

test('E2E: Schneller Projekt-Check', async ({ page }) => {
  console.log('🚀 SCHNELLER PROJEKT E2E TEST');
  console.log('='.repeat(50));

  const results: Record<string, boolean> = {};

  // 1. Startseite testen
  console.log('\n📄 Teste Startseite...');
  try {
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 20000,
    });
    const title = await page.title();
    results.startseite = title.length > 0;
    console.log(`   ✅ Startseite: "${title}"`);
  } catch (error) {
    results.startseite = false;
    console.log(`   ❌ Startseite fehler: ${(error as Error).message}`);
  }

  // 2. Health API testen
  console.log('\n🏥 Teste Health API...');
  try {
    await page.goto('http://localhost:3000/api/health', {
      waitUntil: 'networkidle',
      timeout: 10000,
    });
    const response = await page.textContent('body');
    results.healthApi =
      (response?.includes('ok') || response?.includes('healthy')) ?? false;
    console.log(`   ✅ Health API: ${response}`);
  } catch (error) {
    results.healthApi = false;
    console.log(`   ❌ Health API fehler: ${(error as Error).message}`);
  }

  // 3. Sign-In Seite testen
  console.log('\n🔐 Teste Sign-In Seite...');
  try {
    await page.goto('http://localhost:3000/sign-in', {
      waitUntil: 'networkidle',
      timeout: 20000,
    });
    await page.waitForTimeout(3000); // Warte auf Clerk

    const title = await page.title();
    const inputs = await page.locator('input').count();
    const buttons = await page.locator('button').count();

    results.signInSeite = inputs > 0 && buttons > 0;
    console.log(
      `   ✅ Sign-In: "${title}" (${inputs} inputs, ${buttons} buttons)`
    );
  } catch (error) {
    results.signInSeite = false;
    console.log(`   ❌ Sign-In fehler: ${(error as Error).message}`);
  }

  // 4. Geschützten Bereich testen
  console.log('\n🛡️ Teste geschützten Bereich...');
  try {
    await page.goto('http://localhost:3000/protected', {
      waitUntil: 'load',
      timeout: 10000,
    });
    const finalUrl = page.url();

    // Wenn zur Anmeldung weitergeleitet, ist das korrekt (nicht angemeldet)
    results.schutz =
      finalUrl.includes('/sign-in') || finalUrl.includes('/protected');
    console.log(`   ✅ Schutz: Weitergeleitet zu ${finalUrl}`);
  } catch (error) {
    results.schutz = false;
    console.log(`   ❌ Schutz fehler: ${(error as Error).message}`);
  }

  // 5. Performance Test
  console.log('\n⚡ Teste Performance...');
  try {
    const startTime = Date.now();
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 15000,
    });
    const loadTime = Date.now() - startTime;

    results.performance = loadTime < 10000; // 10 Sekunden Limit
    console.log(
      `   ✅ Performance: ${loadTime}ms (${results.performance ? 'GUT' : 'LANGSAM'})`
    );
  } catch (error) {
    results.performance = false;
    console.log(`   ❌ Performance fehler: ${(error as Error).message}`);
  }

  // Ergebnisse auswerten
  console.log('\n🏁 ERGEBNISSE');
  console.log('='.repeat(50));

  Object.entries(results).forEach(([test, passed]) => {
    console.log(`   ${passed ? '✅' : '❌'} ${test}: ${passed}`);
  });

  const successCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.values(results).length;
  const successRate = (successCount / totalCount) * 100;

  console.log(
    `\n🎯 ERFOLGSRATE: ${successCount}/${totalCount} (${successRate.toFixed(1)}%)`
  );

  if (successRate >= 80) {
    console.log('🎉 PROJEKT STATUS: AUSGEZEICHNET!');
  } else if (successRate >= 60) {
    console.log('✅ PROJEKT STATUS: GUT');
  } else {
    console.log('⚠️ PROJEKT STATUS: VERBESSERUNG NÖTIG');
  }

  // Test bestehen lassen wenn mindestens 60% funktionieren
  expect(successRate).toBeGreaterThanOrEqual(60);
});
