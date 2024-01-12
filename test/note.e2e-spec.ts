import { chromium, Browser, Page } from 'playwright';
import { test } from '@jest/globals';

describe('Note Management E2E Tests', () => {
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

  test('User login', async () => {
    await page.goto('https://localhost:8001/api/login');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
  });

  test('Create a note', async () => {
    await page.goto('https://your-app-url.com/notes');
    await page.click('button#create-note');
    await page.fill('textarea#note-content', 'Test Note Content');
    await page.click('button#save-note');
    await page.waitForSelector('text=Note created successfully');
  });

  test('View a note', async () => {
    await page.click('a#view-note');
    await page.waitForSelector('text=Test Note Content');
  });

  test('Edit a note', async () => {
    await page.click('button#edit-note');
    await page.fill('textarea#note-content', 'Updated Note Content');
    await page.click('button#save-note');
    await page.waitForSelector('text=Note updated successfully');
  });

  test('Delete a note', async () => {
    await page.click('button#delete-note');
    await page.waitForSelector('text=Note deleted successfully');
  });
});
