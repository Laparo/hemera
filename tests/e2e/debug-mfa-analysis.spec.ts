import { test } from '@playwright/test';

test('Debug MFA page analysis', async ({ page }) => {
  console.log('🔄 Starting MFA page analysis');

  // Navigate to sign-in page
  await page.goto('/sign-in');
  console.log('📍 Navigated to sign-in page');

  // Wait for the sign-in form to load
  await page.waitForSelector(
    '.cl-signIn-root, .cl-card, [data-testid="sign-in-card"], form',
    { timeout: 10000 }
  );
  console.log('✅ Sign-in form loaded');

  // Fill credentials that we know work
  const emailInput = page
    .locator(
      'input[name="identifier"], input[type="email"], input[placeholder*="email" i]'
    )
    .first();
  await emailInput.fill('e2e.test@example.com');
  console.log('📧 Email filled');

  const passwordInput = page
    .locator('input[name="password"], input[type="password"]')
    .first();
  if (await passwordInput.isVisible({ timeout: 5000 })) {
    await passwordInput.fill('TestPassword123!@#');
    console.log('🔑 Password filled');
  }

  // Click sign in button with proper selectors
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
        console.log(`🔘 Clicked submit button with: ${selector}`);
        buttonClicked = true;
        break;
      }
    } catch (e) {
      // Continue to next selector
    }
  }

  if (!buttonClicked) {
    console.log('❌ No clickable submit button found');
    return;
  }

  // Wait for navigation to MFA page
  await page.waitForTimeout(5000);
  const mfaUrl = page.url();
  console.log(`🔐 MFA URL: ${mfaUrl}`);

  // Take screenshot of MFA page
  await page.screenshot({ path: 'debug-mfa-page.png', fullPage: true });
  console.log('📸 MFA page screenshot saved');

  // Analyze all elements on the MFA page
  console.log('🔍 Analyzing MFA page elements:');

  // Check page title and headings
  const pageTitle = await page.title();
  console.log(`📄 Page title: ${pageTitle}`);

  const headings = await page.locator('h1, h2, h3').allTextContents();
  console.log(`📝 Headings: ${JSON.stringify(headings)}`);

  // Check for all text content that might give us clues
  const allText = await page.textContent('body');
  const relevantPhrases = [
    'backup code',
    'Skip',
    'Continue',
    'authenticator',
    'SMS',
    'phone',
    'verify',
    'factor',
    'security',
  ];

  console.log('🔍 Relevant text found on page:');
  for (const phrase of relevantPhrases) {
    if (allText?.toLowerCase().includes(phrase.toLowerCase())) {
      console.log(`  ✅ Found: "${phrase}"`);
    }
  }

  // List all buttons with their text
  console.log('🔍 All buttons on MFA page:');
  const allButtons = await page.locator('button').all();
  for (let i = 0; i < allButtons.length; i++) {
    const btn = allButtons[i];
    const text = await btn.textContent();
    const isVisible = await btn.isVisible();
    const isEnabled = await btn.isEnabled();
    const classes = await btn.getAttribute('class');
    console.log(
      `  Button ${i}: text="${text}", visible=${isVisible}, enabled=${isEnabled}, classes="${classes}"`
    );
  }

  // List all links
  console.log('🔍 All links on MFA page:');
  const allLinks = await page.locator('a').all();
  for (let i = 0; i < Math.min(allLinks.length, 5); i++) {
    const link = allLinks[i];
    const text = await link.textContent();
    const href = await link.getAttribute('href');
    console.log(`  Link ${i}: text="${text}", href="${href}"`);
  }

  // Look for input fields
  console.log('🔍 All input fields on MFA page:');
  const allInputs = await page.locator('input').all();
  for (let i = 0; i < allInputs.length; i++) {
    const input = allInputs[i];
    const type = await input.getAttribute('type');
    const name = await input.getAttribute('name');
    const placeholder = await input.getAttribute('placeholder');
    const isVisible = await input.isVisible();
    console.log(
      `  Input ${i}: type="${type}", name="${name}", placeholder="${placeholder}", visible=${isVisible}`
    );
  }
});
