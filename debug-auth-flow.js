import { chromium } from 'playwright';

async function debugAuthFlow() {
  console.log('🔍 Debugging auth flow...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. Go to dashboard (should redirect to sign-in)
    console.log('📍 Step 1: Going to /dashboard...');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(2000);

    console.log('📍 Current URL after redirect:', page.url());

    // 2. Fill in credentials
    console.log('📍 Step 2: Filling credentials...');
    await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });
    await page.fill('input[name="identifier"]', 'test-user@example.com');
    await page.fill('input[name="password"]', 'TestUser123!SecurePassword');

    // 3. Submit form
    console.log('📍 Step 3: Submitting form...');
    await page.press('input[name="password"]', 'Enter');

    // 4. Wait for redirect and check final URL
    await page.waitForTimeout(5000);
    console.log('📍 Final URL after sign-in:', page.url());

    // Take screenshot
    await page.screenshot({ path: 'debug-auth-flow.png', fullPage: true });
    console.log('📸 Screenshot saved as debug-auth-flow.png');

    // Wait for user to examine
    console.log('⏸️ Press Enter to continue...');
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

if (process.argv[1].endsWith('debug-auth-flow.js')) {
  debugAuthFlow().catch(console.error);
}

export { debugAuthFlow };
