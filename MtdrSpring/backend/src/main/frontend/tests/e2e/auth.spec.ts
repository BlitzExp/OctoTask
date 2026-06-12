import { test, expect } from '@playwright/test';
import { USERS } from './utils/test-data';

test.describe('Authentication Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // Changed from /login
  });

  test('Sign in with incorrect, then correct credentials', async ({ page }) => {
    // 1. Incorrect Login
    await page.fill('#username', USERS.invalid.email);
    await page.fill('#password', USERS.invalid.password);

    page.once('dialog', dialog => {
      expect(dialog.message()).toMatch(/Login failed|An error occurred/);
      dialog.dismiss();
    });

    await page.click('button[type="submit"]');

    // Verify we did not render the dashboard
    await expect(page.locator('.loginContainer')).toBeVisible(); 

    // 2. Correct Login
    await page.fill('#username', USERS.developer.email);
    await page.fill('#password', USERS.developer.password);
    await page.click('button[type="submit"]');

    // Wait for the dashboard to render instead of the URL
    await expect(page.locator('.task-dashboard-container')).toBeVisible({ timeout: 10000 });
  });

  test.fail('Should fail when API is down', async ({ page }) => {
    await page.route('**/api/users/Login*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });

    await page.fill('#username', USERS.developer.email);
    await page.fill('#password', USERS.developer.password);
    
    page.once('dialog', dialog => dialog.dismiss());
    
    await page.click('button[type="submit"]');
    
    // We expect this to fail because the dashboard container will never appear
    await expect(page.locator('.task-dashboard-container')).toBeVisible({ timeout: 2000 });
  });
});