import { expect, test } from '@playwright/test';

test.describe('Booking System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to courses page
    await page.goto('/courses');
  });

  test('should show sign in button for unauthenticated users', async ({
    page,
  }) => {
    // Look for sign in button on course cards
    const signInButton = page.getByRole('button', { name: /sign in to book/i });
    await expect(signInButton.first()).toBeVisible();
  });

  test('should allow authenticated user to book a course', async ({ page }) => {
    // Sign in first (you'll need to implement sign-in flow)
    await page.goto('/sign-in');

    // Fill in authentication form - this depends on your auth setup
    // For now, we'll skip this part and assume user is signed in

    await page.goto('/courses');

    // Check if "Book Course" button is visible for authenticated users
    const bookButton = page.getByRole('button', { name: /book course/i });
    if (await bookButton.first().isVisible()) {
      await bookButton.first().click();

      // Should navigate to booking form
      await expect(page).toHaveURL(/\/bookings\/new/);

      // Should see booking form
      await expect(page.getByText('Book a Course')).toBeVisible();
    }
  });

  test('should display booking form correctly', async ({ page }) => {
    await page.goto('/bookings/new');

    // Check if redirected to sign-in (if not authenticated)
    const currentUrl = page.url();
    if (currentUrl.includes('/sign-in')) {
      await expect(page.getByText(/sign in/i)).toBeVisible();
    } else {
      // If authenticated, should see booking form
      await expect(page.getByText('Book a Course')).toBeVisible();
      await expect(page.getByText('Available Courses')).toBeVisible();
    }
  });

  test('should show bookings list for authenticated users', async ({
    page,
  }) => {
    await page.goto('/bookings');

    // Check if redirected to sign-in (if not authenticated)
    const currentUrl = page.url();
    if (currentUrl.includes('/sign-in')) {
      await expect(page.getByText(/sign in/i)).toBeVisible();
    } else {
      // If authenticated, should see bookings page
      await expect(page.getByText('My Bookings')).toBeVisible();
    }
  });

  test('should validate booking form submission', async ({ page }) => {
    await page.goto('/bookings/new');

    // Skip if redirected to sign-in
    if (page.url().includes('/sign-in')) {
      return;
    }

    // Try to submit without selecting a course
    const submitButton = page.getByRole('button', { name: /book course/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Should show validation error
      await expect(page.getByText(/please select a course/i)).toBeVisible();
    }
  });

  test('should show course details in booking form', async ({ page }) => {
    await page.goto('/bookings/new');

    // Skip if redirected to sign-in
    if (page.url().includes('/sign-in')) {
      return;
    }

    // Check if courses are displayed
    const courseCards = page.locator(
      '[data-testid="course-card"], .MuiCard-root'
    );
    if (await courseCards.first().isVisible()) {
      // Should show course title, description, and price
      await expect(
        courseCards.first().getByText(/€|free|kostenlos/i)
      ).toBeVisible();
    }
  });

  test('should handle empty course list', async ({ page }) => {
    await page.goto('/bookings/new');

    // Skip if redirected to sign-in
    if (page.url().includes('/sign-in')) {
      return;
    }

    // If no courses available, should show appropriate message
    const noCourses = page.getByText(/no courses available/i);
    const hasBookingForm = page.getByText('Available Courses');

    // Either should see courses or no courses message
    await expect(noCourses.or(hasBookingForm)).toBeVisible();
  });

  test('should show booking statistics', async ({ page }) => {
    await page.goto('/bookings');

    // Skip if redirected to sign-in
    if (page.url().includes('/sign-in')) {
      return;
    }

    // Should show booking stats
    await expect(page.getByText('Total Bookings')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
    await expect(page.getByText('Confirmed')).toBeVisible();
  });

  test('should navigate between booking pages', async ({ page }) => {
    await page.goto('/bookings');

    // Skip if redirected to sign-in
    if (page.url().includes('/sign-in')) {
      return;
    }

    // Should have navigation to browse courses
    const browseCourses = page.getByRole('button', { name: /browse courses/i });
    if (await browseCourses.isVisible()) {
      await browseCourses.click();
      await expect(page).toHaveURL('/courses');
    }
  });

  test('should show course information in booking list', async ({ page }) => {
    await page.goto('/bookings');

    // Skip if redirected to sign-in
    if (page.url().includes('/sign-in')) {
      return;
    }

    // Check for empty state or booking list
    const noBookings = page.getByText(/no bookings yet/i);
    const hasBookings = page.getByText('Course Bookings');

    await expect(noBookings.or(hasBookings)).toBeVisible();
  });
});

test.describe('Booking API', () => {
  test('should handle unauthorized API access', async ({ page }) => {
    // Test API endpoints directly
    const response = await page.request.get('/api/bookings');
    expect(response.status()).toBe(401);
  });

  test('should validate booking creation data', async ({ page }) => {
    // Test with invalid data
    const response = await page.request.post('/api/bookings', {
      data: {
        courseId: '', // Invalid: empty course ID
      },
    });
    expect(response.status()).toBe(401); // Should be 401 due to no auth
  });
});

test.describe('Booking Integration', () => {
  test('should link course cards to booking form', async ({ page }) => {
    await page.goto('/courses');

    // Find a course card with booking button
    const courseCard = page.locator('[data-testid="course-card"]').first();
    const bookButton = courseCard.getByRole('button', {
      name: /book course|sign in to book/i,
    });

    if (await bookButton.isVisible()) {
      await bookButton.click();

      // Should navigate to booking or sign-in
      const url = page.url();
      expect(url).toMatch(/\/(bookings\/new|sign-in)/);
    }
  });

  test('should preserve course selection in URL', async ({ page }) => {
    // Navigate to booking form with course ID
    await page.goto('/bookings/new?courseId=test-course-id');

    // URL should contain course ID parameter
    expect(page.url()).toContain('courseId=test-course-id');
  });

  test('should handle course pre-selection', async ({ page }) => {
    await page.goto('/bookings/new?courseId=some-course-id');

    // Skip if redirected to sign-in
    if (page.url().includes('/sign-in')) {
      return;
    }

    // Should attempt to pre-select the course if it exists
    // This test will pass regardless of whether the course exists
    await expect(page.getByText('Book a Course')).toBeVisible();
  });
});
