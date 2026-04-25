import freighter from "@stellar/freighter-api";
import { WalletAdapter } from "./base";

export class FreighterAdapter implements WalletAdapter {
  id = "freighter";
  name = "Freighter";
  icon = "freighter"; // Can be replaced with actual SVG/Image component if needed

  async isInstalled(): Promise<boolean> {
    try {
      return await freighter.isConnected();
    } catch {
      return false;
    }
  }

  async connect(): Promise<string> {
    const address = await freighter.requestAccess();
    return address;
  }

  async getPublicKey(): Promise<string | null> {
    try {
      return await freighter.getPublicKey();
    } catch {
      return null;
    }
  }

  async signTransaction(xdr: string, networkPassphrase?: string): Promise<string> {
    return await freighter.signTransaction(xdr, {
      networkPassphrase: networkPassphrase || "Test SDF Network ; September 2015",
    });
  }
}
