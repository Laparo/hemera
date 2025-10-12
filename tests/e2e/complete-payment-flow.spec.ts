import { expect, Page, test } from '@playwright/test';
import { AuthHelper, TEST_USERS } from './auth-helper';

/**
 * E2E Test: Stripe React Elements Payment Flow
 *
 * This test validates the complete payment journey using React Stripe Elements
 * instead of the old Hosted Checkout iframe approach.
 *
 * Test Scenario:
 * 1. User browses available paid courses (excludes free courses)
 * 2. User signs in with Clerk authentication
 * 3. User selects a paid course and initiates checkout
 * 4. User completes payment via React Stripe Elements
 * 5. User receives booking confirmation
 * 6. Booking appears in user dashboard
 */

test.describe('Stripe React Elements Payment Flow E2E', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;

    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });

    // Navigate to home page with extended timeout
    await page.goto('/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Wait for page to be interactive
    await page.waitForLoadState('domcontentloaded');
  });

  test('should complete payment flow with React Stripe Elements', async () => {
    let selectedCourseId: string | null = null;
    let selectedCourseName: string | null = null;

    // Step 1: Browse paid courses only
    await test.step('Browse available paid courses', async () => {
      // Wait for course cards to be visible
      await page.waitForSelector('[data-testid="course-card"]', {
        timeout: 15000,
      });

      console.log('🏠 Homepage loaded successfully');

      // Verify at least one course is displayed
      const courseCards = await page.locator('[data-testid="course-card"]');
      const courseCount = await courseCards.count();
      expect(courseCount).toBeGreaterThan(0);

      // Find a paid course (not free)
      let selectedCourse = null;
      console.log(`🔍 Checking ${courseCount} courses for paid options...`);

      for (let i = 0; i < courseCount; i++) {
        const course = courseCards.nth(i);
        const priceElement = course.locator('[data-testid="course-price"]');
        const priceText = await priceElement.textContent();
        const courseNameElement = course.locator('[data-testid="course-name"]');
        const courseName = await courseNameElement.textContent();

        console.log(
          `📋 Course ${i + 1}: "${courseName}" - Price: "${priceText}"`
        );

        // Only select courses with actual price (not free)
        if (
          priceText &&
          priceText.trim().length > 0 &&
          !priceText.toLowerCase().includes('free') &&
          !priceText.toLowerCase().includes('kostenlos') &&
          !priceText.includes('€0') &&
          !priceText.includes('$0') &&
          !(priceText.includes('€0,00') || priceText.includes('0,00 €')) &&
          !(priceText.includes('€0.00') || priceText.includes('0.00 €')) &&
          !(priceText.includes('$0,00') || priceText.includes('0,00 $')) &&
          !(priceText.includes('$0.00') || priceText.includes('0.00 $'))
        ) {
          console.log(
            `✅ Course "${courseName}" matches paid criteria: "${priceText}"`
          );
          selectedCourse = course;

          // Get course name and extract course slug from the Book Course button
          selectedCourseName = await course
            .locator('[data-testid="course-name"]')
            .textContent();
          const bookButton = course.locator('a:has-text("Book Course")');
          const href = await bookButton.getAttribute('href');
          if (href) {
            // Extract course slug from URL like /courses/work-life-balance-basics
            const pathParts = href.split('/');
            const courseSlug = pathParts[pathParts.length - 1];
            selectedCourseId = courseSlug; // Use slug as identifier for now
          }

          console.log(
            `💰 Selected paid course: "${selectedCourseName}" with price: ${priceText}, ID: ${selectedCourseId}`
          );
          break;
        } else {
          console.log(
            `❌ Course "${courseName}" does not match paid criteria: "${priceText}"`
          );
        }
      }

      expect(selectedCourse).toBeTruthy();
      expect(selectedCourseId).toBeTruthy();
      console.log('✅ Paid course found for testing');
    });

    // Step 2: Authenticate user
    await test.step('Sign in with Clerk authentication', async () => {
      // Click sign in button
      await page.click('[data-testid="hero-login-button"]');

      // Use auth helper for sign in
      const authHelper = new AuthHelper(page);
      await authHelper.signIn(
        TEST_USERS.DEFAULT.email,
        TEST_USERS.DEFAULT.password
      );

      console.log('✅ User authentication completed');
    });

    // Step 3: Navigate directly to checkout with selected course
    await test.step('Navigate to checkout with selected course', async () => {
      // Navigate directly to checkout with the selected course ID
      await page.goto(`/checkout?courseId=${selectedCourseId}`);
      console.log(
        `🛒 Navigating to checkout page for course: ${selectedCourseName}`
      );

      // Wait for checkout page to load
      await page.waitForURL(/.*\/checkout\?courseId=.*/, { timeout: 10000 });
      console.log(`🛒 Navigated to checkout page: ${page.url()}`);

      // Wait for checkout page content to load (not just loading spinner)
      await page.waitForSelector('[data-testid="checkout-page"]', {
        timeout: 30000,
      });
      console.log('✅ Checkout page loaded');

      // Additional verification - check URL
      const currentUrl = page.url();
      console.log(`📍 Current URL: ${currentUrl}`);

      // Check if we were redirected away from checkout
      if (!currentUrl.includes('/checkout')) {
        throw new Error(`Redirected away from checkout page to: ${currentUrl}`);
      }
    });

    // Step 4: Complete payment with React Stripe Elements
    await test.step('Complete payment with React Stripe Elements', async () => {
      // First, check if there's an error message on the page
      const errorElement = page.locator('[data-testid="checkout-error"]');
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        console.log(`❌ Checkout error: ${errorText}`);
      }

      // Check if page is still loading
      const loadingIndicator = page.locator('.MuiCircularProgress-root');
      if (await loadingIndicator.isVisible()) {
        console.log('⏳ Page is still loading, waiting longer...');
        // Wait for loading to finish or timeout
        await page
          .waitForSelector('.MuiCircularProgress-root', {
            state: 'hidden',
            timeout: 60000,
          })
          .catch(() => {
            console.log('⚠️ Loading did not finish within timeout');
          });
      }

      // Try to wait for the Stripe form
      try {
        await page.waitForSelector('[data-testid="stripe-payment-form"]', {
          timeout: 30000,
        });
        console.log('💳 React Stripe Elements form loaded');
      } catch (error) {
        // If Stripe form doesn't appear, log what's actually on the page
        const pageContent = await page.content();
        console.log('📄 Page content length:', pageContent.length);

        // Check for specific elements
        const hasError = await page
          .locator('[data-testid="checkout-error"]')
          .isVisible();
        const hasLoading = await page
          .locator('.MuiCircularProgress-root')
          .isVisible();
        const hasCheckoutPage = await page
          .locator('[data-testid="checkout-page"]')
          .isVisible();

        console.log(
          '🔍 Page state - Error:',
          hasError,
          'Loading:',
          hasLoading,
          'CheckoutPage:',
          hasCheckoutPage
        );

        throw error;
      }

      // Wait for PaymentElement iframe to be ready
      await page.waitForSelector('iframe[name*="__privateStripeFrame"]', {
        timeout: 30000,
      });
      console.log('🎯 Stripe PaymentElement iframe detected');

      // Interact with PaymentElement inside iframe
      const paymentElementFrame = page
        .frameLocator('iframe[name*="__privateStripeFrame"]')
        .first();

      // Fill card number
      await paymentElementFrame
        .locator('input[name="number"]')
        .waitFor({ timeout: 15000 });
      await paymentElementFrame
        .locator('input[name="number"]')
        .fill('4242424242424242');
      console.log('💳 Card number filled');

      // Fill expiry date (MM/YY format)
      await paymentElementFrame.locator('input[name="expiry"]').fill('1234');
      console.log('📅 Expiry date filled');

      // Fill CVC
      await paymentElementFrame.locator('input[name="cvc"]').fill('123');
      console.log('🔒 CVC filled');

      // Fill billing details if present
      try {
        // Check if there's an AddressElement iframe
        const addressFrames = page.locator(
          'iframe[name*="__privateStripeFrame"]'
        );
        const frameCount = await addressFrames.count();

        if (frameCount > 1) {
          const addressElementFrame = page
            .frameLocator('iframe[name*="__privateStripeFrame"]')
            .nth(1);
          await addressElementFrame
            .locator('input[name="name"]')
            .fill('E2E Test User', { timeout: 5000 });
          console.log('👤 Billing name filled');
        }
      } catch (error) {
        console.log('ℹ️ AddressElement not present or different structure');
      }

      // Submit the payment form
      const submitButton = page.locator('[data-testid="stripe-submit-button"]');
      await expect(submitButton).toBeVisible();
      await expect(submitButton).toBeEnabled();

      console.log('🔄 Submitting payment...');
      await submitButton.click();

      // Wait for payment processing
      await page.waitForLoadState('domcontentloaded', { timeout: 60000 });
      console.log('⏳ Payment processing completed');
    });

    // Step 5: Verify booking confirmation
    await test.step('Verify booking confirmation', async () => {
      // Wait for redirect to booking success page
      await page.waitForURL(/.*\/booking-success\?bookingId=.*/, {
        timeout: 30000,
      });
      console.log(`🎉 Redirected to booking success page: ${page.url()}`);

      // Verify success page elements
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

      // Verify payment status shows confirmed
      await expect(
        page.locator('[data-testid="payment-status"]')
      ).toContainText('Confirmed');

      console.log('✅ Booking confirmation verified');
    });

    // Step 6: Verify booking appears in user dashboard
    await test.step('Verify booking in user dashboard', async () => {
      // Navigate to user dashboard
      await page.goto('/dashboard');

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

      // Verify the most recent booking has correct status
      const firstBooking = bookingItems.first();
      await expect(
        firstBooking.locator('[data-testid="booking-status"]')
      ).toContainText('Confirmed');

      console.log('✅ Booking verified in user dashboard');
    });
  });

  test('should prevent duplicate bookings for same course', async () => {
    // Step 1: Complete initial booking
    await test.step('Complete first booking', async () => {
      // Sign in
      await page.click('[data-testid="hero-login-button"]');

      const authHelper = new AuthHelper(page);
      await authHelper.signIn(
        TEST_USERS.DUPLICATE.email,
        TEST_USERS.DUPLICATE.password
      );

      // Book a paid course
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-overview"]');

      // Find a paid course
      const courseCards = await page.locator('[data-testid="course-card"]');
      const courseCount = await courseCards.count();

      let selectedCourse = null;
      for (let i = 0; i < courseCount; i++) {
        const course = courseCards.nth(i);
        const priceElement = course.locator('[data-testid="course-price"]');
        const priceText = await priceElement.textContent();

        if (
          priceText &&
          priceText.trim().length > 0 &&
          !priceText.toLowerCase().includes('free') &&
          !priceText.toLowerCase().includes('kostenlos') &&
          !priceText.includes('€0') &&
          !priceText.includes('$0') &&
          !(priceText.includes('€0,00') || priceText.includes('0,00 €')) &&
          !(priceText.includes('€0.00') || priceText.includes('0.00 €')) &&
          !(priceText.includes('$0,00') || priceText.includes('0,00 $')) &&
          !(priceText.includes('$0.00') || priceText.includes('0.00 $'))
        ) {
          selectedCourse = course;
          break;
        }
      }

      expect(selectedCourse).toBeTruthy();

      // Click on "Book Course" button
      const bookButton = selectedCourse!.locator(
        'a:has-text("Book Course"), button:has-text("Book Course")'
      );
      await expect(bookButton).toBeVisible();
      await bookButton.click();

      // Wait for checkout page
      await page.waitForURL(/.*\/checkout\?courseId=.*/, { timeout: 10000 });

      // Complete payment with React Stripe Elements
      await page.waitForSelector('[data-testid="stripe-payment-form"]', {
        timeout: 30000,
      });

      const paymentElementFrame = page
        .frameLocator('iframe[name*="__privateStripeFrame"]')
        .first();
      await paymentElementFrame
        .locator('input[name="number"]')
        .fill('4242424242424242');
      await paymentElementFrame.locator('input[name="expiry"]').fill('1234');
      await paymentElementFrame.locator('input[name="cvc"]').fill('123');

      const submitButton = page.locator('[data-testid="stripe-submit-button"]');
      await submitButton.click();

      // Verify booking success
      await expect(page.locator('[data-testid="booking-success"]')).toBeVisible(
        { timeout: 30000 }
      );
    });

    // Step 2: Attempt duplicate booking
    await test.step('Attempt duplicate booking', async () => {
      // Navigate back to the same course
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-overview"]');

      // Select the same course type again
      const courseCards = await page.locator('[data-testid="course-card"]');
      const courseCount = await courseCards.count();

      let selectedCourse = null;
      for (let i = 0; i < courseCount; i++) {
        const course = courseCards.nth(i);
        const priceElement = course.locator('[data-testid="course-price"]');
        const priceText = await priceElement.textContent();

        if (
          priceText &&
          !priceText.toLowerCase().includes('free') &&
          !priceText.toLowerCase().includes('kostenlos') &&
          !priceText.includes('€0') &&
          !priceText.includes('$0') &&
          !priceText.includes('0,00') &&
          !priceText.includes('0.00')
        ) {
          selectedCourse = course;
          break;
        }
      }

      // Click on "Book Course" button
      const courseBookButton = selectedCourse!.locator(
        'a:has-text("Book Course"), button:has-text("Book Course")'
      );
      await expect(courseBookButton).toBeVisible();
      await courseBookButton.click();

      // Wait for checkout page
      await page.waitForURL(/.*\/checkout\?courseId=.*/, { timeout: 10000 });

      // Should show error for duplicate booking
      await expect(page.locator('[data-testid="checkout-error"]')).toBeVisible({
        timeout: 10000,
      });

      await expect(
        page.locator('[data-testid="checkout-error"]')
      ).toContainText(/already booked|duplicate/i);

      console.log('✅ Duplicate booking prevention verified');
    });
  });

  test.afterEach(async () => {
    // Clean up any test data if needed
    // This could include API calls to remove test bookings
    // For now, we'll rely on test database isolation
  });
});
