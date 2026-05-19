// Wallet types and interface definitions

export type WalletType = "freighter" | "xbull" | "albedo";

export interface WalletAdapter {
  type: WalletType;
  name: string;
  icon: string; // SVG or emoji identifier
  isInstalled(): Promise<boolean>;
  connect(): Promise<string | null>;
  getPublicKey(): Promise<string | null>;
  signTransaction(xdr: string, networkPassphrase: string): Promise<string>;
}

export interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  selectedWallet: WalletType | null;
  availableWallets: WalletType[];
  getWalletStatus(wallet: WalletType): "installed" | "not_installed" | "connected";
  selectWallet: (wallet: WalletType) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const WALLET_PREFERENCE_KEY = "sorosave-preferred-wallet";

export const WALLET_META: Record<WalletType, { name: string; installUrl: string; description: string }> = {
  freighter: {
    name: "Freighter",
    installUrl: "https://www.freighter.app/",
    description: "Popular Stellar wallet with browser extension",
  },
  xbull: {
    name: "xBull",
    installUrl: "https://xbull.app/",
    description: "Fast and secure Stellar wallet",
  },
  albedo: {
    name: "Albedo",
    installUrl: "https://albedo.link/",
    description: "Trusted Stellar wallet with social recovery",
  },
};