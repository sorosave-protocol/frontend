import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Mock wallet connection in localStorage
  await page.addInitScript(() => {
    localStorage.setItem('wallet-connected', 'true');
    localStorage.setItem('wallet-address', 'GTEST123...');
  });

  await browser.close();
}

export default globalSetup;