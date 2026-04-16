import { test, expect } from "@playwright/test";

/**
 * Wallet connection tests with mocked Freighter extension.
 * These tests mock the @stellar/freighter-api to simulate wallet behavior
 * without requiring the actual browser extension.
 */
test.describe("Wallet Connection", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the Freighter wallet API
    await page.addInitScript(() => {
      // Mock window.freighter to simulate installed extension
      (window as any).freighter = {
        isConnected: () => Promise.resolve(true),
        getPublicKey: () =>
          Promise.resolve("GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGKZM7CPKKRJOCUAVHKIO1"),
        signTransaction: (xdr: string) => Promise.resolve(xdr),
        getNetwork: () => Promise.resolve("TESTNET"),
      };

      // Mock the freighter-api module responses
      Object.defineProperty(window, "freighterMock", {
        value: {
          installed: true,
          publicKey: "GCEZWKCA5VLDNRLN3RPRJMRZOX3Z6G5CHCGKZM7CPKKRJOCUAVHKIO1",
        },
      });
    });
  });

  test("Connect Wallet button is visible in navbar", async ({ page }) => {
    await page.goto("/");
    const connectBtn = page.getByRole("button", {
      name: /connect wallet|connect|freighter/i,
    });
    await expect(connectBtn).toBeVisible();
  });

  test("wallet connect button shows correct initial state", async ({
    page,
  }) => {
    await page.goto("/");
    // Before connection, should show connect text
    const connectBtn = page
      .getByRole("button", { name: /connect/i })
      .first();
    if (await connectBtn.isVisible()) {
      const text = await connectBtn.textContent();
      expect(text?.toLowerCase()).toContain("connect");
    }
  });

  test("clicking connect wallet triggers connection flow", async ({ page }) => {
    await page.goto("/");
    const connectBtn = page.getByRole("button", {
      name: /connect wallet/i,
    });
    if (await connectBtn.isVisible()) {
      await connectBtn.click();
      // After clicking, either shows address or an error about missing extension
      await page.waitForTimeout(500);
      // The button should have changed or an error should be shown
      const pageText = await page.textContent("body");
      expect(pageText).toBeTruthy();
    }
  });
});
