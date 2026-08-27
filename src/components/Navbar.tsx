"use client";

import Link from "next/link";
import { useState } from "react";
import { ConnectWallet } from "./ConnectWallet";
import { useNetwork, NETWORK_CONFIGS } from "@/lib/sorosave";

export function Navbar() {
  const { network, setNetwork, options } = useNetwork();
  const [pendingSwitch, setPendingSwitch] = useState<
    (typeof NETWORK_CONFIGS)[keyof typeof NETWORK_CONFIGS] | null
  >(null);

  function handleSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as keyof typeof NETWORK_CONFIGS;
    if (next === network) return;
    setPendingSwitch(options[next]);
  }

  function confirmSwitch() {
    if (!pendingSwitch) return;
    setNetwork(pendingSwitch.rpcUrl === options.testnet.rpcUrl ? "testnet" : "mainnet");
    setPendingSwitch(null);
  }

  function cancelSwitch() {
    setPendingSwitch(null);
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary-700">
              SoroSave
            </Link>
            <div className="hidden sm:flex space-x-4">
              <Link
                href="/groups"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Groups
              </Link>
              <Link
                href="/groups/new"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Create Group
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <label className="text-sm text-gray-600" htmlFor="sorosave-network">
              Network
            </label>
            <select
              id="sorosave-network"
              value={network}
              onChange={handleSelectChange}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Select Soroban network"
            >
              {Object.entries(options).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>
            <ConnectWallet />
          </div>
        </div>
      </div>

      {pendingSwitch && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="network-switch-confirm-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <h2
              id="network-switch-confirm-title"
              className="text-lg font-semibold text-gray-900"
            >
              Switch to {pendingSwitch.label}?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              The app will reload cached groups, balances, and any pending
              transactions for the new network. Unsaved drafts will be lost.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={cancelSwitch}
                className="px-3 py-1.5 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSwitch}
                className="px-3 py-1.5 rounded-md text-sm bg-primary-600 text-white hover:bg-primary-700"
              >
                Confirm switch
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
