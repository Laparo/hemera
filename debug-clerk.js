#!/usr/bin/env node

/**
 * Debug script to check Clerk authentication setup
 * This script tests the sign-in form functionality
 */

import { chromium } from 'playwright';

async function debugClerkAuth() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the sign-in page
    await page.goto('http://localhost:3000/auth/signin', {
      waitUntil: 'networkidle',
    });

    // Wait a bit for Clerk to fully load
    await page.waitForTimeout(3000);

    // Take a screenshot
    await page.screenshot({
      path: 'debug-clerk-signin.png',
      fullPage: true,
    });

    // Check for submit buttons
    const submitButtons = await page.locator('button[type="submit"]').all();

    for (let i = 0; i < submitButtons.length; i++) {
      const button = submitButtons[i];
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      const ariaHidden = await button.getAttribute('aria-hidden');
      const text = await button.textContent();
    }

    // Check for other relevant elements
    const emailInputs = await page.locator('input[name="identifier"]').all();
    const passwordInputs = await page.locator('input[name="password"]').all();

    // Check for Clerk-specific elements
    const clerkElements = await page.locator('[class*="cl-"]').all();

    // Check for any error messages
    const errors = await page.locator('[class*="error"], [role="alert"]').all();

    // Wait for user input to inspect manually
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
  } catch (error) {
  } finally {
    await browser.close();
  }
}

// Only run if called directly
if (process.argv[1].endsWith('debug-clerk.js')) {
}

export { debugClerkAuth };
