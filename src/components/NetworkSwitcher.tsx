"use client";

import { useState, useEffect } from "react";
import { getCurrentNetwork, switchNetwork, type NetworkType } from "@/lib/sorosave";

export function NetworkSwitcher() {
  const [network, setNetwork] = useState<NetworkType>("testnet");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingNetwork, setPendingNetwork] = useState<NetworkType | null>(null);

  useEffect(() => {
    setNetwork(getCurrentNetwork());
  }, []);

  const handleNetworkChange = (newNetwork: NetworkType) => {
    if (newNetwork === network) return;
    setPendingNetwork(newNetwork);
    setShowConfirm(true);
  };

  const confirmSwitch = () => {
    if (!pendingNetwork) return;
    
    // Clear cache data
    if (typeof window !== "undefined") {
      const keysToRemove = Object.keys(localStorage).filter(
        (key) => key.startsWith("sorosave_") && key !== "sorosave_network"
      );
      keysToRemove.forEach((key) => localStorage.removeItem(key));
      sessionStorage.clear();
    }

    switchNetwork(pendingNetwork);
    setNetwork(pendingNetwork);
    setShowConfirm(false);
    setPendingNetwork(null);
    
    // Reload page to reinitialize with new network
    window.location.reload();
  };

  const cancelSwitch = () => {
    setShowConfirm(false);
    setPendingNetwork(null);
  };

  return (
    <>
      <div className="relative">
        <select
          value={network}
          onChange={(e) => handleNetworkChange(e.target.value as NetworkType)}
          className="appearance-none bg-gray-100 border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="testnet">Testnet</option>
          <option value="mainnet">Mainnet</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Switch Network?</h3>
            <p className="text-gray-600 mb-4">
              Switching to <strong>{pendingNetwork}</strong> will clear all cached data and reload the page.
              Are you sure you want to continue?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelSwitch}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitch}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Switch Network
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
