import { expect, Page, test } from '@playwright/test';

/**
 * E2E Test: Complete Payment Flow
 *
 * This test validates the entire user journey from course discovery
 * to successful payment completion, including Stripe integration.
 *
 * Test Scenario:
 * 1. User browses available courses
 * 2. User signs in with Clerk authentication
 * 3. User selects a course and initiates checkout
 * 4. User completes payment via Stripe
 * 5. User receives booking confirmation
 * 6. Booking appears in user dashboard
 */

test.describe('Complete Payment Flow E2E', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;

    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });

    // Navigate to home page
    await page.goto('/');
  });

  test('should complete full payment flow for authenticated user', async () => {
    // Step 1: Browse courses and verify course availability
    await test.step('Browse available courses', async () => {
      await expect(page).toHaveTitle(/Hemera/);

      // Wait for courses to load
      await page.waitForSelector('[data-testid="course-list"]', {
        timeout: 10000,
      });

      // Verify at least one course is displayed
      const courseCards = await page.locator('[data-testid="course-card"]');
      const courseCount = await courseCards.count();
      expect(courseCount).toBeGreaterThan(0);

      // Verify course details are visible
      const firstCourse = courseCards.first();
      await expect(
        firstCourse.locator('[data-testid="course-name"]')
      ).toBeVisible();
      await expect(
        firstCourse.locator('[data-testid="course-price"]')
      ).toBeVisible();
      await expect(
        firstCourse.locator('[data-testid="course-capacity"]')
      ).toBeVisible();
    });

    // Step 2: Authenticate user
    await test.step('Sign in with Clerk authentication', async () => {
      // Click sign in button (should be on homepage or global nav)
      await page.click('[data-testid="hero-login-button"]');

      // Wait for Clerk sign-in form
      await page.waitForSelector('[data-clerk-element="sign-in"]', {
        timeout: 15000,
      });

      // Use test credentials
      const testEmail = 'e2e.test@example.com';
      const testPassword = 'TestPassword123!';

      // Fill in email
      await page.fill('input[name="identifier"]', testEmail);
      await page.click('button[data-localization-key="formButtonPrimary"]');

      // Fill in password
      await page.waitForSelector('input[name="password"]', { timeout: 5000 });
      await page.fill('input[name="password"]', testPassword);
      await page.click('button[data-localization-key="formButtonPrimary"]');

      // Wait for successful authentication
      await page.waitForSelector('[data-testid="user-menu"]', {
        timeout: 15000,
      });

      // Verify user is authenticated
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    });

    // Step 3: Select course and initiate checkout
    await test.step('Select course and start checkout', async () => {
      // Navigate back to courses if needed
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-list"]');

      // Select first available course
      const courseCards = await page.locator('[data-testid="course-card"]');
      const firstCourse = courseCards.first();

      // Get course details for verification
      const courseName = await firstCourse
        .locator('[data-testid="course-name"]')
        .textContent();
      const coursePrice = await firstCourse
        .locator('[data-testid="course-price"]')
        .textContent();

      // Click on course to view details
      await firstCourse.click();

      // Wait for course detail page
      await page.waitForSelector('[data-testid="course-detail"]', {
        timeout: 10000,
      });

      // Verify course details
      await expect(
        page.locator('[data-testid="course-detail-name"]')
      ).toContainText(courseName || '');
      await expect(
        page.locator('[data-testid="course-detail-price"]')
      ).toContainText(coursePrice || '');

      // Verify booking button is available
      const bookingButton = page.locator('[data-testid="book-course-button"]');
      await expect(bookingButton).toBeVisible();
      await expect(bookingButton).toBeEnabled();

      // Click book course button
      await bookingButton.click();
    });

    // Step 4: Complete Stripe payment
    await test.step('Complete Stripe checkout', async () => {
      // Wait for redirect to Stripe Checkout
      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 });

      // Verify we're on Stripe checkout page
      await expect(page).toHaveURL(/checkout\.stripe\.com/);

      // Fill in test card details
      await page.waitForSelector('input[name="cardnumber"]', {
        timeout: 15000,
      });

      // Use Stripe test card
      await page.fill('input[name="cardnumber"]', '4242424242424242');
      await page.fill('input[name="exp-date"]', '1225'); // MM/YY
      await page.fill('input[name="cvc"]', '123');
      await page.fill('input[name="billing-name"]', 'E2E Test User');

      // Fill billing address if required
      const countrySelect = page.locator('select[name="country"]');
      if (await countrySelect.isVisible()) {
        await countrySelect.selectOption('US');
      }

      const postalCodeInput = page.locator('input[name="postal"]');
      if (await postalCodeInput.isVisible()) {
        await postalCodeInput.fill('12345');
      }

      // Submit payment
      await page.click('button[data-testid="hosted-payment-submit-button"]');

      // Wait for payment processing
      await page.waitForLoadState('networkidle', { timeout: 30000 });
    });

    // Step 5: Verify booking confirmation
    await test.step('Verify booking confirmation', async () => {
      // Wait for redirect back to our app
      await page.waitForURL(/localhost|hemera/, { timeout: 30000 });

      // Should be on success/confirmation page
      await expect(page.locator('[data-testid="booking-success"]')).toBeVisible(
        { timeout: 15000 }
      );

      // Verify success message
      await expect(
        page.locator('[data-testid="success-message"]')
      ).toContainText('successfully');

      // Verify booking details are displayed
      await expect(
        page.locator('[data-testid="booking-confirmation-details"]')
      ).toBeVisible();

      // Verify booking ID is present
      const bookingId = await page
        .locator('[data-testid="booking-id"]')
        .textContent();
      expect(bookingId).toMatch(/booking_[a-zA-Z0-9]+/);

      // Verify payment status
      await expect(
        page.locator('[data-testid="payment-status"]')
      ).toContainText('Confirmed');
    });

    // Step 6: Verify booking appears in user dashboard
    await test.step('Verify booking in user dashboard', async () => {
      // Navigate to user dashboard
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');

      // Wait for dashboard to load
      await page.waitForSelector('[data-testid="user-dashboard"]', {
        timeout: 10000,
      });

      // Verify bookings section exists
      await expect(page.locator('[data-testid="user-bookings"]')).toBeVisible();

      // Verify the new booking appears in the list
      const bookingItems = page.locator('[data-testid="booking-item"]');
      const bookingCount = await bookingItems.count();
      expect(bookingCount).toBeGreaterThan(0);

      // Verify the most recent booking (first in list) has correct status
      const firstBooking = bookingItems.first();
      await expect(
        firstBooking.locator('[data-testid="booking-status"]')
      ).toContainText('Confirmed');

      // Verify booking details
      await expect(
        firstBooking.locator('[data-testid="booking-course-name"]')
      ).toBeVisible();
      await expect(
        firstBooking.locator('[data-testid="booking-date"]')
      ).toBeVisible();
      await expect(
        firstBooking.locator('[data-testid="booking-amount"]')
      ).toBeVisible();
    });
  });

  test('should handle payment flow for free course', async () => {
    // Step 1: Authenticate user first
    await test.step('Sign in user', async () => {
      await page.click('[data-testid="hero-login-button"]');
      await page.waitForSelector('[data-clerk-element="sign-in"]', {
        timeout: 15000,
      });

      await page.fill('input[name="identifier"]', 'e2e.test@example.com');
      await page.click('button[data-localization-key="formButtonPrimary"]');

      await page.waitForSelector('input[name="password"]', { timeout: 5000 });
      await page.fill('input[name="password"]', 'TestPassword123!');
      await page.click('button[data-localization-key="formButtonPrimary"]');

      await page.waitForSelector('[data-testid="user-menu"]', {
        timeout: 15000,
      });
    });

    // Step 2: Find and select a free course
    await test.step('Select free course', async () => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-list"]');

      // Look for a free course (price = $0)
      const freeCourseCard = page
        .locator('[data-testid="course-card"]')
        .filter({
          has: page.locator('[data-testid="course-price"]', { hasText: '$0' }),
        });

      // If no free course exists, this test will be skipped
      if ((await freeCourseCard.count()) === 0) {
        test.skip(true, 'No free courses available for testing');
      }

      // Click on free course
      await freeCourseCard.first().click();
      await page.waitForSelector('[data-testid="course-detail"]');
    });

    // Step 3: Book free course (should skip payment)
    await test.step('Book free course without payment', async () => {
      const bookButton = page.locator('[data-testid="book-course-button"]');
      await expect(bookButton).toBeVisible();
      await bookButton.click();

      // For free courses, should go directly to confirmation
      // No Stripe redirect should occur
      await expect(page.locator('[data-testid="booking-success"]')).toBeVisible(
        { timeout: 10000 }
      );

      // Verify no payment information is shown for free course
      await expect(
        page.locator('[data-testid="payment-amount"]')
      ).toContainText('$0');
      await expect(
        page.locator('[data-testid="payment-status"]')
      ).toContainText('Confirmed');
    });

    // Step 4: Verify free booking in dashboard
    await test.step('Verify free booking in dashboard', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');

      await page.waitForSelector('[data-testid="user-dashboard"]');

      const bookingItems = page.locator('[data-testid="booking-item"]');
      const firstBooking = bookingItems.first();

      await expect(
        firstBooking.locator('[data-testid="booking-status"]')
      ).toContainText('Confirmed');
      await expect(
        firstBooking.locator('[data-testid="booking-amount"]')
      ).toContainText('$0');
    });
  });

  test('should prevent duplicate bookings for same course', async () => {
    // Step 1: Complete initial booking
    await test.step('Complete first booking', async () => {
      // Sign in
      await page.click('[data-testid="hero-login-button"]');
      await page.waitForSelector('[data-clerk-element="sign-in"]', {
        timeout: 15000,
      });

      await page.fill('input[name="identifier"]', 'e2e.duplicate@example.com');
      await page.click('button[data-localization-key="formButtonPrimary"]');

      await page.waitForSelector('input[name="password"]', { timeout: 5000 });
      await page.fill('input[name="password"]', 'TestPassword123!');
      await page.click('button[data-localization-key="formButtonPrimary"]');

      await page.waitForSelector('[data-testid="user-menu"]', {
        timeout: 15000,
      });

      // Book a course
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-list"]');

      const firstCourse = page.locator('[data-testid="course-card"]').first();
      await firstCourse.click();

      await page.waitForSelector('[data-testid="course-detail"]');
      await page.click('[data-testid="book-course-button"]');

      // Complete payment if not free
      const currentUrl = page.url();
      if (currentUrl.includes('stripe.com')) {
        await page.waitForSelector('input[name="cardnumber"]', {
          timeout: 15000,
        });
        await page.fill('input[name="cardnumber"]', '4242424242424242');
        await page.fill('input[name="exp-date"]', '1225');
        await page.fill('input[name="cvc"]', '123');
        await page.fill('input[name="billing-name"]', 'E2E Duplicate Test');
        await page.click('button[data-testid="hosted-payment-submit-button"]');
        await page.waitForLoadState('networkidle', { timeout: 30000 });
      }

      // Verify booking success
      await expect(page.locator('[data-testid="booking-success"]')).toBeVisible(
        { timeout: 15000 }
      );
    });

    // Step 2: Attempt duplicate booking
    await test.step('Attempt duplicate booking', async () => {
      // Navigate back to the same course
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-list"]');

      const firstCourse = page.locator('[data-testid="course-card"]').first();
      await firstCourse.click();

      await page.waitForSelector('[data-testid="course-detail"]');

      // Booking button should be disabled or show "Already Booked"
      const bookButton = page.locator('[data-testid="book-course-button"]');

      // Either button is disabled or shows different text
      const isDisabled = await bookButton.isDisabled();
      const buttonText = await bookButton.textContent();

      expect(
        isDisabled ||
          buttonText?.includes('Already') ||
          buttonText?.includes('Booked')
      ).toBeTruthy();

      // If button is clickable, it should show error
      if (!isDisabled) {
        await bookButton.click();

        // Should show error message about existing booking
        await expect(
          page.locator('[data-testid="duplicate-booking-error"]')
        ).toBeVisible({ timeout: 5000 });
        await expect(
          page.locator('[data-testid="duplicate-booking-error"]')
        ).toContainText('already booked');
      }
    });
  });

  test.afterEach(async () => {
    // Clean up any test data if needed
    // This could include API calls to remove test bookings
    // For now, we'll rely on test database isolation
  });
});
