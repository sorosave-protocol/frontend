"use client";

import { useWallet } from "@/app/providers";
import { useState } from "react";
import { WALLET_ADAPTERS } from "@/lib/wallets";

function shortenAddress(address: string) {
  return `${address.slice(0, 5)}...${address.slice(-4)}`;
}

export function ConnectWallet() {
  const { address, isConnected, connect, disconnect, activeAdapterId } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isConnected && address) {
    const activeAdapter = activeAdapterId ? WALLET_ADAPTERS[activeAdapterId] : null;

    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex items-center">
          {activeAdapter && <span className="mr-2 font-bold">{activeAdapter.name}</span>}
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
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        Connect Wallet
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden text-black">
            <div className="p-4 border-b flex justify-between items-center text-black">
              <h2 className="text-lg font-semibold text-gray-800">Select a Wallet</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            
            <div className="p-4 space-y-2">
              {Object.values(WALLET_ADAPTERS).map((adapter) => (
                <button
                  key={adapter.id}
                  onClick={async () => {
                    await connect(adapter.id);
                    setIsModalOpen(false);
                  }}
                  className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-500 transition-all text-left"
                >
                  <div className="flex-1 font-medium text-gray-700">
                    Connect with {adapter.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
