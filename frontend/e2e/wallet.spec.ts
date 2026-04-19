import { test, expect } from '@playwright/test';

// Mock wallet connection for testing
test.describe('Wallet Connection', () => {
  test('should show wallet connection prompt when not connected', async ({ page }) => {
    // Mock wallet not connected state
    await page.goto('/groups/new');

    // Check for wallet connection prompt
    await expect(page.getByText('Please connect your wallet to create a group.')).toBeVisible();
  });

  test('should mock wallet connection and allow form interaction', async ({ page }) => {
    await page.goto('/groups/new');

    // Mock wallet connection by setting localStorage
    await page.evaluate(() => {
      localStorage.setItem('wallet-connected', 'true');
      localStorage.setItem('wallet-address', 'GTEST123...');
    });

    // Refresh to apply mock
    await page.reload();

    // Verify wallet is mocked as connected
    await expect(page.getByText('Please connect your wallet to create a group.')).not.toBeVisible();

    // Test form interaction
    await page.fill('input[placeholder="My Savings Circle"]', 'Test Group');
    await page.fill('input[placeholder="CDLZ..."]', 'CDLZ...');
    await page.fill('input[placeholder="Contribution Amount"]', '100');

    // Verify form values
    await expect(page.getByPlaceholder('My Savings Circle')).toHaveValue('Test Group');
    await expect(page.getByPlaceholder('CDLZ...')).toHaveValue('CDLZ...');
  });
});