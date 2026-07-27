// src/lib/wallets/index.ts
// Registry of wallet adapters (acceptance: adapters for Freighter, xBull, Albedo).
import type { WalletAdapter } from "./types";
import { freighterAdapter } from "./freighter";
import { xbullAdapter } from "./xbull";
import { albedoAdapter } from "./albedo";

export const WALLETS: WalletAdapter[] = [freighterAdapter, xbullAdapter, albedoAdapter];

export const STORAGE_KEY = "sorosave.lastWallet";

export function getAdapter(id: string): WalletAdapter | undefined {
  return WALLETS.find((w) => w.id === id);
}

export type { WalletAdapter } from "./types";
