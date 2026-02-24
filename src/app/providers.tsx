"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { WalletAdapter } from "@/lib/wallets";
import { FreighterAdapter } from "@/lib/wallets/freighter";
import { xBullAdapter } from "@/lib/wallets/xbull";
import { AlbedoAdapter } from "@/lib/wallets/albedo";

export const WALLETS: WalletAdapter[] = [
  new FreighterAdapter(),
  new xBullAdapter(),
  new AlbedoAdapter()
];

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  activeWallet: WalletAdapter | null;
  connect: (walletId: string) => Promise<void>;
  disconnect: () => Promise<void>;
  wallets: WalletAdapter[];
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  activeWallet: null,
  connect: async () => {},
  disconnect: async () => {},
  wallets: WALLETS,
});

export function useWallet() {
  return useContext(WalletContext);
}

// Allows wallet.ts to access the active adapter without React context
let _activeWalletAdapter: WalletAdapter | null = null;
export function getActiveWalletAdapter() { return _activeWalletAdapter; }
export function _setActiveWalletAdapter(a: WalletAdapter | null) { _activeWalletAdapter = a; }

export function Providers({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [activeWallet, setActiveWallet] = useState<WalletAdapter | null>(null);

  useEffect(() => {
    const lastWalletId = localStorage.getItem("sorosave_wallet");
    if (lastWalletId) {
      const wallet = WALLETS.find((w) => w.id === lastWalletId);
      if (wallet) {
        wallet.isInstalled().then(async (installed) => {
          if (installed) {
            const pubKey = await wallet.getPublicKey();
            if (pubKey) {
              setAddress(pubKey);
              setActiveWallet(wallet);
            }
          }
        });
      }
    }
  }, []);

  const connect = useCallback(async (walletId: string) => {
    const wallet = WALLETS.find((w) => w.id === walletId);
    if (!wallet) return;

    try {
      const addr = await wallet.connect();
      if (addr) {
        setAddress(addr);
        setActiveWallet(wallet);
        _setActiveWalletAdapter(wallet);
        localStorage.setItem("sorosave_wallet", walletId);
      }
    } catch (e) {
      console.error("Failed to connect wallet", e);
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (activeWallet) {
      await activeWallet.disconnect();
    }
    setAddress(null);
    setActiveWallet(null);
    _setActiveWalletAdapter(null);
    localStorage.removeItem("sorosave_wallet");
  }, [activeWallet]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        activeWallet,
        connect,
        disconnect,
        wallets: WALLETS,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
