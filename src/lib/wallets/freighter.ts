import { WalletAdapter } from './index';
import {
  isConnected,
  isAllowed,
  requestAccess,
  getPublicKey,
} from '@stellar/freighter-api';

export class FreighterAdapter implements WalletAdapter {
  id = 'freighter';
  name = 'Freighter';
  icon = '🚢';
  url = 'https://www.freighter.app/';

  async isInstalled(): Promise<boolean> {
    return await isConnected();
  }

  async connect(): Promise<string | null> {
    if (await isAllowed()) {
      return await getPublicKey();
    }
    const access = await requestAccess();
    if (access) {
      return await getPublicKey();
    }
    return null;
  }

  async disconnect(): Promise<void> {
    // Freighter doesn't support explicit disconnect via API
  }

  async getPublicKey(): Promise<string | null> {
    if (await isAllowed()) {
      return await getPublicKey();
    }
    return null;
  }
}
