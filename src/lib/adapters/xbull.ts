import type { WalletAdapter } from "./wallet-types";
import { WalletType } from "./wallet-types";

declare global {
  interface Window {
    xBull?: {
      connect(): Promise<string>;
      getAccount(): Promise<{ publicKey: string }>;
      sign(xdr: string): Promise<string>;
    };
  }
}

export class XBullAdapter implements WalletAdapter {
  type: WalletType = "xbull";
  name = "xBull";

  private getProvider() {
    return typeof window !== "undefined" ? window.xBull : undefined;
  }

  async isInstalled(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    const provider = this.getProvider();
    return !!provider;
  }

  async connect(): Promise<string | null> {
    try {
      const provider = this.getProvider();
      if (!provider) return null;
      const address = await provider.connect();
      return address;
    } catch (error) {
      console.error("xBull connection failed:", error);
      return null;
    }
  }

  async getPublicKey(): Promise<string | null> {
    try {
      const provider = this.getProvider();
      if (!provider) return null;
      const account = await provider.getAccount();
      return account.publicKey;
    } catch {
      return null;
    }
  }

  async signTransaction(xdr: string, _networkPassphrase: string): Promise<string> {
    const provider = this.getProvider();
    if (!provider) throw new Error("xBull not installed");
    return await provider.sign(xdr);
  }
}

export const xbullAdapter = new XBullAdapter();