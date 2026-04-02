"use client";

import { useState } from "react";
import { useNetwork } from "@/contexts/NetworkContext";
import { getAllNetworks, NetworkId } from "@/lib/network";

/**
 * Dropdown network selector displayed in the Navbar.
 * Shows the current network with a colored indicator dot and allows
 * switching between Testnet and Mainnet with a confirmation dialog.
 */
export function NetworkSelector() {
  const { networkId, switchNetwork } = useNetwork();
  const [pendingNetwork, setPendingNetwork] = useState<NetworkId | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const networks = getAllNetworks();

  const indicatorColor =
    networkId === "mainnet" ? "bg-green-500" : "bg-yellow-500";

  function handleSelect(id: NetworkId) {
    setIsOpen(false);
    if (id === networkId) return;
    setPendingNetwork(id);
  }

  function confirmSwitch() {
    if (pendingNetwork) {
      switchNetwork(pendingNetwork);
      setPendingNetwork(null);
    }
  }

  function cancelSwitch() {
    setPendingNetwork(null);
  }

  return (
    <>
      {/* Dropdown trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          aria-label="Select network"
        >
          <span className={`w-2 h-2 rounded-full ${indicatorColor}`} />
          <span>{networkId === "mainnet" ? "Mainnet" : "Testnet"}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border z-50">
            {networks.map((n) => (
              <button
                key={n.id}
                onClick={() => handleSelect(n.id)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2 ${
                  n.id === networkId
                    ? "text-primary-700 font-semibold"
                    : "text-gray-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    n.id === "mainnet" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                <span>{n.name}</span>
                {n.id === networkId && (
                  <svg
                    className="w-4 h-4 ml-auto text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation dialog */}
      {pendingNetwork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Switch Network
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to switch to{" "}
              <span className="font-medium">
                {pendingNetwork === "mainnet"
                  ? "Stellar Mainnet"
                  : "Stellar Testnet"}
              </span>
              ? Cached data will be cleared and the page will reload with the
              new network configuration.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={cancelSwitch}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitch}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
