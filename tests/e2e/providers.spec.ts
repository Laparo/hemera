import { test, expect } from '@playwright/test';

// Contract: GET /api/auth/providers returns { providers: string[] }
test('providers endpoint returns list', async ({ request }) => {
  const res = await request.get('/api/auth/providers');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(Array.isArray(body.providers)).toBe(true);
  for (const p of body.providers) {
    expect(typeof p).toBe('string');
  }
});
