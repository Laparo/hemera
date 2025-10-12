import { test } from '@playwright/test';

test('Debug simple authentication flow', async ({ page }) => {
  console.log('🔄 Starting debug auth test');

  // Clear cookies to ensure clean auth state (localStorage clearing may fail due to security restrictions)
  await page.context().clearCookies();
  console.log('🧹 Cleared cookies for clean auth state');

  // Navigate to sign-in
  await page.goto('/sign-in');
  console.log('📍 Navigated to sign-in page');

  // Wait a moment for any redirects or page loads
  await page.waitForTimeout(2000);

  // Log initial page state
  const initialUrl = page.url();
  const initialTitle = await page.title();
  const initialBodyText = await page.textContent('body');
  const hasWelcomeBack = initialBodyText?.includes('Welcome back') || false;
  const hasSignInCard = await page
    .locator('[data-testid="sign-in-card"]')
    .isVisible()
    .catch(() => false);

  console.log('🔍 Initial page state:', {
    url: initialUrl,
    title: initialTitle,
    hasWelcomeBack,
    hasSignInCard,
    bodyTextSnippet: initialBodyText?.substring(0, 300) + '...',
  });

  // Take screenshot
  await page.screenshot({ path: 'debug-signin-page.png' });
  console.log('📸 Screenshot saved: debug-signin-page.png');

  // Wait for sign-in form
  await page.waitForSelector('[data-testid="sign-in-card"]', {
    timeout: 10000,
  });
  console.log('✅ Sign-in form loaded');

  // Fill email
  await page.fill('input[name="identifier"]', 'e2e.dashboard@example.com');
  console.log('📧 Email filled');

  // Take screenshot after email
  await page.screenshot({ path: 'debug-after-email.png' });
  console.log('📸 Screenshot after email');

  // Click continue (if needed)
  try {
    const continueBtn = page.locator('button[type="submit"]').first();
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      console.log('🔘 Clicked continue button');
      await page.waitForTimeout(2000);
    }
  } catch (e) {
    console.log('⚠️ No continue button found or not needed');
  }

  // Wait for password field
  await page.waitForSelector('input[name="password"]', { timeout: 10000 });
  console.log('🔑 Password field found');

  // Fill password
  await page.fill(
    'input[name="password"]',
    'E2ETestPassword2024!SecureForTesting'
  );
  console.log('🔑 Password filled');

  // Take screenshot after password
  await page.screenshot({ path: 'debug-after-password.png' });
  console.log('📸 Screenshot after password');

  // Click sign in - try multiple selectors
  let buttonClicked = false;

  // Try different button selectors
  const buttonSelectors = [
    'button[type="submit"]:not([aria-hidden="true"])',
    'button[data-localization-key="formButtonPrimary"]:not([aria-hidden="true"])',
    'button:has-text("Sign in")',
    'button:has-text("Continue")',
    '.cl-formButtonPrimary',
    'button[type="submit"]', // Last resort, even if hidden
  ];

  for (const selector of buttonSelectors) {
    try {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 2000 })) {
        await btn.click();
        console.log(`🔘 Clicked sign in button with selector: ${selector}`);
        buttonClicked = true;
        break;
      }
    } catch (e: any) {
      console.log(`⚠️ Button selector ${selector} failed: ${e.message}`);
    }
  }

  if (!buttonClicked) {
    console.log('❌ No clickable submit button found');
    // List all buttons for debugging
    const allButtons = await page.locator('button').all();
    for (let i = 0; i < allButtons.length; i++) {
      const btn = allButtons[i];
      const text = await btn.textContent();
      const isVisible = await btn.isVisible();
      const isEnabled = await btn.isEnabled();
      console.log(
        `Button ${i}: text="${text}", visible=${isVisible}, enabled=${isEnabled}`
      );
    }
  }

  // Wait and see what happens
  await page.waitForTimeout(5000);

  // Check final state
  const finalUrl = page.url();
  console.log(`🏁 Final URL: ${finalUrl}`);

  // Take final screenshot
  await page.screenshot({ path: 'debug-final-state.png' });
  console.log('📸 Final screenshot saved');

  // Check for success indicators
  const hasUserButton = await page
    .locator('button:has-text("Open user button")')
    .isVisible({ timeout: 2000 })
    .catch(() => false);
  const isDashboard =
    finalUrl.includes('/dashboard') && !finalUrl.includes('/sign-in');
  const notOnSignIn = !finalUrl.includes('/sign-in');

  console.log(`🔍 Has user button: ${hasUserButton}`);
  console.log(`🔍 Is dashboard: ${isDashboard}`);
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

  // Check for any error messages
  const errorMessages = await page
    .locator('.cl-formFieldErrorText, .cl-alertIcon')
    .allTextContents();
  if (errorMessages.length > 0) {
    console.log('❌ Error messages found:', errorMessages);
  }

  // Final success indicators check (comprehensive)
  const userButtonCount = await page.locator('.cl-userButton').count();
  const isDashboardFinal = finalUrl.includes('/dashboard');
  const isNotSignIn = !finalUrl.includes('/sign-in');

  console.log(`🔍 User button count: ${userButtonCount}`);
  console.log(`🔍 Is dashboard: ${isDashboard}`);
  console.log(`🔍 Not on sign-in: ${isNotSignIn}`);

  // This test is for debugging, so we don't need to assert success
  // Just log everything we can see
});
