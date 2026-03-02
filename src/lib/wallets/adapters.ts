/**
 * Multi-Wallet Support
 * Interface and adapters for Freighter, xBull, and Albedo
 * Issue: #66
 */

export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  installed: boolean;
}

export interface WalletAccount {
  publicKey: string;
  address: string;
}

export interface WalletAdapter {
  getWalletInfo(): WalletInfo;
  isInstalled(): Promise<boolean>;
  connect(): Promise<WalletAccount>;
  getPublicKey(): Promise<string>;
  signTransaction(txXdr: string, networkPassphrase: string): Promise<string>;
  signMessage(message: string): Promise<string>;
  disconnect(): void;
  onAccountChange(callback: (account: WalletAccount) => void): void;
}

// Base adapter with common functionality
abstract class BaseWalletAdapter implements WalletAdapter {
  abstract getWalletInfo(): WalletInfo;
  
  async isInstalled(): Promise<boolean> {
    return true;
  }

  abstract connect(): Promise<WalletAccount>;
  abstract getPublicKey(): Promise<string>;
  abstract signTransaction(txXdr: string, networkPassphrase: string): Promise<string>;
  abstract signMessage(message: string): Promise<string>;
  
  disconnect(): void {
    localStorage.removeItem('sorosave_wallet');
  }

  onAccountChange(_callback: (account: WalletAccount) => void): void {
    // Override in subclasses if supported
  }

  protected async getWindow(): Promise<Window | null> {
    return typeof window !== 'undefined' ? window : null;
  }
}

// Freighter Wallet Adapter
export class FreighterAdapter extends BaseWalletAdapter {
  getWalletInfo(): WalletInfo {
    return {
      id: 'freighter',
      name: 'Freighter',
      icon: 'https://www.freighter.app/icon.png',
      installed: true, // Will be checked dynamically
    };
  }

  async isInstalled(): Promise<boolean> {
    try {
      const win = await this.getWindow();
      return !!(win as any)?.freighter?.isConnected;
    } catch {
      return false;
    }
  }

  async connect(): Promise<WalletAccount> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    
    const freighter = (win as any).freighter;
    const result = await freighter.connect();
    
    const account: WalletAccount = {
      publicKey: result.publicKey,
      address: result.publicKey,
    };
    
    localStorage.setItem('sorosave_wallet', 'freighter');
    return account;
  }

  async getPublicKey(): Promise<string> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    
    const freighter = (win as any).freighter;
    return await freighter.getPublicKey();
  }

  async signTransaction(txXdr: string, networkPassphrase: string): Promise<string> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    
    const freighter = (win as any).freighter;
    return await freighter.signTransaction(txXdr, { networkPassphrase });
  }

  async signMessage(message: string): Promise<string> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    
    const freighter = (win as any).freighter;
    return await freighter.signMessage(message);
  }
}

// xBull Wallet Adapter
export class xBullAdapter extends BaseWalletAdapter {
  getWalletInfo(): WalletInfo {
    return {
      id: 'xbull',
      name: 'xBull',
      icon: '/wallets/xbull.png',
      installed: false,
    };
  }

  async isInstalled(): Promise<boolean> {
    const win = await this.getWindow();
    return !!(win as any)?.xbull?.isConnected;
  }

  async connect(): Promise<WalletAccount> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    
    const xbull = (win as any).xbull;
    await xbull.connect();
    const publicKey = await xbull.getPublicKey();
    
    const account: WalletAccount = {
      publicKey,
      address: publicKey,
    };
    
    localStorage.setItem('sorosave_wallet', 'xbull');
    return account;
  }

  async getPublicKey(): Promise<string> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    return await (win as any).xbull.getPublicKey();
  }

  async signTransaction(txXdr: string, networkPassphrase: string): Promise<string> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    return await (win as any).xbull.signTx(txXdr, { network: networkPassphrase });
  }

  async signMessage(message: string): Promise<string> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    return await (win as any).xbull.signMessage(message);
  }
}

// Albedo Wallet Adapter
export class AlbedoAdapter extends BaseWalletAdapter {
  getWalletInfo(): WalletInfo {
    return {
      id: 'albedo',
      name: 'Albedo',
      icon: '/wallets/albedo.png',
      installed: false,
    };
  }

  async isInstalled(): Promise<boolean> {
    return true; // Albedo is web-based
  }

  async connect(): Promise<WalletAccount> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    
    const albedo = (win as any).albedo;
    const result = await albedo.connect();
    
    const account: WalletAccount = {
      publicKey: result.publicKey,
      address: result.publicKey,
    };
    
    localStorage.setItem('sorosave_wallet', 'albedo');
    return account;
  }

  async getPublicKey(): Promise<string> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    return await (win as any).albedo.getPublicKey();
  }

  async signTransaction(txXdr: string, networkPassphrase: string): Promise<string> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    return await (win as any).albedo.signTransaction(txXdr, { network: networkPassphrase });
  }

  async signMessage(message: string): Promise<string> {
    const win = await this.getWindow();
    if (!win) throw new Error('No window');
    return await (win as any).albedo.signMessage(message);
  }
}

// Factory function to get available wallets
export function getAvailableWallets(): WalletAdapter[] {
  return [
    new FreighterAdapter(),
    new xBullAdapter(),
    new AlbedoAdapter(),
  ];
}

// Get last used wallet
export function getLastUsedWallet(): string | null {
  return localStorage.getItem('sorosave_wallet');
}

// Create wallet adapter from ID
export function createWalletAdapter(walletId: string): WalletAdapter | null {
  const adapters: Record<string, () => WalletAdapter> = {
    freighter: () => new FreighterAdapter(),
    xbull: () => new xBullAdapter(),
    albedo: () => new AlbedoAdapter(),
  };
  
  const create = adapters[walletId];
  return create ? create() : null;
}
