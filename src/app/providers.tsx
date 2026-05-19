"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import {
  WalletType,
  WalletContextType,
  WALLET_PREFERENCE_KEY,
  SUPPORTED_WALLETS,
  getWalletAdapter,
  isWalletInstalled,
  connectWallet,
  getPublicKey,
} from "@/lib/wallet";

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a Providers component");
  }
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletType[]>([]);
  const [walletStatus, setWalletStatus] = useState<Record<WalletType, "installed" | "not_installed" | "connected">>({
    freighter: "not_installed",
    xbull: "not_installed",
    albedo: "installed", // Albedo is web-based, always "installed"
  });

  // Load persisted wallet preference
  useEffect(() => {
    const savedWallet = localStorage.getItem(WALLET_PREFERENCE_KEY) as WalletType | null;
    if (savedWallet && SUPPORTED_WALLETS.includes(savedWallet)) {
      setSelectedWallet(savedWallet);
    } else {
      // Default to first available wallet
      setSelectedWallet("freighter");
    }
  }, []);

  // Check wallet availability on mount
  useEffect(() => {
    const checkWallets = async () => {
      const installed: WalletType[] = [];
      const statusMap: Record<WalletType, "installed" | "not_installed" | "connected"> = {
        freighter: "not_installed",
        xbull: "not_installed",
        albedo: "installed",
      };

      for (const walletType of SUPPORTED_WALLETS) {
        const installed_1 = await isWalletInstalled(walletType);
        if (installed_1) {
          installed.push(walletType);
        }
        statusMap[walletType] = installed_1 ? "installed" : walletType === "albedo" ? "installed" : "not_installed";
      }

      setAvailableWallets(installed);
      setWalletStatus(statusMap);

      // Auto-connect if previously connected (stored in session)
      const storedAddress = sessionStorage.getItem("wallet_address");
      const storedWallet = sessionStorage.getItem("wallet_type") as WalletType | null;
      if (storedAddress && storedWallet) {
        setAddress(storedAddress);
        setSelectedWallet(storedWallet);
        setWalletStatus((prev) => ({ ...prev, [storedWallet]: "connected" }));
      }
    };

    checkWallets();
  }, []);

  const getWalletStatus = useCallback(
    (wallet: WalletType): "installed" | "not_installed" | "connected" => {
      if (wallet === selectedWallet && address) {
        return "connected";
      }
      return walletStatus[wallet];
    },
    [selectedWallet, address, walletStatus]
  );

  const selectWallet = useCallback((wallet: WalletType) => {
    setSelectedWallet(wallet);
    localStorage.setItem(WALLET_PREFERENCE_KEY, wallet);
  }, []);

  const connect = useCallback(async () => {
    if (!selectedWallet) return;

    const addr = await connectWallet(selectedWallet);
    if (addr) {
      setAddress(addr);
      sessionStorage.setItem("wallet_address", addr);
      sessionStorage.setItem("wallet_type", selectedWallet);
      setWalletStatus((prev) => ({ ...prev, [selectedWallet]: "connected" }));
    }
  }, [selectedWallet]);

  const disconnect = useCallback(() => {
    setAddress(null);
    sessionStorage.removeItem("wallet_address");
    sessionStorage.removeItem("wallet_type");
    if (selectedWallet) {
      setWalletStatus((prev) => ({
        ...prev,
        [selectedWallet]: prev[selectedWallet] === "connected" ? "installed" : prev[selectedWallet],
      }));
    }
  }, [selectedWallet]);

  // Update connection status when address changes
  useEffect(() => {
    if (address && selectedWallet) {
      setWalletStatus((prev) => ({ ...prev, [selectedWallet]: "connected" }));
    }
  }, [address, selectedWallet]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        selectedWallet,
        availableWallets,
        getWalletStatus,
        selectWallet,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}