"use client";

import { useState, useEffect } from "react";

export type Network = "testnet" | "mainnet";

export const NETWORK_CONFIG: Record<Network, { label: string; rpcUrl: string; passphrase: string; contractId: string; explorerUrl: string }> = {
  testnet: {
    label: "Testnet",
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org",
    passphrase: "Test SDF Network ; September 2015",
    contractId: process.env.NEXT_PUBLIC_CONTRACT_ID || "",
    explorerUrl: "https://stellar.expert/explorer/testnet",
  },
  mainnet: {
    label: "Mainnet",
    rpcUrl: "https://mainnet.stellar.validationcloud.io/v1/XCSmR1s5o4j6RX3ra6wy7AKJBW4dBnhB",
    passphrase: "Public Global Stellar Network ; September 2015",
    contractId: process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ID || "",
    explorerUrl: "https://stellar.expert/explorer/public",
  },
};

interface NetworkSwitcherProps {
  onSwitch?: (network: Network) => void;
}

export function NetworkSwitcher({ onSwitch }: NetworkSwitcherProps) {
  const [network, setNetwork] = useState<Network>("testnet");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingNetwork, setPendingNetwork] = useState<Network | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sorosave_network") as Network | null;
    if (stored && (stored === "testnet" || stored === "mainnet")) {
      setNetwork(stored);
    }
  }, []);

  const handleSelect = (next: Network) => {
    if (next === network) return;
    setPendingNetwork(next);
    setShowConfirm(true);
  };

  const confirmSwitch = () => {
    if (!pendingNetwork) return;
    setNetwork(pendingNetwork);
    localStorage.setItem("sorosave_network", pendingNetwork);
    // Clear cached group/wallet data
    localStorage.removeItem("sorosave_wallet");
    onSwitch?.(pendingNetwork);
    setShowConfirm(false);
    setPendingNetwork(null);
    window.location.reload();
  };

  const cancel = () => {
    setShowConfirm(false);
    setPendingNetwork(null);
  };

  return (
    <>
      <div className="relative flex items-center">
        <select
          value={network}
          onChange={e => handleSelect(e.target.value as Network)}
          className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer appearance-none pr-6 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
            network === "mainnet"
              ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300"
              : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300"
          }`}
        >
          <option value="testnet">🧪 Testnet</option>
          <option value="mainnet">🌐 Mainnet</option>
        </select>
        <span className="pointer-events-none absolute right-1.5 text-xs opacity-50">▾</span>
      </div>

      {/* Confirmation dialog */}
      {showConfirm && pendingNetwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
              Switch to {NETWORK_CONFIG[pendingNetwork].label}?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {pendingNetwork === "mainnet"
                ? "⚠️ You are switching to Mainnet. Real funds are at risk."
                : "You are switching to Testnet. Transactions use test tokens only."}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
              Your wallet will be disconnected and the page will reload.
            </p>
            <div className="flex space-x-3">
              <button onClick={cancel} className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
              </button>
              <button
                onClick={confirmSwitch}
                className={`flex-1 px-4 py-2 rounded-lg text-sm text-white font-medium ${
                  pendingNetwork === "mainnet" ? "bg-green-600 hover:bg-green-700" : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                Switch to {NETWORK_CONFIG[pendingNetwork].label}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
