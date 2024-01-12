import { chromium, Browser, Page } from 'playwright';
import { test, expect } from '@jest/globals';

describe('User Management E2E Tests', () => {
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

  test('Admin can log in', async () => {
    await page.goto('http://localhost:8001/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminpassword');
    await page.click('button[type="submit"]');
  });

  test('Admin can create a new user', async () => {
    await page.goto('http://localhost:8001/users');
    await page.click('button#create-user');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.fill('input[name="role"]', 'user');
    await page.click('button#submit-user');
    await page.waitForSelector('text=User created successfully');
    expect(await page.textContent('body')).toContain(
      'User created successfully',
    );
  });

  test('Admin can view user details', async () => {
    await page.goto('http://localhost:8001/users/1');
    await page.waitForSelector('text=Test User');
    expect(await page.textContent('body')).toContain('Test User');
  });

  test('Admin can edit user details', async () => {
    await page.goto('http://localhost:8001/users/1/edit');
    await page.fill('input[name="name"]', 'Updated User');
    await page.click('button#submit-user');
    await page.waitForSelector('text=User updated successfully');
    expect(await page.textContent('body')).toContain(
      'User updated successfully',
    );
  });

  test('Admin can delete a user', async () => {
    await page.goto('http://localhost:8001/users/1');
    await page.click('button#delete-user');
    await page.waitForSelector('text=User deleted successfully');
    expect(await page.textContent('body')).toContain(
      'User deleted successfully',
    );
  });
});
