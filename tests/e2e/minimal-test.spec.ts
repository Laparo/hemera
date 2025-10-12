import { expect, test } from '@playwright/test';

test('E2E: Minimaler Projekt Test', async ({ page }) => {
  console.log('🚀 MINIMALER PROJEKT TEST');

  // Nur Startseite testen
  try {
    await page.goto('http://localhost:3000', {
      waitUntil: 'load',
      timeout: 15000,
    });
    const title = await page.title();
    console.log(`✅ Startseite erfolgreich: "${title}"`);

    expect(title.length).toBeGreaterThan(0);
  } catch (error) {
    console.log(`❌ Fehler: ${(error as Error).message}`);
    throw error;
  }
});
