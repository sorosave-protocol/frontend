"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { connectWallet, getPublicKey, isFreighterInstalled } from "@/lib/wallet";
import {
  detectNetwork,
  persistNetwork,
  rebuildClient,
  sorosaveClient,
  SorobanNetwork,
  NETWORK_CONFIGS,
} from "@/lib/sorosave";

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

interface NetworkContextType {
  network: SorobanNetwork;
  setNetwork: (next: SorobanNetwork) => void;
  options: typeof NETWORK_CONFIGS;
}

const NetworkContext = createContext<NetworkContextType>({
  network: "testnet",
  setNetwork: () => {},
  options: NETWORK_CONFIGS,
});

export function useWallet() {
  return useContext(WalletContext);
}

export function useNetwork() {
  return useContext(NetworkContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false);
  const [network, setNetworkState] = useState<SorobanNetwork>("testnet");

  useEffect(() => {
    isFreighterInstalled().then(setIsFreighterAvailable);
    // Try to reconnect on load
    getPublicKey().then((key) => {
      if (key) setAddress(key);
    });
    // Restore the previously selected network from localStorage
    setNetworkState(detectNetwork());
  }, []);

  const connect = useCallback(async () => {
    const addr = await connectWallet();
    if (addr) setAddress(addr);
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  const setNetwork = useCallback((next: SorobanNetwork) => {
    if (next === network) return;
    // Rebuild the cached client against the new RPC + contract ID,
    // then persist the selection and update React state.
    rebuildClient(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("sorosave.cache");
      } catch {
        // best effort
      }
    }
    setNetworkState(next);
  }, [network]);

  const networkValue = useMemo<NetworkContextType>(
    () => ({ network, setNetwork, options: NETWORK_CONFIGS }),
    [network, setNetwork],
  );

  return (
    <NetworkContext.Provider value={networkValue}>
      <WalletContext.Provider
        value={{
          address,
          isConnected: !!address,
          isFreighterAvailable,
          connect,
          disconnect,
        }}
      >
        {children}
      </WalletContext.Provider>
    </NetworkContext.Provider>
  );
}
