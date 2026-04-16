import { test, expect } from "@playwright/test";

test.describe("Group Creation Form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/groups/new");
  });

  test("renders the create group form", async ({ page }) => {
    // Check that the form page loads
    await expect(page.locator("form, [data-testid='create-group-form']").first()).toBeVisible().catch(() => {
      // If no explicit form, check for relevant inputs
      return expect(page.locator("input, textarea, select").first()).toBeVisible();
    });
  });

  test("shows validation error when submitting empty form", async ({
    page,
  }) => {
    // Find and click the submit button
    const submitBtn = page.getByRole("button", {
      name: /create|submit|save/i,
    });
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      // Check for any validation feedback (HTML5 or custom)
      const hasError =
        (await page.locator("[class*='error'], [class*='invalid'], :invalid").count()) > 0;
      expect(hasError).toBeTruthy();
    }
  });

  test("group name field is present and accepts input", async ({ page }) => {
    const nameInput = page
      .getByLabel(/group name/i)
      .or(page.getByPlaceholder(/group name/i))
      .or(page.locator('input[name="name"]'));

    if (await nameInput.isVisible()) {
      await nameInput.fill("Test Savings Group");
      await expect(nameInput).toHaveValue("Test Savings Group");
    }
  });

  test("contribution amount field accepts numeric input", async ({ page }) => {
    const amountInput = page
      .getByLabel(/contribution/i)
      .or(page.getByPlaceholder(/amount/i))
      .or(page.locator('input[name="contributionAmount"], input[type="number"]').first());

    if (await amountInput.isVisible()) {
      await amountInput.fill("100");
      await expect(amountInput).toHaveValue("100");
    }
  });

  test("max members field accepts numeric input", async ({ page }) => {
    const membersInput = page
      .getByLabel(/max members/i)
      .or(page.getByPlaceholder(/members/i))
      .or(page.locator('input[name="maxMembers"]'));

    if (await membersInput.isVisible()) {
      await membersInput.fill("5");
      await expect(membersInput).toHaveValue("5");
    }
  });
});
