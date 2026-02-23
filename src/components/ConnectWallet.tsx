"use client";

import { useWallet } from "@/app/providers";

function shortenAddress(address: string): string {
  if (!address || address.length < 8) return address;
  return address.slice(0, 6) + "..." + address.slice(-4);
}

export function ConnectWallet() {
  const { address, isConnected, isFreighterAvailable, connect, disconnect } =
    useWallet();

  if (!isFreighterAvailable) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Install Freighter
      </a>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          {shortenAddress(address)}
        </span>
        <button
          onClick={disconnect}
          className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
    >
      Connect Wallet
    </button>
  );
}
