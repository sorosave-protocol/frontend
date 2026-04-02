"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  NetworkId,
  NetworkConfig,
  getNetworkConfig,
  loadSelectedNetwork,
  saveSelectedNetwork,
} from "@/lib/network";

interface NetworkContextType {
  /** The currently active network id. */
  networkId: NetworkId;
  /** Full config object for the active network. */
  network: NetworkConfig;
  /** Switch to a different network. Persists the choice and clears cached data. */
  switchNetwork: (id: NetworkId) => void;
}

const NetworkContext = createContext<NetworkContextType>({
  networkId: "testnet",
  network: getNetworkConfig("testnet"),
  switchNetwork: () => {},
});

export function useNetwork() {
  return useContext(NetworkContext);
}

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [networkId, setNetworkId] = useState<NetworkId>("testnet");

  // Load persisted selection on mount (client-only)
  useEffect(() => {
    setNetworkId(loadSelectedNetwork());
  }, []);

  const switchNetwork = useCallback(
    (id: NetworkId) => {
      if (id === networkId) return;
      saveSelectedNetwork(id);
      setNetworkId(id);
      // Clear any cached contract / group data so the UI re-fetches for the new network
      if (typeof window !== "undefined") {
        sessionStorage.clear();
      }
    },
    [networkId],
  );

  const network = getNetworkConfig(networkId);

  return (
    <NetworkContext.Provider value={{ networkId, network, switchNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}
