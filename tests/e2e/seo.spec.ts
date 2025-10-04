import { test, expect } from '@playwright/test';

test.describe('Landing Page SEO', () => {
  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60);
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);
    expect(metaDescription!.length).toBeLessThan(160);
    
    // Check canonical URL
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBeTruthy();
  });

  test('should have Open Graph tags', async ({ page }) => {
    await page.goto('/');
    
    // OG title
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();
    
    // OG description
    const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content');
    expect(ogDescription).toBeTruthy();
    
    // OG type
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('website');
    
    // OG URL
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content');
    expect(ogUrl).toBeTruthy();
  });

  test('should have structured data (JSON-LD)', async ({ page }) => {
    await page.goto('/');
    
    // Check for JSON-LD script tags
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').count();
    expect(jsonLdScripts).toBeGreaterThan(0);
    
    // Validate Organization schema
    const organizationScript = await page.locator('script[type="application/ld+json"]').first().textContent();
    const organizationData = JSON.parse(organizationScript!);
    
    expect(organizationData['@context']).toBe('https://schema.org');
    expect(organizationData['@type']).toBe('Organization');
    expect(organizationData.name).toBeTruthy();
    expect(organizationData.url).toBeTruthy();
  });

  test('should have hero section content', async ({ page }) => {
    await page.goto('/');
    
    // Hero section should be visible
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();
    
    // Should have heading
    const heroHeading = heroSection.locator('h1');
    await expect(heroHeading).toBeVisible();
    const headingText = await heroHeading.textContent();
    expect(headingText!.length).toBeGreaterThan(10);
  });

  test('should have course overview section', async ({ page }) => {
    await page.goto('/');
    
    // Course overview should be visible
    const courseOverview = page.locator('[data-testid="course-overview"]');
    await expect(courseOverview).toBeVisible();
    
    // Should have course cards or fallback message
    const courseCards = courseOverview.locator('[data-testid="course-card"]');
    const fallbackMessage = courseOverview.locator('[data-testid="courses-fallback"]');
    
    // Either courses or fallback should be visible
    const hasCards = await courseCards.count() > 0;
    const hasFallback = await fallbackMessage.isVisible();
    
    expect(hasCards || hasFallback).toBe(true);
  });

  test('should have registration area', async ({ page }) => {
    await page.goto('/');
    
    // Registration area should be visible
    const registrationArea = page.locator('[data-testid="registration-area"]');
    await expect(registrationArea).toBeVisible();
    
    // Should have CTA button
    const ctaButton = registrationArea.locator('button, a');
    await expect(ctaButton.first()).toBeVisible();
  });
});