// src/lib/wallets/freighter.ts
// Freighter adapter — uses the already-installed @stellar/freighter-api package.
import freighter from "@stellar/freighter-api";
import type { WalletAdapter } from "./types";

export const freighterAdapter: WalletAdapter = {
  id: "freighter",
  name: "Freighter",
  async isAvailable() {
    try {
      return await freighter.isConnected();
    } catch {
      return false;
    }
  },
  async connect() {
    try {
      return await freighter.requestAccess();
    } catch (error) {
      console.error("Freighter connect failed:", error);
      return null;
    }
  },
  async getPublicKey() {
    try {
      return await freighter.getPublicKey();
    } catch {
      return null;
    }
  },
  async signTransaction(xdr: string, networkPassphrase: string) {
    return freighter.signTransaction(xdr, { networkPassphrase });
  },
};
