import { test, expect } from '@playwright/test';

// Contract: GET /api/health returns { status: 'ok' }
test('health endpoint returns ok', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body).toEqual({ status: 'ok' });
});
