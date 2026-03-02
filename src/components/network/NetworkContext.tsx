'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  NetworkType, 
  NetworkConfig, 
  NETWORKS, 
  getStoredNetwork, 
  setStoredNetwork,
  clearNetworkCache 
} from '@/lib/network';

interface NetworkContextType {
  network: NetworkType;
  config: NetworkConfig;
  switchNetwork: (network: NetworkType) => void;
  showConfirmDialog: boolean;
  pendingNetwork: NetworkType | null;
  confirmSwitch: () => void;
  cancelSwitch: () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [network, setNetwork] = useState<NetworkType>('testnet');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNetwork, setPendingNetwork] = useState<NetworkType | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const stored = getStoredNetwork();
    setNetwork(stored);
    setIsInitialized(true);
  }, []);

  const switchNetwork = useCallback((newNetwork: NetworkType) => {
    if (newNetwork === network) return;
    setPendingNetwork(newNetwork);
    setShowConfirmDialog(true);
  }, [network]);

  const confirmSwitch = useCallback(() => {
    if (pendingNetwork) {
      clearNetworkCache();
      setStoredNetwork(pendingNetwork);
      setNetwork(pendingNetwork);
      setShowConfirmDialog(false);
      setPendingNetwork(null);
      window.location.reload();
    }
  }, [pendingNetwork]);

  const cancelSwitch = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingNetwork(null);
  }, []);

  const value: NetworkContextType = {
    network,
    config: NETWORKS[network],
    switchNetwork,
    showConfirmDialog,
    pendingNetwork,
    confirmSwitch,
    cancelSwitch,
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <NetworkContext.Provider value={value}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}
