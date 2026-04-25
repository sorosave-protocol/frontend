"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { WALLET_ADAPTERS, WalletAdapter } from "@/lib/wallets";

const ACTIVE_WALLET_KEY = "sorosave_active_wallet";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  activeAdapterId: string | null;
  connect: (adapterId: string) => Promise<void>;
  disconnect: () => void;
  getAdapter: () => WalletAdapter | null;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  activeAdapterId: null,
  connect: async () => {},
  disconnect: () => {},
  getAdapter: () => null,
});

export function useWallet() {
  return useContext(WalletContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [activeAdapterId, setActiveAdapterId] = useState<string | null>(null);

  // Restore wallet connection
  useEffect(() => {
    const savedWallet = localStorage.getItem(ACTIVE_WALLET_KEY);
    if (savedWallet && WALLET_ADAPTERS[savedWallet]) {
      const adapter = WALLET_ADAPTERS[savedWallet];
      setActiveAdapterId(savedWallet);
      adapter.getPublicKey().then((addr) => {
        if (addr) setAddress(addr);
      });
    }
  }, []);

  const getAdapter = useCallback(() => {
    if (!activeAdapterId) return null;
    return WALLET_ADAPTERS[activeAdapterId] || null;
  }, [activeAdapterId]);

  const connect = useCallback(async (adapterId: string) => {
    const adapter = WALLET_ADAPTERS[adapterId];
    if (!adapter) throw new Error(`Wallet adapter ${adapterId} not found`);
    
    try {
      const addr = await adapter.connect();
      if (addr) {
        setAddress(addr);
        setActiveAdapterId(adapterId);
        localStorage.setItem(ACTIVE_WALLET_KEY, adapterId);
      }
    } catch (e) {
      console.error("Connection failed", e);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setActiveAdapterId(null);
    localStorage.removeItem(ACTIVE_WALLET_KEY);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        activeAdapterId,
        connect,
        disconnect,
        getAdapter,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
