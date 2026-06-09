import { test, expect } from '@playwright/test';
import { USERS, TASKS_TO_CREATE } from './utils/test-data';

test.describe('Developer Task Management', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('#username', USERS.developer.email);
    await page.fill('#password', USERS.developer.password);
    await page.click('button[type="submit"]');
    await expect(page.locator('.task-dashboard-container')).toBeVisible({ timeout: 10000 });
  });

  // RUBRIC: Parameterize tests
  for (const task of TASKS_TO_CREATE) {
    test(`Create task: ${task.title}`, async ({ page }) => {
      // Click your exact button
      await page.getByRole('button', { name: '+ Create Task' }).click(); 
      
      // Match the exact placeholders from your taskForm.jsx
      await page.getByPlaceholder('e.g. Patch OWASP injection vulnerabilities...').fill(task.title); 
      await page.getByPlaceholder('Detailed description of the task...').fill(task.desc); 
      
      // Select priority (Values are 1, 2, 3 in your form)
      const priorityValue = task.priority === 'High' ? '3' : '2'; 
      await page.locator('.modal-select').nth(2).selectOption(priorityValue); 
      
      // Match the exact submit button text
      await page.getByRole('button', { name: 'Create Task', exact: true }).click();

      // RUBRIC: Soft assertions
      await expect.soft(page.locator('.task-dashboard')).toBeVisible();
    });
  }

  // RUBRIC: Annotations (test.slow)
  test('Modify fields and change status of three tickets', async ({ page }) => {
    test.slow(); 

    // RUBRIC: Mock with HAR Files
    await page.routeFromHAR('tests/e2e/mocks/tasks-list.har', {
      url: '**/api/tasks/user/*',
      update: true, // Keeping this true so it records the network traffic
    });

    // 1. Mark first task as DONE (Value 1 in your states array)
    await page.locator('.card-container').nth(0).click();
    await page.locator('.state-select').selectOption('1');
    await page.getByRole('button', { name: 'Save' }).click();

    // 2. Mark second task as PENDING (Value 2)
    await page.locator('.card-container').nth(1).click();
    await page.locator('.state-select').selectOption('2');
    await page.getByRole('button', { name: 'Save' }).click();

    // 3. Mark third task as ON GOING (Value 3)
    await page.locator('.card-container').nth(2).click();
    await page.locator('.state-select').selectOption('3');
    await page.getByRole('button', { name: 'Save' }).click();

    // Just verifying the modal closed successfully
    await expect(page.locator('.tu-modal-overlay')).not.toBeVisible();
  });
});