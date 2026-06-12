# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Authentication Flow >> Should fail when API is down
- Location: tests/e2e/auth.spec.ts:34:8

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.task-dashboard-container')
Expected: visible
Timeout: 2000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 2000ms
  - waiting for locator('.task-dashboard-container')

```

```yaml
- banner:
  - heading "OCTO Task" [level=1]
  - button "Create Account"
- main:
  - img "OctoTask"
  - heading "OCTO" [level=2]
  - heading "Task" [level=2]
  - paragraph: More arms for your tasks
  - text: "Username or Email:"
  - textbox "Username...": Diego
  - text: "Password:"
  - textbox "Password...": hola
  - button "Sign In"
  - text: Register
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { USERS } from './utils/test-data';
  3  | 
  4  | test.describe('Authentication Flow', () => {
  5  | 
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto('/'); // Changed from /login
  8  |   });
  9  | 
  10 |   test('Sign in with incorrect, then correct credentials', async ({ page }) => {
  11 |     // 1. Incorrect Login
  12 |     await page.fill('#username', USERS.invalid.email);
  13 |     await page.fill('#password', USERS.invalid.password);
  14 | 
  15 |     page.once('dialog', dialog => {
  16 |       expect(dialog.message()).toMatch(/Login failed|An error occurred/);
  17 |       dialog.dismiss();
  18 |     });
  19 | 
  20 |     await page.click('button[type="submit"]');
  21 | 
  22 |     // Verify we did not render the dashboard
  23 |     await expect(page.locator('.loginContainer')).toBeVisible(); 
  24 | 
  25 |     // 2. Correct Login
  26 |     await page.fill('#username', USERS.developer.email);
  27 |     await page.fill('#password', USERS.developer.password);
  28 |     await page.click('button[type="submit"]');
  29 | 
  30 |     // Wait for the dashboard to render instead of the URL
  31 |     await expect(page.locator('.task-dashboard-container')).toBeVisible({ timeout: 10000 });
  32 |   });
  33 | 
  34 |   test.fail('Should fail when API is down', async ({ page }) => {
  35 |     await page.route('**/api/users/Login*', route => {
  36 |       route.fulfill({
  37 |         status: 500,
  38 |         contentType: 'application/json',
  39 |         body: JSON.stringify({ message: 'Internal Server Error' }),
  40 |       });
  41 |     });
  42 | 
  43 |     await page.fill('#username', USERS.developer.email);
  44 |     await page.fill('#password', USERS.developer.password);
  45 |     
  46 |     page.once('dialog', dialog => dialog.dismiss());
  47 |     
  48 |     await page.click('button[type="submit"]');
  49 |     
  50 |     // We expect this to fail because the dashboard container will never appear
> 51 |     await expect(page.locator('.task-dashboard-container')).toBeVisible({ timeout: 2000 });
     |                                                             ^ Error: expect(locator).toBeVisible() failed
  52 |   });
  53 | });
```