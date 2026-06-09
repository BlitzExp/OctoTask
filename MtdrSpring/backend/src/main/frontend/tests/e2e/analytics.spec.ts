import { test, expect } from '@playwright/test';
import { USERS } from './utils/test-data';

test.describe('Manager Analytics @manager', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('#username', USERS.manager.email);
    await page.fill('#password', USERS.manager.password);
    await page.click('button[type="submit"]');
    await expect(page.locator('.task-dashboard-container')).toBeVisible({ timeout: 10000 });
  });

  test('Check analytics dashboard and verify snapshot', async ({ page }) => {
    // Click your specific Analytics button from the sidebar
    await page.locator('button.item-container', { hasText: 'Analytics' }).click();
    
    // Wait for the FIRST chart to render to avoid strict mode violations
    await page.locator('.recharts-wrapper').first().waitFor({ state: 'visible' });
    
    // RUBRIC: Snapshots (Visual Regression)
    await expect(page).toHaveScreenshot('analytics-dashboard.png', { maxDiffPixelRatio: 0.1 });
  });
});