import { expect, test } from '@playwright/test';

test('Test neue Sign-In Seite direkt', async ({ page }) => {
  console.log('🧪 Teste neue Sign-In Seite direkt');

  // Gehe zur Sign-In Seite
  await page.goto('http://localhost:3000/sign-in', {
    waitUntil: 'networkidle',
  });

  // Mache einen Screenshot
  await page.screenshot({ path: 'test-neue-signin.png', fullPage: true });

  // Log den Seiteninhalt
  const title = await page.title();
  const bodyText = await page.textContent('body');
  const url = page.url();

  console.log('📍 Seiteninformationen:', {
    url,
    title,
    bodyPreview: bodyText?.substring(0, 300) + '...',
  });

  // Prüfe, was auf der Seite ist
  const hasAnmeldenText = (await page.locator('text=Anmelden').count()) > 0;
  const hasWelcomeBack = (await page.locator('text=Welcome Back').count()) > 0;
  const hasClerkForm = (await page.locator('.cl-formFieldInput').count()) > 0;

  console.log('🔍 Seiteninhalte:', {
    hasAnmeldenText,
    hasWelcomeBack,
    hasClerkForm,
  });

  // Warte 3 Sekunden um alles zu laden
  await page.waitForTimeout(3000);

  // Mache noch einen Screenshot nach dem Warten
  await page.screenshot({
    path: 'test-neue-signin-after-wait.png',
    fullPage: true,
  });

  expect(hasAnmeldenText).toBe(true);
});
