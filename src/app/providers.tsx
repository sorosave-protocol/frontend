"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { connectWallet, getPublicKey, isFreighterInstalled } from "@/lib/wallet";
import { getCurrentNetwork, type NetworkType } from "@/lib/sorosave";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isFreighterAvailable: boolean;
  network: NetworkType;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isFreighterAvailable: false,
  network: "testnet",
  connect: async () => {},
  disconnect: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false);
  const [network, setNetwork] = useState<NetworkType>("testnet");

  useEffect(() => {
    isFreighterInstalled().then(setIsFreighterAvailable);
    setNetwork(getCurrentNetwork());
    
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
        network,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
