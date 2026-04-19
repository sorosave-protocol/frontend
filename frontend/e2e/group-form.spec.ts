import { test, expect } from '@playwright/test';

test.describe('Group Creation Form', () => {
  test.beforeEach(async ({ page }) => {
    // Mock wallet connection before each test
    await page.evaluate(() => {
      localStorage.setItem('wallet-connected', 'true');
      localStorage.setItem('wallet-address', 'GTEST123...');
    });
    await page.goto('/groups/new');
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.getByText('Group Name is required')).toBeVisible();
    await expect(page.getByText('Token Contract Address is required')).toBeVisible();
    await expect(page.getByText('Contribution Amount is required')).toBeVisible();
  });

  test('should validate contribution amount format', async ({ page }) => {
    await page.fill('input[placeholder="My Savings Circle"]', 'Test Group');
    await page.fill('input[placeholder="CDLZ..."]', 'CDLZ...');
    await page.fill('input[placeholder="Contribution Amount"]', 'invalid');
    await page.fill('input[placeholder="86400"]', '86400');
    await page.fill('input[placeholder="5"]', '5');

    await page.click('button[type="submit"]');

    await expect(page.getByText('Contribution Amount must be a valid number')).toBeVisible();
  });

  test('should validate cycle length is a positive number', async ({ page }) => {
    await page.fill('input[placeholder="My Savings Circle"]', 'Test Group');
    await page.fill('input[placeholder="CDLZ..."]', 'CDLZ...');
    await page.fill('input[placeholder="Contribution Amount"]', '100');
    await page.fill('input[placeholder="86400"]', '-1');
    await page.fill('input[placeholder="5"]', '5');

    await page.click('button[type="submit"]');

    await expect(page.getByText('Cycle Length must be a positive number')).toBeVisible();
  });

  test('should validate max members is a positive number', async ({ page }) => {
    await page.fill('input[placeholder="My Savings Circle"]', 'Test Group');
    await page.fill('input[placeholder="CDLZ..."]', 'CDLZ...');
    await page.fill('input[placeholder="Contribution Amount"]', '100');
    await page.fill('input[placeholder="86400"]', '86400');
    await page.fill('input[placeholder="5"]', '0');

    await page.click('button[type="submit"]');

    await expect(page.getByText('Max Members must be a positive number')).toBeVisible();
  });

  test('should allow valid form submission', async ({ page }) => {
    // Mock the wallet signing functionality
    await page.route('**/api/wallet/sign', route => route.fulfill({
      status: 200,
      body: JSON.stringify({ signedXdr: 'mock-signed-xdr' })
    }));

    await page.fill('input[placeholder="My Savings Circle"]', 'Test Group');
    await page.fill('input[placeholder="CDLZ..."]', 'CDLZ...');
    await page.fill('input[placeholder="Contribution Amount"]', '100');
    await page.fill('input[placeholder="86400"]', '86400');
    await page.fill('input[placeholder="5"]', '5');

    // Mock the group creation API call
    await page.route('**/api/groups', route => route.fulfill({
      status: 200,
      body: JSON.stringify({ success: true })
    }));

    await page.click('button[type="submit"]');

    // Verify success message or redirect
    await expect(page.getByText('Group created successfully!')).toBeVisible();
  });
});