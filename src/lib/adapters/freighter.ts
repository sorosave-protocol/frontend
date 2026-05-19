import { freighter } from "@stellar/freighter-api";
import type { WalletAdapter } from "./wallet-types";
import { WalletType } from "./wallet-types";

export class FreighterAdapter implements WalletAdapter {
  type: WalletType = "freighter";
  name = "Freighter";

  async isInstalled(): Promise<boolean> {
    try {
      return await freighter.isConnected();
    } catch {
      return false;
    }
  }

  async connect(): Promise<string | null> {
    try {
      const address = await freighter.requestAccess();
      return address;
    } catch (error) {
      console.error("Freighter connection failed:", error);
      return null;
    }
  }

  async getPublicKey(): Promise<string | null> {
    try {
      return await freighter.getPublicKey();
    } catch {
      return null;
    }
  }

  async signTransaction(xdr: string, networkPassphrase: string): Promise<string> {
    return await freighter.signTransaction(xdr, {
      networkPassphrase,
    });
  }
}

export const freighterAdapter = new FreighterAdapter();