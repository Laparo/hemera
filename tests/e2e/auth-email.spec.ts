import { test, expect } from '@playwright/test';
import fs from 'node:fs';

// E2E email sign-in flow using magic link capture
// Requires env E2E_EMAIL_CAPTURE=1 so that the app writes the magic link to /tmp/hemera-e2e-last-magic-link.txt
// Also requires NEXTAUTH_URL to match PLAYWRIGHT_BASE_URL.

test('email magic link sign-in (capture)', async ({
  page,
  request,
  baseURL,
}) => {
  test.skip(!process.env.E2E_EMAIL_CAPTURE, 'E2E_EMAIL_CAPTURE not set');
  const email = 'e2e@example.com';

  // Trigger sign-in request to send magic link
  const res = await request.post('/api/auth/signin/email', {
    form: { email },
  });
  expect(res.ok()).toBeTruthy();

  // Read captured magic link
  const linkFile = '/tmp/hemera-e2e-last-magic-link.txt';
  await test.step('wait for link file', async () => {
    for (let i = 0; i < 20; i++) {
      if (fs.existsSync(linkFile)) break;
      await new Promise(r => setTimeout(r, 250));
    }
    expect(fs.existsSync(linkFile)).toBeTruthy();
  });

  const magicLink = fs.readFileSync(linkFile, 'utf8').trim();
  expect(magicLink).toContain('/api/auth/verify-request');

  // Visit magic link to complete sign-in
  await page.goto(magicLink);

  // After successful verification, navigating to a protected page should work
  await page.goto('/protected');
  await expect(page.getByText(/Protected/i)).toBeVisible();
});
