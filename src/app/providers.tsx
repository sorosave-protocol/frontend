'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type Network = 'testnet' | 'mainnet';

interface NetworkContextType {
  network: Network;
  setNetwork: (network: Network) => void;
  isLoading: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [network, setNetworkState] = useState<Network>('testnet');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedNetwork = localStorage.getItem('preferred-network') as Network;
    if (savedNetwork && (savedNetwork === 'testnet' || savedNetwork === 'mainnet')) {
      setNetworkState(savedNetwork);
    }
    setIsLoading(false);
  }, []);

  const setNetwork = (newNetwork: Network) => {
    setNetworkState(newNetwork);
    localStorage.setItem('preferred-network', newNetwork);
  };

  return (
    <NetworkContext.Provider value={{ network, setNetwork, isLoading }}>
      {children}
    </NetworkContext.Provider>
  );
};

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <NetworkProvider>
      {children}
    </NetworkProvider>
  );
}