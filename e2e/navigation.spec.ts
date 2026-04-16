import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigates to groups page via navbar link", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Groups" }).first().click();
    await expect(page).toHaveURL(/.*\/groups/);
  });

  test("navigates to create group page via navbar link", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Create Group" }).first().click();
    await expect(page).toHaveURL(/.*\/groups\/new/);
  });

  test("navigates to groups page from hero CTA", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Browse Groups" }).click();
    await expect(page).toHaveURL(/.*\/groups/);
  });

  test("navigates to create group from hero CTA", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Create a Group" }).click();
    await expect(page).toHaveURL(/.*\/groups\/new/);
  });

  test("SoroSave logo navigates back to home", async ({ page }) => {
    await page.goto("/groups");
    await page.getByRole("link", { name: "SoroSave" }).click();
    await expect(page).toHaveURL(/.*\/$/);
  });

  test("page title is correct on home page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/SoroSave/);
  });
});
