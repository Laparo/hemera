import { test, expect } from '@playwright/test';

test.describe('GET /sitemap.xml', () => {
  test('should return valid XML sitemap', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('xml');
    
    const xmlContent = await response.text();
    
    // Validate XML structure
    expect(xmlContent).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xmlContent).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xmlContent).toContain('</urlset>');
  });

  test('should include public routes', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const xmlContent = await response.text();
    
    // Should include landing page
    expect(xmlContent).toContain('<loc>');
    expect(xmlContent).toMatch(/<loc>.*\/?\<\/loc>/); // Landing page
    expect(xmlContent).toMatch(/<loc>.*\/courses\<\/loc>/); // Course list page
  });

  test('should include lastmod and changefreq', async ({ request }) => {
    const response = await request.get('/sitemap.xml');
    const xmlContent = await response.text();
    
    if (xmlContent.includes('<url>')) {
      expect(xmlContent).toContain('<lastmod>');
      expect(xmlContent).toContain('<changefreq>');
      expect(xmlContent).toContain('<priority>');
    }
  });
});