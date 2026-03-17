"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  startTransition,
} from "react";
import { connectWallet, getPublicKey, isFreighterInstalled } from "@/lib/wallet";
import { OnboardingTour } from "@/components/OnboardingTour";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isFreighterAvailable: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

interface OnboardingContextType {
  startTour: () => void;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isFreighterAvailable: false,
  connect: async () => {},
  disconnect: () => {},
});

const OnboardingContext = createContext<OnboardingContextType>({
  startTour: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

export function useOnboardingTour() {
  return useContext(OnboardingContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isFreighterAvailable, setIsFreighterAvailable] = useState(false);
  const [tourRunId, setTourRunId] = useState(0);

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
    <OnboardingContext.Provider
      value={{
        startTour: () => {
          startTransition(() => {
            setTourRunId((value) => value + 1);
          });
        },
      }}
    >
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
        <OnboardingTour runId={tourRunId} />
      </WalletContext.Provider>
    </OnboardingContext.Provider>
  );
}
