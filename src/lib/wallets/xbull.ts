import { xBullWalletConnect } from "@creit.tech/xbull-wallet-connect";
import { WalletAdapter } from "./base";

export class XBullAdapter implements WalletAdapter {
  id = "xbull";
  name = "xBull";
  icon = "xbull";

  private connection: xBullWalletConnect | null = null;

  async isInstalled(): Promise<boolean> {
    return true; // Provided via browser extension or app connect
  }

  async connect(): Promise<string> {
    try {
      this.connection = new xBullWalletConnect();
      await this.connection.connect();
      return await this.connection.getPublicKey();
    } catch (e) {
      console.error("xBull connect error:", e);
      throw e;
    }
  }

  async getPublicKey(): Promise<string | null> {
    // We shouldn't automatically spin up a new connection if none exists since it pops up UI. 
    // Return null and let localStorage handle persistence across reloads.
    if (!this.connection) return null;
    return await this.connection.getPublicKey();
  }

  async signTransaction(xdr: string, networkPassphrase?: string): Promise<string> {
    try {
      if (!this.connection) {
        this.connection = new xBullWalletConnect();
        await this.connection.connect();
      }
      
      const isTestnet = networkPassphrase?.includes("Test SDF Network");
      const network = isTestnet ? "testnet" : "public";
      
      // The xbull signature accepts the xdr string
      return await this.connection.sign({
        xdr,
        network
      });
    } catch (e) {
      console.error("xBull sign error:", e);
      throw e;
    }
  }
}
