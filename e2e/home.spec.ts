import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("renders the hero section with correct heading", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", {
        name: "Decentralized Group Savings for Everyone",
      })
    ).toBeVisible();
  });

  test("displays the SoroSave brand name in the navbar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "SoroSave" })).toBeVisible();
  });

  test("shows Browse Groups and Create a Group CTA buttons", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Browse Groups" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Create a Group" })
    ).toBeVisible();
  });

  test("displays the How It Works section with 4 steps", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "How It Works" })
    ).toBeVisible();
    await expect(page.getByText("Create a Group")).toBeVisible();
    await expect(page.getByText("Members Join")).toBeVisible();
    await expect(page.getByText("Contribute Each Cycle")).toBeVisible();
    await expect(page.getByText("Receive the Pot")).toBeVisible();
  });

  test("displays the Why SoroSave section", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Why SoroSave?" })
    ).toBeVisible();
    await expect(page.getByText("Trustless")).toBeVisible();
    await expect(page.getByText("Transparent")).toBeVisible();
    await expect(page.getByText("Low Cost")).toBeVisible();
  });

  test("footer has GitHub link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "GitHub" })).toBeVisible();
  });
});
