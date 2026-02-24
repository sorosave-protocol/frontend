import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Decentralized Group Savings/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Browse Groups/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Create a Group/i })).toBeVisible();
  });

  test("renders how it works section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("How It Works")).toBeVisible();
    await expect(page.getByText("Create a Group")).toBeVisible();
    await expect(page.getByText("Members Join")).toBeVisible();
    await expect(page.getByText("Contribute Each Cycle")).toBeVisible();
    await expect(page.getByText("Receive the Pot")).toBeVisible();
  });

  test("navbar shows SoroSave logo", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "SoroSave" }).first()).toBeVisible();
  });

  test("shows Connect Wallet button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: /Connect Wallet/i })).toBeVisible();
  });
});
