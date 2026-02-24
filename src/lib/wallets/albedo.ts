import { WalletAdapter } from './index';
import albedo from '@albedo-link/intent';

export class AlbedoAdapter implements WalletAdapter {
  id = 'albedo';
  name = 'Albedo';
  icon = 'A';
  url = 'https://albedo.link/';

  async isInstalled(): Promise<boolean> {
    return true; // Albedo is a web wallet, always "installed"
  }

  async connect(): Promise<string | null> {
    try {
      const res = await albedo.publicKey({});
      return res.pubkey;
    } catch (e) {
      return null;
    }
  }

  async disconnect(): Promise<void> {
    // Albedo is stateless, no disconnect needed
  }

  async getPublicKey(): Promise<string | null> {
    // Requires a prompt for Albedo usually
    return null;
  }
}
