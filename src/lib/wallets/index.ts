import { albedoAdapter } from "./albedo";
import { freighterAdapter } from "./freighter";
import { WalletAdapter, WalletId } from "./types";
import { xbullAdapter } from "./xbull";

export const walletAdapters: Record<WalletId, WalletAdapter> = {
  freighter: freighterAdapter,
  xbull: xbullAdapter,
  albedo: albedoAdapter,
};

export const walletList: WalletAdapter[] = [
  freighterAdapter,
  xbullAdapter,
  albedoAdapter,
];

export function getAdapter(id: WalletId): WalletAdapter {
  return walletAdapters[id];
}

const STORAGE_KEY = "sorosave:lastWallet";

export function loadLastWalletId(): WalletId | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value && value in walletAdapters) return value as WalletId;
  return null;
}

export function saveLastWalletId(id: WalletId): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, id);
}

export function clearLastWalletId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export type { WalletAdapter, WalletId, SignOptions } from "./types";
export { WalletNotInstalledError, WalletConnectionError } from "./types";
