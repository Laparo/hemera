import { test, expect } from '@playwright/test';

/**
 * Health Endpoint Validation
 *
 * Validates API health check endpoint returns proper status response.
 */

// Health endpoint validation
test('health endpoint returns ok', async ({ request }) => {
  const res = await request.get('/api/health');
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body).toEqual({ status: 'ok' });
});
