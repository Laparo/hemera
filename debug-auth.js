import { chromium } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function debugAuth() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000/sign-in');

    await page.waitForTimeout(3000);

    // Take screenshot
    await page.screenshot({ path: 'debug-signin-page.png' });

    // Check for sign-in elements

    const elements = {
      'sign-in-card': '[data-testid="sign-in-card"]',
      'clerk-root': '.cl-rootBox',
      'clerk-card': '.cl-card',
      'identifier-input': 'input[name="identifier"]',
      'password-input': 'input[name="password"]',
      'submit-button': 'button[type="submit"]',
      'primary-button': 'button[data-localization-key="formButtonPrimary"]',
    };

    for (const [name, selector] of Object.entries(elements)) {
      const element = page.locator(selector);
      const count = await element.count();
      const isVisible = count > 0 ? await element.first().isVisible() : false;
    }

    // Try authentication

    // Wait for the form to be ready
    await page.waitForSelector('[data-testid="sign-in-card"]', {
      timeout: 10000,
    });

    await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });

    // Fill email
    await page.fill('input[name="identifier"]', 'e2e.test@example.com');

    // Take screenshot after email
    await page.screenshot({ path: 'debug-email-filled.png' });

    // Try to click continue button
    const continueBtn = page
      .locator('button[data-localization-key="formButtonPrimary"]')
      .first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    } else {
      const submitBtn = page.locator('button[type="submit"]').first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
      }
    }

    // Wait for password field
    await page.waitForSelector('input[name="password"]', { timeout: 10000 });

    // Fill password
    await page.fill(
      'input[name="password"]',
      'E2ETestPassword2024!SecureForTesting'
    );

    // Take screenshot after password
    await page.screenshot({ path: 'debug-password-filled.png' });

    // Click sign in button
    const signInBtn = page
      .locator('button[data-localization-key="formButtonPrimary"]')
      .first();
    if (await signInBtn.isVisible()) {
      await signInBtn.click();
    }

    // Wait for result
    await page.waitForTimeout(5000);

    // Check for success indicators
    const userProfileBtn = page.locator('[data-testid="user-profile-button"]');
    const userProfileCount = await userProfileBtn.count();

    await page.screenshot({ path: 'debug-final-state.png' });
  } catch (error) {
    await page.screenshot({ path: 'debug-error.png' });
  } finally {
    await browser.close();
  }
}

debugAuth();
