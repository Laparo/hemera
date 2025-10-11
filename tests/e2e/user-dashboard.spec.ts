import { expect, Page, test } from '@playwright/test';

/**
 * E2E Test: User Dashboard
 *
 * This test validates the complete user dashboard functionality
 * including booking history, payment status, course access, and account management.
 *
 * Test Scenarios:
 * 1. Dashboard navigation and layout
 * 2. Booking history display and filtering
 * 3. Payment status tracking
 * 4. Course access management
 * 5. Profile and account settings
 * 6. Booking actions (cancellation, refunds)
 */

test.describe('User Dashboard E2E', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;

    // Set viewport for consistent testing
    await page.setViewportSize({ width: 1280, height: 720 });

    // Navigate to home page and authenticate
    await page.goto('/');

    // Sign in with user that has existing bookings
    await page.click('[data-testid="hero-login-button"]');
    await page.waitForSelector('[data-clerk-element="sign-in"]', {
      timeout: 15000,
    });

    await page.fill('input[name="identifier"]', 'e2e.dashboard@example.com');
    await page.click('button[data-localization-key="formButtonPrimary"]');

    await page.waitForSelector('input[name="password"]', { timeout: 5000 });
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.click('button[data-localization-key="formButtonPrimary"]');

    await page.waitForSelector('[data-testid="user-menu"]', { timeout: 15000 });
  });

  test('should display dashboard layout and navigation correctly', async () => {
    await test.step('Navigate to dashboard', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');

      await page.waitForSelector('[data-testid="user-dashboard"]', {
        timeout: 10000,
      });

      // Verify dashboard is loaded
      await expect(
        page.locator('[data-testid="user-dashboard"]')
      ).toBeVisible();
      await expect(page).toHaveTitle(/Dashboard/);
    });

    await test.step('Verify dashboard sections', async () => {
      // Main navigation should be present
      await expect(page.locator('[data-testid="dashboard-nav"]')).toBeVisible();

      // Key dashboard sections should be visible
      await expect(
        page.locator('[data-testid="dashboard-overview"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="user-bookings"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="account-summary"]')
      ).toBeVisible();

      // Navigation items should be present
      const navItems = [
        '[data-testid="nav-overview"]',
        '[data-testid="nav-bookings"]',
        '[data-testid="nav-profile"]',
        '[data-testid="nav-settings"]',
      ];

      for (const navItem of navItems) {
        await expect(page.locator(navItem)).toBeVisible();
      }
    });

    await test.step('Verify user information display', async () => {
      // User profile section should show correct information
      await expect(
        page.locator('[data-testid="user-profile-section"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="user-email"]')).toContainText(
        'e2e.dashboard@example.com'
      );

      // Account status should be displayed
      await expect(
        page.locator('[data-testid="account-status"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="member-since"]')).toBeVisible();
    });
  });

  test('should display and manage booking history correctly', async () => {
    await test.step('Navigate to bookings section', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');
      await page.waitForSelector('[data-testid="user-dashboard"]');

      // Click on bookings navigation
      await page.click('[data-testid="nav-bookings"]');
      await expect(
        page.locator('[data-testid="bookings-section"]')
      ).toBeVisible();
    });

    await test.step('Verify booking list display', async () => {
      // Bookings list should be present
      await expect(page.locator('[data-testid="bookings-list"]')).toBeVisible();

      // If bookings exist, verify their structure
      const bookingItems = page.locator('[data-testid="booking-item"]');
      const bookingCount = await bookingItems.count();

      if (bookingCount > 0) {
        // Verify first booking item structure
        const firstBooking = bookingItems.first();

        await expect(
          firstBooking.locator('[data-testid="booking-course-name"]')
        ).toBeVisible();
        await expect(
          firstBooking.locator('[data-testid="booking-status"]')
        ).toBeVisible();
        await expect(
          firstBooking.locator('[data-testid="booking-date"]')
        ).toBeVisible();
        await expect(
          firstBooking.locator('[data-testid="booking-amount"]')
        ).toBeVisible();

        // Verify booking status is valid
        const status = await firstBooking
          .locator('[data-testid="booking-status"]')
          .textContent();
        const validStatuses = [
          'PENDING',
          'CONFIRMED',
          'CANCELLED',
          'REFUNDED',
          'COMPLETED',
        ];
        expect(validStatuses).toContain(status);

        // Verify date format
        const bookingDate = await firstBooking
          .locator('[data-testid="booking-date"]')
          .textContent();
        expect(bookingDate).toMatch(
          /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/
        );

        // Verify amount format
        const amount = await firstBooking
          .locator('[data-testid="booking-amount"]')
          .textContent();
        expect(amount).toMatch(/\$\d+(\.\d{2})?/);
      } else {
        // Should show empty state
        await expect(page.locator('[data-testid="no-bookings"]')).toBeVisible();
        await expect(
          page.locator('[data-testid="browse-courses-link"]')
        ).toBeVisible();
      }
    });

    await test.step('Test booking filtering', async () => {
      // Test status filter if bookings exist
      const bookingItems = page.locator('[data-testid="booking-item"]');
      const bookingCount = await bookingItems.count();

      if (bookingCount > 0) {
        // Status filter should be available
        const statusFilter = page.locator('[data-testid="status-filter"]');
        if (await statusFilter.isVisible()) {
          // Test filtering by CONFIRMED status
          await statusFilter.selectOption('CONFIRMED');
          await page.waitForTimeout(1000); // Wait for filter to apply

          // All visible bookings should have CONFIRMED status
          const filteredBookings = page.locator('[data-testid="booking-item"]');
          const filteredCount = await filteredBookings.count();

          for (let i = 0; i < filteredCount; i++) {
            const booking = filteredBookings.nth(i);
            const status = await booking
              .locator('[data-testid="booking-status"]')
              .textContent();
            expect(status).toBe('CONFIRMED');
          }
        }

        // Date filter should be available
        const dateFilter = page.locator('[data-testid="date-filter"]');
        if (await dateFilter.isVisible()) {
          await dateFilter.selectOption('last-30-days');
          await page.waitForTimeout(1000);

          // Verify results are filtered by date
          // (specific verification would depend on test data)
        }
      }
    });

    await test.step('Test booking sorting', async () => {
      const bookingItems = page.locator('[data-testid="booking-item"]');
      const bookingCount = await bookingItems.count();

      if (bookingCount > 1) {
        // Sort by date (newest first)
        const sortSelect = page.locator('[data-testid="sort-bookings"]');
        if (await sortSelect.isVisible()) {
          await sortSelect.selectOption('date-desc');
          await page.waitForTimeout(1000);

          // Verify sorting order
          const firstBookingDate = await bookingItems
            .first()
            .locator('[data-testid="booking-date"]')
            .textContent();
          const secondBookingDate = await bookingItems
            .nth(1)
            .locator('[data-testid="booking-date"]')
            .textContent();

          const firstDate = new Date(firstBookingDate || '');
          const secondDate = new Date(secondBookingDate || '');

          expect(firstDate.getTime()).toBeGreaterThanOrEqual(
            secondDate.getTime()
          );
        }
      }
    });
  });

  test('should display payment status and handle payment actions', async () => {
    await test.step('View payment details', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');
      await page.waitForSelector('[data-testid="user-dashboard"]');

      const bookingItems = page.locator('[data-testid="booking-item"]');
      const bookingCount = await bookingItems.count();

      if (bookingCount > 0) {
        // Click on first booking to view details
        await bookingItems.first().click();

        // Should show booking detail modal or navigate to detail page
        await expect(
          page.locator('[data-testid="booking-detail"]')
        ).toBeVisible({ timeout: 5000 });

        // Payment information should be displayed
        await expect(
          page.locator('[data-testid="payment-status"]')
        ).toBeVisible();
        await expect(
          page.locator('[data-testid="payment-amount"]')
        ).toBeVisible();

        // If paid, should show payment method
        const paymentStatus = await page
          .locator('[data-testid="payment-status"]')
          .textContent();
        if (paymentStatus === 'CONFIRMED' || paymentStatus === 'COMPLETED') {
          await expect(
            page.locator('[data-testid="payment-method"]')
          ).toBeVisible();
          await expect(
            page.locator('[data-testid="transaction-id"]')
          ).toBeVisible();
        }
      }
    });

    await test.step('Test refund request functionality', async () => {
      const bookingItems = page.locator('[data-testid="booking-item"]');
      const bookingCount = await bookingItems.count();

      if (bookingCount > 0) {
        // Look for a confirmed booking that can be refunded
        for (let i = 0; i < bookingCount; i++) {
          const booking = bookingItems.nth(i);
          const status = await booking
            .locator('[data-testid="booking-status"]')
            .textContent();

          if (status === 'CONFIRMED') {
            await booking.click();
            await page.waitForSelector('[data-testid="booking-detail"]');

            // Refund button should be available for confirmed bookings
            const refundButton = page.locator(
              '[data-testid="request-refund-button"]'
            );
            if (await refundButton.isVisible()) {
              await refundButton.click();

              // Should show refund confirmation dialog
              await expect(
                page.locator('[data-testid="refund-confirmation"]')
              ).toBeVisible();
              await expect(
                page.locator('[data-testid="refund-policy"]')
              ).toBeVisible();

              // Should have confirm and cancel options
              await expect(
                page.locator('[data-testid="confirm-refund"]')
              ).toBeVisible();
              await expect(
                page.locator('[data-testid="cancel-refund"]')
              ).toBeVisible();

              // Cancel the refund for this test
              await page.click('[data-testid="cancel-refund"]');
              await expect(
                page.locator('[data-testid="refund-confirmation"]')
              ).not.toBeVisible();
            }
            break;
          }
        }
      }
    });
  });

  test('should handle course access and materials', async () => {
    await test.step('View course access', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');
      await page.waitForSelector('[data-testid="user-dashboard"]');

      // Look for confirmed/completed bookings
      const bookingItems = page.locator('[data-testid="booking-item"]');
      const bookingCount = await bookingItems.count();

      if (bookingCount > 0) {
        for (let i = 0; i < bookingCount; i++) {
          const booking = bookingItems.nth(i);
          const status = await booking
            .locator('[data-testid="booking-status"]')
            .textContent();

          if (status === 'CONFIRMED' || status === 'COMPLETED') {
            // Should have access to course materials
            const accessButton = booking.locator(
              '[data-testid="access-course"]'
            );
            if (await accessButton.isVisible()) {
              await expect(accessButton).toBeEnabled();

              // Click to access course
              await accessButton.click();

              // Should navigate to course materials or open course portal
              await page.waitForTimeout(2000);

              // Verify we're in course access area
              const isCoursePortal = await page
                .locator('[data-testid="course-portal"]')
                .isVisible();
              const isCourseMaterials = await page
                .locator('[data-testid="course-materials"]')
                .isVisible();

              expect(isCoursePortal || isCourseMaterials).toBeTruthy();

              if (isCoursePortal) {
                // Verify course content is accessible
                await expect(
                  page.locator('[data-testid="course-content"]')
                ).toBeVisible();
                await expect(
                  page.locator('[data-testid="course-progress"]')
                ).toBeVisible();
              }

              // Navigate back to dashboard
              await page.goBack();
              await page.waitForSelector('[data-testid="user-dashboard"]');
            }
            break;
          }
        }
      }
    });

    await test.step('Verify upcoming course notifications', async () => {
      // Check for upcoming course reminders
      const upcomingCourses = page.locator('[data-testid="upcoming-courses"]');
      if (await upcomingCourses.isVisible()) {
        // Should show course schedule information
        await expect(
          page.locator('[data-testid="course-schedule"]')
        ).toBeVisible();

        // Should have calendar integration option
        const calendarButton = page.locator('[data-testid="add-to-calendar"]');
        if (await calendarButton.isVisible()) {
          await expect(calendarButton).toBeEnabled();
        }

        // Should show course location/access details
        await expect(
          page.locator('[data-testid="course-access-info"]')
        ).toBeVisible();
      }
    });
  });

  test('should manage user profile and account settings', async () => {
    await test.step('Navigate to profile settings', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');
      await page.waitForSelector('[data-testid="user-dashboard"]');

      // Navigate to profile section
      await page.click('[data-testid="nav-profile"]');
      await expect(
        page.locator('[data-testid="profile-section"]')
      ).toBeVisible();
    });

    await test.step('Verify profile information display', async () => {
      // Basic profile information should be shown
      await expect(page.locator('[data-testid="profile-email"]')).toBeVisible();
      await expect(page.locator('[data-testid="profile-name"]')).toBeVisible();
      await expect(page.locator('[data-testid="member-since"]')).toBeVisible();

      // Account statistics should be displayed
      await expect(
        page.locator('[data-testid="total-courses-completed"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="total-amount-spent"]')
      ).toBeVisible();

      // Profile completion status
      const profileCompletion = page.locator(
        '[data-testid="profile-completion"]'
      );
      if (await profileCompletion.isVisible()) {
        const completionText = await profileCompletion.textContent();
        expect(completionText).toMatch(/\d+%/);
      }
    });

    await test.step('Test profile editing', async () => {
      // Edit profile button should be available
      const editButton = page.locator('[data-testid="edit-profile"]');
      if (await editButton.isVisible()) {
        await editButton.click();

        // Should show editable form
        await expect(
          page.locator('[data-testid="profile-edit-form"]')
        ).toBeVisible();

        // Form fields should be editable
        const nameField = page.locator('[data-testid="edit-name"]');
        if (await nameField.isVisible()) {
          await expect(nameField).toBeEditable();
        }

        // Save and cancel buttons should be present
        await expect(
          page.locator('[data-testid="save-profile"]')
        ).toBeVisible();
        await expect(page.locator('[data-testid="cancel-edit"]')).toBeVisible();

        // Cancel editing
        await page.click('[data-testid="cancel-edit"]');
        await expect(
          page.locator('[data-testid="profile-edit-form"]')
        ).not.toBeVisible();
      }
    });

    await test.step('Navigate to account settings', async () => {
      await page.click('[data-testid="nav-settings"]');
      await expect(
        page.locator('[data-testid="settings-section"]')
      ).toBeVisible();

      // Settings categories should be available
      await expect(
        page.locator('[data-testid="notification-settings"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="privacy-settings"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="billing-settings"]')
      ).toBeVisible();
    });

    await test.step('Test notification preferences', async () => {
      const notificationSettings = page.locator(
        '[data-testid="notification-settings"]'
      );
      await notificationSettings.click();

      // Notification toggles should be present
      const emailNotifications = page.locator(
        '[data-testid="email-notifications"]'
      );
      if (await emailNotifications.isVisible()) {
        await expect(emailNotifications).toBeVisible();

        // Should have specific notification types
        await expect(
          page.locator('[data-testid="course-reminders"]')
        ).toBeVisible();
        await expect(
          page.locator('[data-testid="payment-confirmations"]')
        ).toBeVisible();
        await expect(
          page.locator('[data-testid="course-updates"]')
        ).toBeVisible();
      }
    });
  });

  test('should handle booking cancellation workflow', async () => {
    await test.step('Find cancellable booking', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');
      await page.waitForSelector('[data-testid="user-dashboard"]');

      await page.click('[data-testid="nav-bookings"]');

      const bookingItems = page.locator('[data-testid="booking-item"]');
      const bookingCount = await bookingItems.count();

      if (bookingCount > 0) {
        // Look for a confirmed booking that can be cancelled
        for (let i = 0; i < bookingCount; i++) {
          const booking = bookingItems.nth(i);
          const status = await booking
            .locator('[data-testid="booking-status"]')
            .textContent();

          if (status === 'CONFIRMED') {
            await booking.click();
            await page.waitForSelector('[data-testid="booking-detail"]');

            // Cancel button should be available
            const cancelButton = page.locator('[data-testid="cancel-booking"]');
            if (await cancelButton.isVisible()) {
              await cancelButton.click();

              // Should show cancellation confirmation
              await expect(
                page.locator('[data-testid="cancel-confirmation"]')
              ).toBeVisible();
              await expect(
                page.locator('[data-testid="cancellation-policy"]')
              ).toBeVisible();

              // Should explain refund policy
              await expect(
                page.locator('[data-testid="refund-policy-info"]')
              ).toBeVisible();

              // Should have reason selection
              const reasonSelect = page.locator(
                '[data-testid="cancellation-reason"]'
              );
              if (await reasonSelect.isVisible()) {
                await reasonSelect.selectOption('schedule-conflict');
              }

              // For this test, cancel the cancellation
              await page.click('[data-testid="cancel-cancellation"]');
              await expect(
                page.locator('[data-testid="cancel-confirmation"]')
              ).not.toBeVisible();
            }
            break;
          }
        }
      }
    });
  });

  test('should display dashboard overview and statistics', async () => {
    await test.step('View dashboard overview', async () => {
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');
      await page.waitForSelector('[data-testid="user-dashboard"]');

      // Overview should be the default view
      await expect(
        page.locator('[data-testid="dashboard-overview"]')
      ).toBeVisible();
    });

    await test.step('Verify statistics cards', async () => {
      // Key metrics should be displayed
      await expect(page.locator('[data-testid="total-courses"]')).toBeVisible();
      await expect(
        page.locator('[data-testid="completed-courses"]')
      ).toBeVisible();
      await expect(
        page.locator('[data-testid="upcoming-courses"]')
      ).toBeVisible();
      await expect(page.locator('[data-testid="total-spent"]')).toBeVisible();

      // Verify metrics have valid values
      const totalCoursesText = await page
        .locator('[data-testid="total-courses"]')
        .textContent();
      expect(totalCoursesText).toMatch(/\d+/);

      const totalSpentText = await page
        .locator('[data-testid="total-spent"]')
        .textContent();
      expect(totalSpentText).toMatch(/\$\d+/);
    });

    await test.step('Verify recent activity', async () => {
      // Recent activity section should show latest actions
      const recentActivity = page.locator('[data-testid="recent-activity"]');
      if (await recentActivity.isVisible()) {
        // Should show recent bookings, payments, course access
        const activityItems = page.locator('[data-testid="activity-item"]');
        const activityCount = await activityItems.count();

        if (activityCount > 0) {
          // Each activity item should have timestamp and description
          const firstActivity = activityItems.first();
          await expect(
            firstActivity.locator('[data-testid="activity-timestamp"]')
          ).toBeVisible();
          await expect(
            firstActivity.locator('[data-testid="activity-description"]')
          ).toBeVisible();
        }
      }
    });

    await test.step('Verify quick actions', async () => {
      // Quick action buttons should be available
      await expect(
        page.locator('[data-testid="browse-courses-action"]')
      ).toBeVisible();

      const browseCoursesButton = page.locator(
        '[data-testid="browse-courses-action"]'
      );
      await browseCoursesButton.click();

      // Should navigate to courses page
      await page.waitForURL(/courses/);
      await expect(page.locator('[data-testid="course-list"]')).toBeVisible();

      // Navigate back to dashboard
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="dashboard-link"]');
    });
  });

  test.afterEach(async () => {
    // Clean up any test modifications
    // Reset any changed settings or preferences
  });
});
