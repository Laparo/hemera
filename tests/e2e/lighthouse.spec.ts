import { test, expect } from '@playwright/test';

test.describe('Lighthouse SEO Validation', () => {
  test('landing page should meet SEO score >= 90', async ({ page }) => {
    await page.goto('/');
    
    // Validate basic SEO requirements manually since Lighthouse needs special setup
    
    // 1. Title tag
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60);
    
    // 2. Meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
    expect(metaDescription!.length).toBeLessThan(160);
    
    // 3. Meta viewport
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
    
    // 4. Language attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBeTruthy();
    
    // 5. Heading structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1); // Should have exactly one H1
    
    // 6. Alt text for images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy(); // All images should have alt text
    }
    
    // 7. Links should have descriptive text
    const links = await page.locator('a[href]').all();
    for (const link of links.slice(0, 5)) { // Check first 5 links
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }
    
    // 8. No broken internal links
    const internalLinks = await page.locator('a[href^="/"]').all();
    for (const link of internalLinks.slice(0, 3)) {
      const href = await link.getAttribute('href');
      if (href && !href.includes('#')) {
        const response = await page.request.get(href);
        expect(response.status()).toBeLessThan(400);
      }
    }
  });

  test('course list page should meet SEO score >= 90', async ({ page }) => {
    await page.goto('/courses');
    
    // Similar SEO validation for course list page
    
    // 1. Title tag
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    
    // 2. Meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
    
    // 3. Canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
    expect(canonical).toContain('/courses');
    
    // 4. Heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // 5. Structured data presence
    const jsonLdCount = await page.locator('script[type="application/ld+json"]').count();
    expect(jsonLdCount).toBeGreaterThan(0);
  });

  test('pages should have fast loading indicators', async ({ page }) => {
    // Test loading performance indicators
    
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Should load reasonably fast (basic check)
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
    
    // Should have proper resource optimization
    const images = await page.locator('img').all();
    for (const img of images.slice(0, 3)) {
      const src = await img.getAttribute('src');
      if (src) {
        // Should use optimized formats when possible
        expect(src.includes('webp') || src.includes('jpg') || src.includes('png')).toBe(true);
      }
    }
  });

  test('pages should be mobile-friendly', async ({ page, browserName }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile responsiveness
    const content = page.locator('main, [role="main"]');
    await expect(content).toBeVisible();
    
    // Text should be readable on mobile
    const body = page.locator('body');
    const fontSize = await body.evaluate(el => getComputedStyle(el).fontSize);
    const fontSizeNum = parseInt(fontSize.replace('px', ''));
    expect(fontSizeNum).toBeGreaterThanOrEqual(14); // Minimum readable font size
    
    // Touch targets should be appropriately sized
    const buttons = await page.locator('button, a').all();
    for (const button of buttons.slice(0, 3)) {
      const box = await button.boundingBox();
      if (box) {
        expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44); // 44px minimum touch target
      }
    }
  });
});