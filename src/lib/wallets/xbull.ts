import { WalletAdapter } from './index';

export class xBullAdapter implements WalletAdapter {
  id = 'xbull';
  name = 'xBull';
  icon = '🐂';
  url = 'https://xbull.app/';

  async isInstalled(): Promise<boolean> {
    return typeof window !== 'undefined' && 'xBullSDK' in window;
  }

  async connect(): Promise<string | null> {
    if (!(await this.isInstalled())) return null;
    try {
      return await (window as any).xBullSDK.connect();
    } catch (e) {
      return null;
    }
  }

  async disconnect(): Promise<void> {
    if (await this.isInstalled()) {
      try {
        await (window as any).xBullSDK.disconnect();
      } catch (e) {}
    }
  }

  async getPublicKey(): Promise<string | null> {
    if (!(await this.isInstalled())) return null;
    try {
      return await (window as any).xBullSDK.getPublicKey();
    } catch (e) {
      return null;
    }
  }
}
