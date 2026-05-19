import type { WalletAdapter } from "./wallet-types";
import { WalletType } from "./wallet-types";

declare global {
  interface Window {
    albedo?: {
      publicKey(): Promise<{ publicKey: string }>;
      sign(xdr: string, opts?: { network: string }): Promise<{ xdr: string }>;
    };
  }
}

export class AlbedoAdapter implements WalletAdapter {
  type: WalletType = "albedo";
  name = "Albedo";

  private getProvider() {
    return typeof window !== "undefined" ? window.albedo : undefined;
  }

  async isInstalled(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    // Albedo doesn't inject a global, but we can check for the popup method
    // Albedo uses a popup-based approach, always "available" but with specific error if not authorized
    return true; // Albedo is web-based, always "installed"
  }

  async connect(): Promise<string | null> {
    try {
      const provider = this.getProvider();
      if (!provider) {
        // Fallback: Open Albedo in popup
        const pubKey = await this.openAlbedoPopup();
        return pubKey;
      }
      const result = await provider.publicKey();
      return result.publicKey;
    } catch (error) {
      console.error("Albedo connection failed:", error);
      return null;
    }
  }

  private async openAlbedoPopup(): Promise<string | null> {
    return new Promise((resolve) => {
      const width = 400;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const popup = window.open(
        "https://albedo.link/request/account",
        "albedo",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === "albedo_account") {
          window.removeEventListener("message", handleMessage);
          popup?.close();
          resolve(event.data.publicKey);
        }
      };

      window.addEventListener("message", handleMessage);

      // Timeout after 60 seconds
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        popup?.close();
        resolve(null);
      }, 60000);
    });
  }

  async getPublicKey(): Promise<string | null> {
    try {
      const provider = this.getProvider();
      if (!provider) return null;
      const result = await provider.publicKey();
      return result.publicKey;
    } catch {
      return null;
    }
  }

  async signTransaction(xdr: string, networkPassphrase: string): Promise<string> {
    const provider = this.getProvider();
    if (!provider) {
      // Use popup-based signing
      return this.openAlbedoSignPopup(xdr, networkPassphrase);
    }
    const result = await provider.sign(xdr, { network: networkPassphrase });
    return result.xdr;
  }

  private async openAlbedoSignPopup(xdr: string, network: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const width = 400;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      const url = `https://albedo.link/sign?xdr=${encodeURIComponent(xdr)}&network=${encodeURIComponent(network)}`;
      const popup = window.open(url, "albedo_sign", `width=${width},height=${height},left=${left},top=${top}`);

      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === "albedo_signed") {
          window.removeEventListener("message", handleMessage);
          popup?.close();
          resolve(event.data.signedXdr);
        } else if (event.data?.type === "albedo_error") {
          window.removeEventListener("message", handleMessage);
          popup?.close();
          reject(new Error(event.data.message));
        }
      };

      window.addEventListener("message", handleMessage);

      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        popup?.close();
        reject(new Error("Albedo signing timed out"));
      }, 60000);
    });
  }
}

export const albedoAdapter = new AlbedoAdapter();