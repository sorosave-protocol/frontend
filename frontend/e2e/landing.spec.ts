import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should render the landing page correctly', async ({ page }) => {
    await page.goto('/');

    // Check for hero section
    await expect(page.getByRole('heading', { name: 'Decentralized Group Savings for Everyone' })).toBeVisible();
    await expect(page.getByText('SoroSave brings the traditional rotating savings model')).toBeVisible();

    // Check navigation links
    await expect(page.getByRole('link', { name: 'Browse Groups' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create Group' })).toBeVisible();

    // Check footer
    await expect(page.locator('footer')).toContainText('© 2024 SoroSave');
  });

  test('should navigate to groups page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Browse Groups' }).click();

    // Wait for navigation
    await page.waitForURL('**/groups');
    await expect(page).toHaveURL(//groups/);
    await expect(page.getByRole('heading', { name: 'Groups' })).toBeVisible();
  });

  test('should navigate to create group page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Create Group' }).click();

    // Wait for navigation
    await page.waitForURL('**/groups/new');
    await expect(page).toHaveURL(//groups\/new/);
    await expect(page.getByRole('heading', { name: 'Create New Group' })).toBeVisible();
  });
});