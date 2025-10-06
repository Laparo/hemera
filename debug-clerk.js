#!/usr/bin/env node

/**
 * Debug script to check Clerk authentication setup
 * This script tests the sign-in form functionality
 */

import { chromium } from 'playwright';

async function debugClerkAuth() {
  console.log('🔍 Starting Clerk authentication debug...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the sign-in page
    console.log('📍 Navigating to sign-in page...');
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
    console.log('📸 Screenshot saved as debug-clerk-signin.png');

    // Check for submit buttons
    const submitButtons = await page.locator('button[type="submit"]').all();
    console.log(`🔘 Found ${submitButtons.length} submit button(s)`);

    for (let i = 0; i < submitButtons.length; i++) {
      const button = submitButtons[i];
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      const ariaHidden = await button.getAttribute('aria-hidden');
      const text = await button.textContent();

      console.log(`Button ${i + 1}:`);
      console.log(`  - Text: "${text}"`);
      console.log(`  - Visible: ${isVisible}`);
      console.log(`  - Enabled: ${isEnabled}`);
      console.log(`  - aria-hidden: ${ariaHidden}`);
    }

    // Check for other relevant elements
    const emailInputs = await page.locator('input[name="identifier"]').all();
    const passwordInputs = await page.locator('input[name="password"]').all();

    console.log(`📧 Email inputs: ${emailInputs.length}`);
    console.log(`🔒 Password inputs: ${passwordInputs.length}`);

    // Check for Clerk-specific elements
    const clerkElements = await page.locator('[class*="cl-"]').all();
    console.log(`⚙️ Clerk elements found: ${clerkElements.length}`);

    // Check for any error messages
    const errors = await page.locator('[class*="error"], [role="alert"]').all();
    console.log(`❌ Error elements: ${errors.length}`);

    // Wait for user input to inspect manually
    console.log('⏸️ Pausing for manual inspection. Press Enter to continue...');
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    await browser.close();
  }
}

// Only run if called directly
if (process.argv[1].endsWith('debug-clerk.js')) {
  debugClerkAuth().catch(console.error);
}

export { debugClerkAuth };
