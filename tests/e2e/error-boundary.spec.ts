import { test, expect } from '@playwright/test';

// This test relies on E2E_TEST=true and NEXT_PUBLIC_ROLLBAR_ENABLED=0.
// It navigates to a dedicated crash page which throws, then asserts
// the German error UI is shown from app/error.tsx or global-error.tsx.

test.describe('Fehlergrenzen (Error Boundaries)', () => {
  test('zeigt deutsche Fehlermeldung und Buttons', async ({ page }) => {
    await page.goto('/e2e/crash');

    // Headline text from error.tsx
    await expect(
      page.getByRole('heading', { name: 'Ein Fehler ist aufgetreten' })
    ).toBeVisible();

    // Buttons in German
    await expect(
      page.getByRole('button', { name: 'Erneut versuchen' })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Zur Startseite' })
    ).toBeVisible();

    // Snapshot of body text exists in German
    await expect(page.getByText(/Bitte versuche es erneut\./)).toBeVisible();
  });
});
