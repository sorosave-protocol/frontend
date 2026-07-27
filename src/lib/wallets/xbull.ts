// src/lib/wallets/xbull.ts
// xBull adapter — xBull injects a global `window.xbull` API (no extra npm dep needed).
import type { WalletAdapter } from "./types";

declare global {
  interface Window {
    xbull?: {
      isConnected: () => Promise<boolean>;
      requestAccess: () => Promise<string>;
      getPublicKey: () => Promise<string | null>;
      signTransaction: (
        xdr: string,
        opts: { networkPassphrase?: string; address?: string }
      ) => Promise<string>;
    };
  }
}

function xbull() {
  return typeof window !== "undefined" ? window.xbull : undefined;
}

export const xbullAdapter: WalletAdapter = {
  id: "xbull",
  name: "xBull",
  async isAvailable() {
    const api = xbull();
    if (!api) return false;
    try {
      return await api.isConnected();
    } catch {
      return false;
    }
  },
  async connect() {
    const api = xbull();
    if (!api) return null;
    try {
      return await api.requestAccess();
    } catch (error) {
      console.error("xBull connect failed:", error);
      return null;
    }
  },
  async getPublicKey() {
    const api = xbull();
    if (!api) return null;
    try {
      return await api.getPublicKey();
    } catch {
      return null;
    }
  },
  async signTransaction(xdr: string, networkPassphrase: string) {
    const api = xbull();
    if (!api) throw new Error("xBull is not installed");
    return api.signTransaction(xdr, { networkPassphrase });
  },
};
