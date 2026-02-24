"use client";

import { useState } from "react";
import { useWallet } from "@/app/providers";

function shortenAddress(address: string) {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function ConnectWallet() {
  const { address, isConnected, activeWallet, connect, disconnect, wallets } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex items-center">
          {activeWallet && <span className="mr-2">{activeWallet.icon}</span>}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Select a Wallet</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={async () => {
                    await connect(wallet.id);
                    setIsModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <span className="font-medium text-gray-900">{wallet.name}</span>
                  </div>
                  <span className="text-primary-600">&rarr;</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6 text-center text-xs text-gray-500">
              New to Stellar? <a href="https://stellar.org/ecosystem/wallets" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Learn more about wallets</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
