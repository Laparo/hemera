import { test } from '@playwright/test';

test('Debug authentication flow (fixed)', async ({ page }) => {
  console.log('🔄 Starting debug auth test');

  // Navigate to sign-in page
  await page.goto('/sign-in');
  console.log('📍 Navigated to sign-in page');

  // Take screenshot of initial state
  await page.screenshot({ path: 'debug-signin-page.png', fullPage: true });
  console.log('📸 Screenshot saved: debug-signin-page.png');

  // Wait for the sign-in form to load
  await page.waitForSelector(
    '.cl-signIn-root, .cl-card, [data-testid="sign-in-card"], form',
    { timeout: 10000 }
  );
  console.log('✅ Sign-in form loaded');

  // Fill email (testing alternative credentials)
  const emailInput = page
    .locator(
      'input[name="identifier"], input[type="email"], input[placeholder*="email" i]'
    )
    .first();
  await emailInput.fill('e2e.test@example.com');
  console.log('📧 Email filled (using e2e.test@example.com)');
  await page.screenshot({ path: 'debug-after-email.png', fullPage: true });
  console.log('📸 Screenshot after email');

  // Look for password field and fill it
  const passwordInput = page
    .locator('input[name="password"], input[type="password"]')
    .first();
  if (await passwordInput.isVisible({ timeout: 5000 })) {
    console.log('🔑 Password field found');
    await passwordInput.fill('TestPassword123!');
    console.log('🔑 Password filled (using TestPassword123!)');
    await page.screenshot({ path: 'debug-after-password.png', fullPage: true });
    console.log('📸 Screenshot after password');
  } else {
    console.log('❌ Password field not found, trying to continue without it');
  }

  // Click sign in button
  const buttonSelectors = [
    'button[data-localization-key="formButtonPrimary"]:not([aria-hidden="true"])',
    'button[type="submit"]:not([aria-hidden="true"])',
    'button:has-text("Sign in")',
    'button:has-text("Continue")',
    '.cl-formButtonPrimary',
    'button[type="submit"]', // Last resort
  ];

  let buttonClicked = false;
  for (const selector of buttonSelectors) {
    try {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 2000 })) {
        await btn.click();
        console.log(`🔘 Clicked sign in button with selector: ${selector}`);
        buttonClicked = true;
        break;
      }
    } catch (e) {
      // Continue to next selector
    }
  }

  if (!buttonClicked) {
    console.log('❌ No clickable sign in button found');
  }

  // Wait a moment for processing
  await page.waitForTimeout(3000);

  // Check final state
  let finalUrl = page.url();
  console.log(`🏁 Final URL: ${finalUrl}`);

  // Handle MFA if required
  if (finalUrl.includes('/factor-one') || finalUrl.includes('/factor')) {
    console.log("🔐 Factor page detected, checking what's needed...");

    // First check if it's actually requesting password again
    const passwordInput = page
      .locator('input[name="password"], input[type="password"]')
      .first();
    if (await passwordInput.isVisible({ timeout: 3000 })) {
      console.log(
        '🔑 Password field found on factor page - entering password again...'
      );
      await passwordInput.fill('TestPassword123!');

      // Click continue button
      const continueBtn = page.locator('button:has-text("Continue")').first();
      if (await continueBtn.isVisible({ timeout: 2000 })) {
        await continueBtn.click();
        console.log('🔘 Clicked Continue button');
        await page.waitForTimeout(5000);

        // Update URL after continue
        finalUrl = page.url();
        console.log(`🏁 URL after continue: ${finalUrl}`);
      }
    } else {
      // This is actual MFA, try bypass options
      console.log('🔐 Real MFA detected, attempting to handle...');

      // Look for bypass options first
      const bypassOptions = [
        'text="Skip"',
        'text="Use backup code"',
        '[data-testid="skip-mfa"]',
        'button:has-text("Skip")',
        'button:has-text("Use backup code")',
        'a:has-text("Use another method")',
      ];

      let bypassed = false;
      for (const selector of bypassOptions) {
        try {
          const bypassBtn = page.locator(selector).first();
          if (await bypassBtn.isVisible({ timeout: 2000 })) {
            console.log(`🔑 Found bypass option: ${selector}`);
            await bypassBtn.click();
            await page.waitForTimeout(3000);
            bypassed = true;
            break;
          }
        } catch (e) {
          // Continue to next option
        }
      }

      if (!bypassed) {
        // Try common test OTP patterns
        const otpInput = page
          .locator('input[name="code"], input[type="text"]')
          .first();
        if (await otpInput.isVisible({ timeout: 3000 })) {
          console.log('🔢 Trying test OTP codes...');
          const testCodes = ['123456', '000000', '111111'];

          for (const code of testCodes) {
            await otpInput.fill(code);
            console.log(`🔢 Trying OTP: ${code}`);

            const submitBtn = page
              .locator(
                'button[type="submit"], button:has-text("Continue"), button:has-text("Verify")'
              )
              .first();
            if (await submitBtn.isVisible({ timeout: 2000 })) {
              await submitBtn.click();
              await page.waitForTimeout(3000);

              // Check if we progressed
              const newUrl = page.url();
              if (newUrl !== finalUrl) {
                console.log(`✅ OTP ${code} worked! New URL: ${newUrl}`);
                finalUrl = newUrl;
                break;
              }
            }
          }
        }
      }
    }

    // Update final URL after MFA handling
    finalUrl = page.url();
    console.log(`🏁 Final URL after factor handling: ${finalUrl}`);
  }

  await page.screenshot({ path: 'debug-final-state.png', fullPage: true });
  console.log('📸 Final screenshot saved');

  // Check for success indicators
  const hasUserButton = await page
    .locator('button:has-text("Open user button")')
    .isVisible({ timeout: 2000 })
    .catch(() => false);
  const isOnDashboard =
    finalUrl.includes('/dashboard') && !finalUrl.includes('/sign-in');
  const notOnSignIn = !finalUrl.includes('/sign-in');

  console.log(`🔍 Has user button: ${hasUserButton}`);
  console.log(`🔍 Is on dashboard: ${isOnDashboard}`);
  console.log(`🔍 Not on sign-in: ${notOnSignIn}`);

  // Check for error messages
  const errorElements = await page
    .locator(
      '.cl-formFieldError, .error, [role="alert"], .cl-formFieldError__text'
    )
    .all();
  for (const errorEl of errorElements) {
    const errorText = await errorEl.textContent();
    if (errorText && errorText.trim()) {
      console.log(`❌ Error found: ${errorText}`);
    }
  }

  // Check page content for common error patterns
  const pageContent = await page.textContent('body');
  if (pageContent?.includes('Invalid email address or password')) {
    console.log('❌ Invalid credentials error detected');
  } else if (pageContent?.includes('Account not found')) {
    console.log('❌ Account not found error detected');
  } else if (pageContent?.includes('Too many attempts')) {
    console.log('❌ Rate limiting detected');
  } else if (pageContent?.includes('Please complete your sign up')) {
    console.log('❌ Account needs to complete signup');
  } else {
    console.log('🔍 No obvious error messages found in page content');
  }

  // Additional debugging: List all buttons for analysis
  console.log('🔍 Analyzing all buttons on the page:');
  const allButtons = await page.locator('button').all();
  for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
    // Limit to first 10 buttons
    const btn = allButtons[i];
    const text = await btn.textContent();
    const isVisible = await btn.isVisible();
    const isEnabled = await btn.isEnabled();
    console.log(
      `  Button ${i}: text="${text}", visible=${isVisible}, enabled=${isEnabled}`
    );
  }
});
