import { test, expect } from '@playwright/test';

test.describe('Course List Page', () => {
  test('should display course list page', async ({ page }) => {
    await page.goto('/courses');

    // Page should load successfully
    expect(page.url()).toContain('/courses');

    // Should have page title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.includes('Courses') || title.includes('Kurse')).toBe(true);
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/courses');

    // Check meta description
    const metaDescription = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(50);

    // Check canonical URL
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute('href');
    expect(canonical).toContain('/courses');
  });

  test('should display course cards or fallback', async ({ page }) => {
    await page.goto('/courses');

    // Should have either course cards or fallback message
    const courseCards = page.locator('[data-testid="course-card"]');
    const fallbackMessage = page.locator('[data-testid="courses-fallback"]');

    const hasCards = (await courseCards.count()) > 0;
    const hasFallback = await fallbackMessage.isVisible();

    expect(hasCards || hasFallback).toBe(true);

    // If courses exist, validate card structure
    if (hasCards) {
      const firstCard = courseCards.first();
      await expect(firstCard).toBeVisible();

      // Card should have title
      const cardTitle = firstCard.locator(
        'h2, h3, [data-testid="course-title"]'
      );
      await expect(cardTitle.first()).toBeVisible();

      // Card should have description
      const cardDescription = firstCard.locator(
        '[data-testid="course-description"]'
      );
      await expect(cardDescription.first()).toBeVisible();

      // Card should have level indicator
      const levelIndicator = firstCard.locator('[data-testid="course-level"]');
      await expect(levelIndicator.first()).toBeVisible();
    }
  });

  test('should have structured data for courses', async ({ page }) => {
    await page.goto('/courses');

    // Check for JSON-LD script tags
    const jsonLdScripts = await page
      .locator('script[type="application/ld+json"]')
      .count();
    expect(jsonLdScripts).toBeGreaterThan(0);

    // Should have Course schema if courses exist
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .all();
    let hasCourseSchema = false;

    for (const script of scripts) {
      const content = await script.textContent();
      const data = JSON.parse(content!);

      if (
        data['@type'] === 'Course' ||
        (Array.isArray(data) && data.some(item => item['@type'] === 'Course'))
      ) {
        hasCourseSchema = true;
        break;
      }
    }

    // If no courses visible, fallback should be present instead
    const courseCards = page.locator('[data-testid="course-card"]');
    const hasCards = (await courseCards.count()) > 0;

    if (hasCards) {
      expect(hasCourseSchema).toBe(true);
    }
  });

  test('should handle ISR revalidation headers', async ({ request }) => {
    const response = await request.get('/courses');

    expect(response.status()).toBe(200);

    // Should have cache headers for ISR
    const cacheControl = response.headers()['cache-control'];
    expect(cacheControl).toBeTruthy();
  });

  test('fallback courses should show "Bald verfügbar"', async ({ page }) => {
    await page.goto('/courses');

    // If fallback is shown, it should contain appropriate message
    const fallbackMessage = page.locator('[data-testid="courses-fallback"]');

    if (await fallbackMessage.isVisible()) {
      const fallbackText = await fallbackMessage.textContent();
      expect(
        fallbackText!.includes('Bald verfügbar') ||
          fallbackText!.includes('Coming Soon')
      ).toBe(true);
    }
  });
});
