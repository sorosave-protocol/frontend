import {
  SignOptions,
  WalletAdapter,
  WalletConnectionError,
  WalletNotInstalledError,
} from "./types";

interface XBullSDK {
  connect(permissions: {
    canRequestPublicKey: boolean;
    canRequestSign: boolean;
  }): Promise<boolean>;
  getPublicKey(): Promise<string>;
  signXDR(
    xdr: string,
    options?: { publicKey?: string; network?: string },
  ): Promise<string>;
  closeConnections?(): Promise<void>;
}

declare global {
  interface Window {
    xBullSDK?: XBullSDK;
  }
}

function sdk(): XBullSDK | null {
  if (typeof window === "undefined") return null;
  return window.xBullSDK ?? null;
}

export const xbullAdapter: WalletAdapter = {
  id: "xbull",
  name: "xBull",
  iconUrl: "https://xbull.app/favicon.ico",
  installUrl: "https://xbull.app/",

  async isAvailable() {
    return sdk() !== null;
  },

  async connect() {
    const x = sdk();
    if (!x) throw new WalletNotInstalledError(this.id, this.installUrl);
    try {
      const ok = await x.connect({
        canRequestPublicKey: true,
        canRequestSign: true,
      });
      if (!ok) {
        throw new WalletConnectionError(this.id, "User denied xBull permissions");
      }
      return await x.getPublicKey();
    } catch (err) {
      if (err instanceof WalletConnectionError) throw err;
      throw new WalletConnectionError(
        this.id,
        err instanceof Error ? err.message : "Failed to connect to xBull",
      );
    }
  },

  async getPublicKey() {
    const x = sdk();
    if (!x) return null;
    try {
      return await x.getPublicKey();
    } catch {
      return null;
    }
  },

  async signTransaction(xdr: string, { networkPassphrase }: SignOptions) {
    const x = sdk();
    if (!x) throw new WalletNotInstalledError(this.id, this.installUrl);
    return x.signXDR(xdr, { network: networkPassphrase });
  },
};
