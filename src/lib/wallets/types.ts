// src/lib/wallets/types.ts
// Shared wallet adapter interface (acceptance: "Create wallet adapter interface").

export interface WalletAdapter {
  /** Stable id, also used as the localStorage memory key. */
  id: "freighter" | "xbull" | "albedo";
  /** Human-friendly name shown in the selection modal. */
  name: string;
  /** Whether the wallet extension/app is installed and injects its API. */
  isAvailable(): Promise<boolean>;
  /** Prompt the user to connect and return the public key (null on cancel/error). */
  connect(): Promise<string | null>;
  /** Return the current public key without re-prompting (null if not connected). */
  getPublicKey(): Promise<string | null>;
  /** Sign an XDR transaction for submission. */
  signTransaction(xdr: string, networkPassphrase: string): Promise<string>;
}
