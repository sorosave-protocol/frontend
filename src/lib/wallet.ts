import type { WalletAdapter, WalletType } from "./wallet-types";
import { freighterAdapter } from "./adapters/freighter";
import { xbullAdapter } from "./adapters/xbull";
import { albedoAdapter } from "./adapters/albedo";

export * from "./wallet-types";
export * from "./adapters/freighter";
export * from "./adapters/xbull";
export * from "./adapters/albedo";

export const WALLET_ADAPTERS: Record<WalletType, WalletAdapter> = {
  freighter: freighterAdapter,
  xbull: xbullAdapter,
  albedo: albedoAdapter,
};

export const SUPPORTED_WALLETS: WalletType[] = ["freighter", "xbull", "albedo"];

export function getWalletAdapter(type: WalletType): WalletAdapter {
  return WALLET_ADAPTERS[type];
}

export async function isWalletInstalled(type: WalletType): Promise<boolean> {
  const adapter = WALLET_ADAPTERS[type];
  return adapter.isInstalled();
}

export async function connectWallet(type: WalletType): Promise<string | null> {
  const adapter = WALLET_ADAPTERS[type];
  return adapter.connect();
}

export async function getPublicKey(type: WalletType): Promise<string | null> {
  const adapter = WALLET_ADAPTERS[type];
  return adapter.getPublicKey();
}

export async function signTransaction(
  type: WalletType,
  xdr: string,
  networkPassphrase: string
): Promise<string> {
  const adapter = WALLET_ADAPTERS[type];
  return adapter.signTransaction(xdr, networkPassphrase);
}

// Legacy exports for backward compatibility
export { isFreighterInstalled } from "./adapters/freighter";
export { connectWallet as connectFreighter, getPublicKey as getFreighterPublicKey, signTransaction as signFreighterTransaction } from "./adapters/freighter";