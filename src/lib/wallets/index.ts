import { WalletAdapter } from "./base";
import { FreighterAdapter } from "./freighter";
import { XBullAdapter } from "./xbull";
import { AlbedoAdapter } from "./albedo";

export * from "./base";
export * from "./freighter";
export * from "./xbull";
export * from "./albedo";

export const WALLET_ADAPTERS: Record<string, WalletAdapter> = {
  freighter: new FreighterAdapter(),
  xbull: new XBullAdapter(),
  albedo: new AlbedoAdapter(),
};
