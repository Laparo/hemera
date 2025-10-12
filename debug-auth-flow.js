import { chromium } from 'playwright';

async function debugAuthFlow() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. Go to dashboard (should redirect to sign-in)
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForTimeout(2000);

    // 2. Fill in credentials
    await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });
    await page.fill('input[name="identifier"]', 'test-user@example.com');
    await page.fill('input[name="password"]', 'TestUser123!SecurePassword');

    // 3. Submit form
    await page.press('input[name="password"]', 'Enter');

    // 4. Wait for redirect and check final URL
    await page.waitForTimeout(5000);

    // Take screenshot
    await page.screenshot({ path: 'debug-auth-flow.png', fullPage: true });

    // Wait for user to examine
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });
  } catch (error) {
  } finally {
    await browser.close();
  }
}

if (process.argv[1].endsWith('debug-auth-flow.js')) {
}

export { debugAuthFlow };
