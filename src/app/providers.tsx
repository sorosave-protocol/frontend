"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { connectWallet, getPublicKey, isFreighterInstalled } from "@/lib/wallet";
import { ThemeProvider } from "@/components/ThemeProvider";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isFreighterAvailable: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isFreighterAvailable: false,
  connect: async () => {},
  disconnect: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false);

  useEffect(() => {
    isFreighterInstalled().then(setIsFreighterAvailable);
    // Try to reconnect on load
    getPublicKey().then((key) => {
      if (key) setAddress(key);
    });
  }, []);

  const connect = useCallback(async () => {
    const addr = await connectWallet();
    if (addr) setAddress(addr);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isFreighterAvailable,
        connect,
        disconnect,
      }}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </WalletContext.Provider>
  );
}
