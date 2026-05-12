import freighter from "@stellar/freighter-api";
import {
  SignOptions,
  WalletAdapter,
  WalletConnectionError,
  WalletNotInstalledError,
} from "./types";

export const freighterAdapter: WalletAdapter = {
  id: "freighter",
  name: "Freighter",
  iconUrl: "https://www.freighter.app/favicon.ico",
  installUrl: "https://www.freighter.app/",

  async isAvailable() {
    try {
      return await freighter.isConnected();
    } catch {
      return false;
    }
  },

  async connect() {
    if (!(await this.isAvailable())) {
      throw new WalletNotInstalledError(this.id, this.installUrl);
    }
    try {
      return await freighter.requestAccess();
    } catch (err) {
      throw new WalletConnectionError(
        this.id,
        err instanceof Error ? err.message : "Freighter rejected the request",
      );
    }
  },

  async getPublicKey() {
    try {
      const key = await freighter.getPublicKey();
      return key || null;
    } catch {
      return null;
    }
  },

  async signTransaction(xdr: string, { networkPassphrase }: SignOptions) {
    return freighter.signTransaction(xdr, { networkPassphrase });
  },
};
