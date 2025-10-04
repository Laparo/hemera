import { test, expect } from '@playwright/test';

test.describe('Sitemap Security Validation', () => {
  test('should exclude non-public paths from sitemap', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const xmlContent = await response.text();
    
    // Ensure non-public paths are NOT included
    const forbiddenPaths = [
      '/auth/',
      '/protected/',
      '/api/auth/',
      '/admin/',
      '/signin',
      '/signup',
      '/dashboard',
    ];
    
    forbiddenPaths.forEach(path => {
      expect(xmlContent).not.toContain(path);
    });
  });

  test('should exclude draft and non-public courses', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const xmlContent = await response.text();
    
    // Should not include draft course slugs
    expect(xmlContent).not.toContain('/vuejs-mastery'); // Draft course from seed
  });

  test('robots.txt should have correct disallow rules', async ({ request }) => {
    const response = await request.get('/robots.txt');
    const content = await response.text();
    
    expect(response.status()).toBe(200);
    
    // Should disallow protected paths
    expect(content).toContain('Disallow: /auth/');
    expect(content).toContain('Disallow: /protected/');
    expect(content).toContain('Disallow: /api/auth/');
    expect(content).toContain('Disallow: /admin/');
    
    // Should reference sitemap
    expect(content).toContain('Sitemap:');
  });
});