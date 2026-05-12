import {
  SignOptions,
  WalletAdapter,
  WalletConnectionError,
} from "./types";

interface AlbedoIntent {
  publicKey(params?: { token?: string }): Promise<{ pubkey: string }>;
  tx(params: {
    xdr: string;
    network?: string;
    network_passphrase?: string;
    pubkey?: string;
  }): Promise<{ signed_envelope_xdr: string }>;
}

let albedoModule: AlbedoIntent | null = null;

async function loadAlbedo(): Promise<AlbedoIntent> {
  if (albedoModule) return albedoModule;
  const mod = (await import("@albedo-link/intent")) as unknown as {
    default?: AlbedoIntent;
  } & AlbedoIntent;
  albedoModule = mod.default ?? mod;
  return albedoModule;
}

export const albedoAdapter: WalletAdapter = {
  id: "albedo",
  name: "Albedo",
  iconUrl: "https://albedo.link/img/logo-square.svg",
  installUrl: "https://albedo.link/",

  async isAvailable() {
    if (typeof window === "undefined") return false;
    return true;
  },

  async connect() {
    try {
      const albedo = await loadAlbedo();
      const { pubkey } = await albedo.publicKey();
      return pubkey;
    } catch (err) {
      throw new WalletConnectionError(
        this.id,
        err instanceof Error ? err.message : "Albedo request was rejected",
      );
    }
  },

  async getPublicKey() {
    return null;
  },

  async signTransaction(xdr: string, { networkPassphrase }: SignOptions) {
    const albedo = await loadAlbedo();
    const result = await albedo.tx({
      xdr,
      network_passphrase: networkPassphrase,
    });
    return result.signed_envelope_xdr;
  },
};
