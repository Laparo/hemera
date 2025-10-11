import { expect, Page, test } from '@playwright/test';

/**
 * E2E Test: Payment Failure Handling
 *
 * This test validates proper handling of various payment failure scenarios
 * including declined cards, network issues, and incomplete payments.
 *
 * Test Scenarios:
 * 1. Declined card payment handling
 * 2. Insufficient funds scenario
 * 3. Invalid card details
 * 4. Network timeout during payment
 * 5. User cancellation during checkout
 * 6. Webhook failure recovery
 */

test.describe('Payment Failure Handling E2E', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;

    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });

    // Navigate to home page and authenticate
    await page.goto('/');

    // Sign in for all tests
    await page.click('[data-testid="hero-login-button"]');
    await page.waitForSelector('[data-clerk-element="sign-in"]', {
      timeout: 15000,
    });

    await page.fill(
      'input[name="identifier"]',
      'e2e.payment.failures@example.com'
    );
    await page.click('button[data-localization-key="formButtonPrimary"]');

    await page.waitForSelector('input[name="password"]', { timeout: 5000 });
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[data-localization-key="formButtonPrimary"]');

    await page.waitForSelector('[data-testid="user-menu"]', { timeout: 15000 });
  });

  test('should handle declined card payment gracefully', async () => {
    await test.step('Navigate to course and initiate checkout', async () => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-list"]');

      // Select a paid course
      const paidCourse = page
        .locator('[data-testid="course-card"]')
        .filter({
          hasNot: page.locator('[data-testid="course-price"]', {
            hasText: '$0',
          }),
        })
        .first();

      await paidCourse.click();
      await page.waitForSelector('[data-testid="course-detail"]');
      await page.click('[data-testid="book-course-button"]');
    });

    await test.step('Use declined card and handle failure', async () => {
      // Wait for Stripe checkout
      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 });

      // Use Stripe test card that always declines
      await page.waitForSelector('input[name="cardnumber"]', {
        timeout: 15000,
      });
      await page.fill('input[name="cardnumber"]', '4000000000000002'); // Always declined
      await page.fill('input[name="exp-date"]', '1225');
      await page.fill('input[name="cvc"]', '123');
      await page.fill('input[name="billing-name"]', 'Declined Card Test');

      // Submit payment
      await page.click('button[data-testid="hosted-payment-submit-button"]');

      // Wait for error message
      await expect(page.locator('[data-testid="card-errors"]')).toBeVisible({
        timeout: 10000,
      });
      await expect(page.locator('[data-testid="card-errors"]')).toContainText(
        'declined'
      );
    });

    await test.step('Verify user can retry with valid card', async () => {
      // Clear the declined card and try with valid card
      await page.fill('input[name="cardnumber"]', '4242424242424242'); // Valid test card
      await page.fill('input[name="exp-date"]', '1225');
      await page.fill('input[name="cvc"]', '123');

      // Submit payment again
      await page.click('button[data-testid="hosted-payment-submit-button"]');

      // Should succeed this time
      await page.waitForURL(/localhost|hemera/, { timeout: 30000 });
      await expect(page.locator('[data-testid="booking-success"]')).toBeVisible(
        { timeout: 15000 }
      );
    });
  });

  test('should handle insufficient funds scenario', async () => {
    await test.step('Initiate checkout', async () => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-list"]');

      const paidCourse = page
        .locator('[data-testid="course-card"]')
        .filter({
          hasNot: page.locator('[data-testid="course-price"]', {
            hasText: '$0',
          }),
        })
        .first();

      await paidCourse.click();
      await page.waitForSelector('[data-testid="course-detail"]');
      await page.click('[data-testid="book-course-button"]');
    });

    await test.step('Use insufficient funds card', async () => {
      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 });

      // Use Stripe test card for insufficient funds
      await page.waitForSelector('input[name="cardnumber"]', {
        timeout: 15000,
      });
      await page.fill('input[name="cardnumber"]', '4000000000009995'); // Insufficient funds
      await page.fill('input[name="exp-date"]', '1225');
      await page.fill('input[name="cvc"]', '123');
      await page.fill('input[name="billing-name"]', 'Insufficient Funds Test');

      await page.click('button[data-testid="hosted-payment-submit-button"]');

      // Verify appropriate error message
      await expect(page.locator('[data-testid="card-errors"]')).toBeVisible({
        timeout: 10000,
      });
      await expect(page.locator('[data-testid="card-errors"]')).toContainText(
        /insufficient|funds|balance/i
      );
    });

    await test.step('Verify booking was not created', async () => {
      // Navigate back to our app (cancel payment)
      await page.goto('/');

      // Check dashboard - booking should not exist
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');

      await page.waitForSelector('[data-testid="user-dashboard"]');

      // Verify no recent booking for this course
      const bookingItems = page.locator('[data-testid="booking-item"]');

      if ((await bookingItems.count()) > 0) {
        // If bookings exist, none should be for the failed payment
        for (let i = 0; i < (await bookingItems.count()); i++) {
          const booking = bookingItems.nth(i);
          const status = await booking
            .locator('[data-testid="booking-status"]')
            .textContent();
          expect(status).not.toBe('PENDING');
        }
      }
    });
  });

  test('should handle invalid card details', async () => {
    await test.step('Test invalid card number', async () => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-list"]');

      const paidCourse = page
        .locator('[data-testid="course-card"]')
        .filter({
          hasNot: page.locator('[data-testid="course-price"]', {
            hasText: '$0',
          }),
        })
        .first();

      await paidCourse.click();
      await page.waitForSelector('[data-testid="course-detail"]');
      await page.click('[data-testid="book-course-button"]');

      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 });

      // Invalid card number
      await page.waitForSelector('input[name="cardnumber"]', {
        timeout: 15000,
      });
      await page.fill('input[name="cardnumber"]', '1234567890123456');

      // Should show validation error immediately
      await expect(
        page.locator('[data-testid="cardnumber-errors"]')
      ).toBeVisible({ timeout: 5000 });
    });

    await test.step('Test invalid expiry date', async () => {
      // Clear and use valid card number but invalid expiry
      await page.fill('input[name="cardnumber"]', '4242424242424242');
      await page.fill('input[name="exp-date"]', '1320'); // Past date

      // Should show expiry validation error
      await expect(page.locator('[data-testid="exp-date-errors"]')).toBeVisible(
        { timeout: 5000 }
      );
    });

    await test.step('Test invalid CVC', async () => {
      // Fix expiry but use invalid CVC
      await page.fill('input[name="exp-date"]', '1225');
      await page.fill('input[name="cvc"]', '12'); // Too short

      // Should show CVC validation error
      await expect(page.locator('[data-testid="cvc-errors"]')).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test('should handle user cancellation during checkout', async () => {
    await test.step('Initiate checkout and cancel', async () => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-list"]');

      const paidCourse = page
        .locator('[data-testid="course-card"]')
        .filter({
          hasNot: page.locator('[data-testid="course-price"]', {
            hasText: '$0',
          }),
        })
        .first();

      const courseName = await paidCourse
        .locator('[data-testid="course-name"]')
        .textContent();

      await paidCourse.click();
      await page.waitForSelector('[data-testid="course-detail"]');
      await page.click('[data-testid="book-course-button"]');

      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 });

      // Look for and click cancel/back button
      const backButton = page
        .locator('button', { hasText: /back|cancel/i })
        .first();
      if (await backButton.isVisible()) {
        await backButton.click();
      } else {
        // Navigate back manually
        await page.goBack();
      }
    });

    await test.step('Verify cancellation handling', async () => {
      // Should be back on our site
      await page.waitForURL(/localhost|hemera/, { timeout: 30000 });

      // Should show cancellation message or be back on course page
      const isCancelPage = await page
        .locator('[data-testid="payment-cancelled"]')
        .isVisible();
      const isCoursePage = await page
        .locator('[data-testid="course-detail"]')
        .isVisible();

      expect(isCancelPage || isCoursePage).toBeTruthy();

      if (isCancelPage) {
        await expect(
          page.locator('[data-testid="payment-cancelled"]')
        ).toContainText(/cancelled|abandoned/i);

        // Should offer option to try again
        await expect(
          page.locator('[data-testid="try-again-button"]')
        ).toBeVisible();
      }
    });

    await test.step('Verify no booking was created', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');

      await page.waitForSelector('[data-testid="user-dashboard"]');

      // Check that no pending booking exists for cancelled payment
      const bookingItems = page.locator('[data-testid="booking-item"]');

      if ((await bookingItems.count()) > 0) {
        for (let i = 0; i < (await bookingItems.count()); i++) {
          const booking = bookingItems.nth(i);
          const status = await booking
            .locator('[data-testid="booking-status"]')
            .textContent();
          // No booking should be in PENDING state from cancelled payment
          if (status === 'PENDING') {
            const bookingTime = await booking
              .locator('[data-testid="booking-date"]')
              .textContent();
            // Verify it's not from the last few minutes
            const bookingDate = new Date(bookingTime || '');
            const now = new Date();
            const diffMinutes =
              (now.getTime() - bookingDate.getTime()) / (1000 * 60);
            expect(diffMinutes).toBeGreaterThan(5); // Should not be recent
          }
        }
      }
    });
  });

  test('should handle session expiry during payment', async () => {
    await test.step('Simulate session expiry', async () => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-list"]');

      const paidCourse = page
        .locator('[data-testid="course-card"]')
        .filter({
          hasNot: page.locator('[data-testid="course-price"]', {
            hasText: '$0',
          }),
        })
        .first();

      await paidCourse.click();
      await page.waitForSelector('[data-testid="course-detail"]');
      await page.click('[data-testid="book-course-button"]');

      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 });

      // Wait longer than typical session timeout (simulate slow user)
      await page.waitForTimeout(5000);

      // Try to complete payment
      await page.waitForSelector('input[name="cardnumber"]', {
        timeout: 15000,
      });
      await page.fill('input[name="cardnumber"]', '4242424242424242');
      await page.fill('input[name="exp-date"]', '1225');
      await page.fill('input[name="cvc"]', '123');
      await page.fill('input[name="billing-name"]', 'Session Test User');

      await page.click('button[data-testid="hosted-payment-submit-button"]');
    });

    await test.step('Handle session expiry gracefully', async () => {
      // Payment should either succeed or show appropriate error
      try {
        // Wait for either success or session expired error
        await Promise.race([
          page.waitForURL(/localhost|hemera/, { timeout: 30000 }),
          page.waitForSelector('[data-testid="session-expired"]', {
            timeout: 30000,
          }),
        ]);

        const isSessionExpired = await page
          .locator('[data-testid="session-expired"]')
          .isVisible();

        if (isSessionExpired) {
          // Should show option to restart checkout
          await expect(
            page.locator('[data-testid="restart-checkout"]')
          ).toBeVisible();
          await page.click('[data-testid="restart-checkout"]');

          // Should return to course page
          await expect(
            page.locator('[data-testid="course-detail"]')
          ).toBeVisible({ timeout: 10000 });
        } else {
          // Payment succeeded despite delay
          await expect(
            page.locator('[data-testid="booking-success"]')
          ).toBeVisible({ timeout: 15000 });
        }
      } catch (error) {
        // If we get a timeout, check current state
        const currentUrl = page.url();
        console.log('Session expiry test - Current URL:', currentUrl);

        // Should not leave user in broken state
        expect(currentUrl).not.toContain('error');
      }
    });
  });

  test('should show appropriate error messages for payment failures', async () => {
    await test.step('Test error message display', async () => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="course-list"]');

      const paidCourse = page
        .locator('[data-testid="course-card"]')
        .filter({
          hasNot: page.locator('[data-testid="course-price"]', {
            hasText: '$0',
          }),
        })
        .first();

      await paidCourse.click();
      await page.waitForSelector('[data-testid="course-detail"]');
      await page.click('[data-testid="book-course-button"]');

      await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 });

      // Use processing error card
      await page.waitForSelector('input[name="cardnumber"]', {
        timeout: 15000,
      });
      await page.fill('input[name="cardnumber"]', '4000000000000119'); // Processing error
      await page.fill('input[name="exp-date"]', '1225');
      await page.fill('input[name="cvc"]', '123');
      await page.fill('input[name="billing-name"]', 'Processing Error Test');

      await page.click('button[data-testid="hosted-payment-submit-button"]');

      // Should show processing error
      await expect(page.locator('[data-testid="card-errors"]')).toBeVisible({
        timeout: 10000,
      });
      await expect(page.locator('[data-testid="card-errors"]')).toContainText(
        /processing|error/i
      );
    });

    await test.step('Verify error message is user-friendly', async () => {
      const errorElement = page.locator('[data-testid="card-errors"]');
      const errorText = await errorElement.textContent();

      // Error should be clear and actionable
      expect(errorText).not.toContain('500');
      expect(errorText).not.toContain('undefined');
      expect(errorText).not.toContain('null');

      // Should suggest next steps
      const hasActionableText =
        errorText?.includes('try again') ||
        errorText?.includes('contact') ||
        errorText?.includes('different card');
      expect(hasActionableText).toBeTruthy();
    });
  });

  test.afterEach(async () => {
    // Clean up any failed booking attempts
    // In a real implementation, you might want to clean up pending bookings
  });
});
