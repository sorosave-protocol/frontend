"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  WalletAdapter,
  WalletId,
  WalletNotInstalledError,
  clearLastWalletId,
  getAdapter,
  loadLastWalletId,
  saveLastWalletId,
} from "@/lib/wallets";
import { NETWORK_PASSPHRASE } from "@/lib/sorosave";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  activeWalletId: WalletId | null;
  activeWallet: WalletAdapter | null;
  connecting: boolean;
  error: string | null;
  connect: (walletId: WalletId) => Promise<void>;
  disconnect: () => void;
  signTransaction: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  activeWalletId: null,
  activeWallet: null,
  connecting: false,
  error: null,
  connect: async () => {},
  disconnect: () => {},
  signTransaction: async () => {
    throw new Error("No wallet connected");
  },
});

export function useWallet() {
  return useContext(WalletContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [activeWalletId, setActiveWalletId] = useState<WalletId | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const last = loadLastWalletId();
    if (!last) return;
    const adapter = getAdapter(last);
    (async () => {
      const available = await adapter.isAvailable();
      if (!available) return;
      const key = await adapter.getPublicKey();
      if (key) {
        setActiveWalletId(last);
        setAddress(key);
      }
    })();
  }, []);

  const connect = useCallback(async (walletId: WalletId) => {
    setConnecting(true);
    setError(null);
    try {
      const adapter = getAdapter(walletId);
      const key = await adapter.connect();
      setActiveWalletId(walletId);
      setAddress(key);
      saveLastWalletId(walletId);
    } catch (err) {
      if (err instanceof WalletNotInstalledError) {
        setError(`${walletId} is not installed. Open ${err.installUrl} to install it.`);
      } else {
        setError(err instanceof Error ? err.message : "Failed to connect wallet");
      }
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setActiveWalletId(null);
    setError(null);
    clearLastWalletId();
  }, []);

  const signTransaction = useCallback(
    async (xdr: string) => {
      if (!activeWalletId) {
        throw new Error("No wallet connected");
      }
      const adapter = getAdapter(activeWalletId);
      return adapter.signTransaction(xdr, {
        networkPassphrase: NETWORK_PASSPHRASE,
      });
    },
    [activeWalletId],
  );

  const activeWallet = activeWalletId ? getAdapter(activeWalletId) : null;

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        activeWalletId,
        activeWallet,
        connecting,
        error,
        connect,
        disconnect,
        signTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
