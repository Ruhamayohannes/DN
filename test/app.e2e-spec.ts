import { chromium, Browser, Page } from 'playwright';

(async () => {
  const browser: Browser = await chromium.launch();
  const page: Page = await browser.newPage();

  // User Registration
  await page.goto('http://localhost:8001/api/register');
  await page.fill('input[name="name"]', 'Test User');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="role"]', 'user');
  await page.click('button[type="submit"]');
  await page.waitForResponse(response => response.url().includes('/register') && response.status() === 201);

  // User Login
  await page.goto('http://localhost:8001/api/login');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForResponse(response => response.url().includes('/login') && response.status() === 200);

  // Fetch User Information
  await page.goto('http://localhost:8001/api/user');
  await page.waitForSelector('text=User information');

  // Logout
  await page.goto('http://localhost:8001/api/logout');
  await page.waitForResponse(response => response.url().includes('/logout') && response.status() === 200);

  await browser.close();
})();
