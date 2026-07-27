// src/lib/wallets/albedo.ts
// Albedo adapter — Albedo injects a global `window.albedo` API (no extra npm dep needed).
import type { WalletAdapter } from "./types";

declare global {
  interface Window {
    albedo?: {
      connect: (opts?: { canRequestPublicKey?: boolean }) => Promise<{ pubkey: string }>;
      getPublicKey: () => Promise<{ pubkey: string } | null>;
      signTransaction: (opts: {
        xdr: string;
        networkPassphrase?: string;
      }) => Promise<{ signedXdr: string }>;
      isAllowed: () => Promise<boolean>;
    };
  }
}

function albedo() {
  return typeof window !== "undefined" ? window.albedo : undefined;
}

export const albedoAdapter: WalletAdapter = {
  id: "albedo",
  name: "Albedo",
  async isAvailable() {
    const api = albedo();
    if (!api) return false;
    try {
      return await api.isAllowed();
    } catch {
      return false;
    }
  },
  async connect() {
    const api = albedo();
    if (!api) return null;
    try {
      const res = await api.connect({ canRequestPublicKey: true });
      return res.pubkey ?? null;
    } catch (error) {
      console.error("Albedo connect failed:", error);
      return null;
    }
  },
  async getPublicKey() {
    const api = albedo();
    if (!api) return null;
    try {
      const res = await api.getPublicKey();
      return res?.pubkey ?? null;
    } catch {
      return null;
    }
  },
  async signTransaction(xdr: string, networkPassphrase: string) {
    const api = albedo();
    if (!api) throw new Error("Albedo is not installed");
    const res = await api.signTransaction({ xdr, networkPassphrase });
    return res.signedXdr;
  },
};
