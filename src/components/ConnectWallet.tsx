"use client";

import { useState } from "react";
import { useWallet } from "@/app/providers";
import { shortenAddress } from "@sorosave/sdk";

export function ConnectWallet() {
  const {
    address,
    isConnected,
    isAnyAvailable,
    selectedWallet,
    availableWallets,
    selectWallet,
    connect,
    disconnect,
  } = useWallet();

  const [pickerOpen, setPickerOpen] = useState(false);

  // No wallet extensions installed at all.
  if (!isAnyAvailable) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
      >
        Install a Stellar Wallet
      </a>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {selectedWallet ? `${selectedWallet.name}: ` : ""}
          {shortenAddress(address)}
        </span>
        <button
          onClick={disconnect}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setPickerOpen((o) => !o)}
        className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        Connect Wallet
      </button>

      {pickerOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
          <p className="text-xs text-gray-500 px-2 py-1">Select a wallet</p>
          {availableWallets.map((w) => (
            <button
              key={w.id}
              onClick={async () => {
                selectWallet(w.id);
                setPickerOpen(false);
                await connect();
              }}
              className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100"
            >
              {w.name}
            </button>
          ))}
          {availableWallets.length === 0 && (
            <p className="text-xs text-gray-400 px-2 py-1">
              No installed wallets detected.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
