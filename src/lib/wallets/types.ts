export type WalletId = "freighter" | "xbull" | "albedo";

export interface SignOptions {
  networkPassphrase: string;
}

export interface WalletAdapter {
  readonly id: WalletId;
  readonly name: string;
  readonly iconUrl: string;
  readonly installUrl: string;

  isAvailable(): Promise<boolean>;
  connect(): Promise<string>;
  getPublicKey(): Promise<string | null>;
  signTransaction(xdr: string, options: SignOptions): Promise<string>;
}

export class WalletNotInstalledError extends Error {
  constructor(public readonly walletId: WalletId, public readonly installUrl: string) {
    super(`${walletId} wallet is not installed`);
    this.name = "WalletNotInstalledError";
  }
}

export class WalletConnectionError extends Error {
  constructor(public readonly walletId: WalletId, message: string) {
    super(message);
    this.name = "WalletConnectionError";
  }
}
