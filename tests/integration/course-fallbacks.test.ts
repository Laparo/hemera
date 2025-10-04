import { test, expect } from '@playwright/test';

test.describe('Course Data Fallbacks', () => {
  test('should handle empty course data gracefully', async ({ page }) => {
    // Mock empty API response
    await page.route('**/api/courses*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          courses: [],
          meta: {
            total: 0,
            page: 1,
            pageSize: 10
          }
        })
      });
    });

    await page.goto('/courses');
    
    // Should show fallback message
    const fallbackMessage = page.locator('[data-testid="courses-fallback"]');
    await expect(fallbackMessage).toBeVisible();
    
    const fallbackText = await fallbackMessage.textContent();
    expect(fallbackText!.includes('Bald verfügbar') || fallbackText!.includes('Coming Soon')).toBe(true);
  });

  test('should handle API errors with graceful fallback', async ({ page }) => {
    // Mock API error
    await page.route('**/api/courses*', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/courses');
    
    // Should show error fallback or placeholder content
    const fallbackMessage = page.locator('[data-testid="courses-fallback"], [data-testid="error-fallback"]');
    await expect(fallbackMessage.first()).toBeVisible();
  });

  test('should display placeholder courses when no published courses exist', async ({ page }) => {
    // Mock response with only draft courses
    await page.route('**/api/courses*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          courses: [
            {
              id: 'placeholder-1',
              title: 'Bald verfügbar: React Advanced',
              description: 'Dieser Kurs wird in Kürze verfügbar sein. Bleiben Sie dran für Updates!',
              slug: 'react-advanced-coming-soon',
              level: 'INTERMEDIATE',
              duration: 'TBD',
              price: null,
              isPlaceholder: true
            },
            {
              id: 'placeholder-2', 
              title: 'Bald verfügbar: TypeScript Mastery',
              description: 'Ein umfassender TypeScript-Kurs für fortgeschrittene Entwickler.',
              slug: 'typescript-mastery-coming-soon',
              level: 'ADVANCED',
              duration: 'TBD',
              price: null,
              isPlaceholder: true
            }
          ],
          meta: {
            total: 2,
            page: 1,
            pageSize: 10
          }
        })
      });
    });

    await page.goto('/courses');
    
    // Should display placeholder courses
    const courseCards = page.locator('[data-testid="course-card"]');
    expect(await courseCards.count()).toBeGreaterThan(0);
    
    // Placeholder courses should have "Bald verfügbar" in title
    const firstCard = courseCards.first();
    const cardTitle = await firstCard.locator('[data-testid="course-title"]').textContent();
    expect(cardTitle!.includes('Bald verfügbar')).toBe(true);
    
    // Should not have purchase buttons for placeholders
    const purchaseButtons = firstCard.locator('[data-testid="purchase-button"]');
    expect(await purchaseButtons.count()).toBe(0);
  });

  test('landing page should handle missing course data', async ({ page }) => {
    // Mock empty course data for landing page overview
    await page.route('**/api/courses*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          courses: [],
          meta: { total: 0, page: 1, pageSize: 3 }
        })
      });
    });

    await page.goto('/');
    
    // Course overview section should still be visible
    const courseOverview = page.locator('[data-testid="course-overview"]');
    await expect(courseOverview).toBeVisible();
    
    // Should show fallback message or placeholder content
    const fallbackContent = courseOverview.locator('[data-testid="courses-fallback"], [data-testid="course-card"]');
    await expect(fallbackContent.first()).toBeVisible();
  });

  test('should handle slow API responses', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/courses*', async route => {
      // Delay response by 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          courses: [
            {
              id: 'course-1',
              title: 'JavaScript Basics',
              description: 'Learn JavaScript fundamentals',
              slug: 'javascript-basics',
              level: 'BEGINNER',
              duration: '4 weeks',
              price: 99.00
            }
          ],
          meta: { total: 1, page: 1, pageSize: 10 }
        })
      });
    });

    await page.goto('/courses');
    
    // Should show loading state initially
    // Then show content when loaded
    await expect(page.locator('[data-testid="course-card"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('should maintain SEO even with fallback content', async ({ page }) => {
    // Mock empty course data
    await page.route('**/api/courses*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          courses: [],
          meta: { total: 0, page: 1, pageSize: 10 }
        })
      });
    });

    await page.goto('/courses');
    
    // Should still have proper SEO meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    
    // Should still have structured data even with fallback
    const jsonLdCount = await page.locator('script[type="application/ld+json"]').count();
    expect(jsonLdCount).toBeGreaterThan(0);
  });
});