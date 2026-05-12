"use client";

import { useState } from "react";
import { useWallet } from "@/app/providers";
import { shortenAddress } from "@sorosave/sdk";
import { WalletSelectModal } from "./WalletSelectModal";

export function ConnectWallet() {
  const { address, isConnected, activeWallet, disconnect } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {activeWallet ? `${activeWallet.name} · ` : ""}
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
        onClick={() => setModalOpen(true)}
        className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
      >
        Connect Wallet
      </button>
      <WalletSelectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
