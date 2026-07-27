"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { WALLETS, getAdapter, STORAGE_KEY } from "@/lib/wallets";
import type { WalletAdapter } from "@/lib/wallets";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isAnyAvailable: boolean;
  selectedWallet: WalletAdapter | null;
  availableWallets: WalletAdapter[];
  selectWallet: (id: string) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isAnyAvailable: false,
  selectedWallet: null,
  availableWallets: [],
  selectWallet: () => {},
  connect: async () => {},
  disconnect: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletAdapter[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletAdapter | null>(null);

  // Detect which wallets are installed and restore the last-used choice.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const available = [];
      for (const w of WALLETS) {
        if (await w.isAvailable()) available.push(w);
      }
      if (cancelled) return;
      setAvailableWallets(available);

      const lastId = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      const restored = lastId ? getAdapter(lastId) : undefined;
      if (restored) {
        setSelectedWallet(restored);
        const key = await restored.getPublicKey();
        if (key) setAddress(key);
      } else if (available.length > 0) {
        setSelectedWallet(available[0]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectWallet = useCallback((id: string) => {
    const adapter = getAdapter(id);
    if (adapter) setSelectedWallet(adapter);
  }, []);

  const connect = useCallback(async () => {
    // Prefer the selected wallet; fall back to the first available one.
    const adapter = selectedWallet ?? availableWallets[0];
    if (!adapter) return;
    const addr = await adapter.connect();
    if (addr) {
      setAddress(addr);
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, adapter.id);
    }
  }, [selectedWallet, availableWallets]);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isAnyAvailable: availableWallets.length > 0,
        selectedWallet,
        availableWallets,
        selectWallet,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
