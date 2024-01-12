import { chromium, Browser, Page } from 'playwright';
import { test, expect } from '@jest/globals';

describe('User Account Management E2E Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('User can register', async () => {
    await page.goto('http://localhost:8001/api/register');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="role"]', 'user');
    await page.click('button[type="submit"]');

    const registerResponse = await page.waitForResponse(
      (response) =>
        response.url().includes('/register') && response.status() === 201,
    );

    expect(registerResponse.status()).toBe(201);
  });

  test('User can log in', async () => {
    await page.goto('http://localhost:8001/api/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    const loginResponse = await page.waitForResponse(
      (response) =>
        response.url().includes('/login') && response.status() === 200,
    );

    expect(loginResponse.status()).toBe(200);
  });

  test('User can access their information', async () => {
    await page.goto('http://localhost:8001/api/user');
    await page.waitForSelector('text=User information');
  });

  test('User can log out', async () => {
    await page.goto('http://localhost:8001/api/logout');
    const logoutResponse = await page.waitForResponse(
      (response) =>
        response.url().includes('/logout') && response.status() === 200,
    );

    expect(logoutResponse.status()).toBe(200);
  });
});
