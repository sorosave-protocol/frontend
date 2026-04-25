import albedo from "@albedo-link/intent";
import { WalletAdapter } from "./base";

export class AlbedoAdapter implements WalletAdapter {
  id = "albedo";
  name = "Albedo";
  icon = "albedo"; // Placeholder for icon

  async isInstalled(): Promise<boolean> {
    return true; // Albedo is web-based and always available
  }

  async connect(): Promise<string> {
    try {
      const response = await albedo.publicKey({});
      return response.pubkey;
    } catch (e) {
      console.error("Albedo connect error:", e);
      throw e;
    }
  }

  async getPublicKey(): Promise<string | null> {
    // Albedo connects on a per request basis; usually persistence isn't automatic
    // Thus we handle persistence in our state or localStorage.
    return null;
  }

  async signTransaction(xdr: string, networkPassphrase?: string): Promise<string> {
    try {
      const isTestnet = networkPassphrase?.includes("Test SDF Network");
      const network = isTestnet ? "testnet" : "public";
      
      const response = await albedo.tx({
        xdr,
        network,
      });
      return response.signed_envelope_xdr;
    } catch (e) {
      console.error("Albedo sign error:", e);
      throw e;
    }
  }
}
