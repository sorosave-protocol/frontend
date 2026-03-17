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
        data-tour="wallet-connect"
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
      >
        Install Freighter
      </a>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
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
    <button
      onClick={connect}
      data-tour="wallet-connect"
      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
    >
      Connect Wallet
    </button>
  );
}
