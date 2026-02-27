"use client";

import { useWallet } from "@/app/providers";
import { shortenAddress } from "@sorosave/sdk";

export function ConnectWallet() {
  const { address, isConnected, isFreighterAvailable, connect, disconnect } =
    useWallet();

  if (!isFreighterAvailable) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        Install Freighter
      </a>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-200">
          {shortenAddress(address)}
        </span>
        <button
          onClick={disconnect}
          className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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
