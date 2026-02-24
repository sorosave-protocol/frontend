import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigates to groups page from Navbar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Groups" }).first().click();
    await expect(page).toHaveURL("/groups");
    await expect(page.getByRole("heading", { name: "Savings Groups" })).toBeVisible();
  });

  test("navigates to create group page from Navbar", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Create Group" }).click();
    await expect(page).toHaveURL("/groups/new");
  });

  test("navigates to groups from hero Browse Groups button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Browse Groups" }).click();
    await expect(page).toHaveURL("/groups");
  });

  test("groups page shows group cards", async ({ page }) => {
    await page.goto("/groups");
    await expect(page.getByText("Lagos Savings Circle")).toBeVisible();
    await expect(page.getByText("DeFi Builders Fund")).toBeVisible();
  });

  test("clicking group card navigates to group detail", async ({ page }) => {
    await page.goto("/groups");
    await page.getByText("Lagos Savings Circle").click();
    await expect(page).toHaveURL(/\/groups\/\d+/);
  });

  test("group detail page shows group info", async ({ page }) => {
    await page.goto("/groups/1");
    await expect(page.getByText("Lagos Savings Circle")).toBeVisible();
    await expect(page.getByText("Progress")).toBeVisible();
  });
});
