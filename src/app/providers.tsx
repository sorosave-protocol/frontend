"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { connectWallet, getPublicKey, isFreighterInstalled } from "@/lib/wallet";
import { getCurrentNetwork, switchNetwork, NETWORKS } from "@/lib/sorosave";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isFreighterAvailable: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  currentNetwork: keyof typeof NETWORKS;
  switchNetwork: (network: keyof typeof NETWORKS) => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isFreighterAvailable: false,
  connect: async () => {},
  disconnect: () => {},
  currentNetwork: "TESTNET",
  switchNetwork: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState<keyof typeof NETWORKS>("TESTNET");

  useEffect(() => {
    isFreighterInstalled().then(setIsFreighterAvailable);
    // Try to reconnect on load
    getPublicKey().then((key) => {
      if (key) setAddress(key);
    });
    setCurrentNetwork(getCurrentNetwork());
  }, []);

  const connect = useCallback(async () => {
    const addr = await connectWallet();
    if (addr) setAddress(addr);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  const handleSwitchNetwork = useCallback((network: keyof typeof NETWORKS) => {
    if (network !== currentNetwork) {
      if (window.confirm(
        `Switching networks will clear your cached data. Are you sure you want to switch to ${network}?`
      )) {
        switchNetwork(network);
        setCurrentNetwork(network);
        // Clear localStorage for cached data
        localStorage.removeItem("sorosave_cache");
        window.location.reload();
      }
    }
  }, [currentNetwork]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isFreighterAvailable,
        connect,
        disconnect,
        currentNetwork,
        switchNetwork: handleSwitchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}