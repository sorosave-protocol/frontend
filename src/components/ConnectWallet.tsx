"use client";

import { useWallet } from "@/app/providers";
import { shortenAddress } from "@sorosave/sdk";
import { useTranslations } from "next-intl";

export function ConnectWallet() {
  const { address, isConnected, isFreighterAvailable, connect, disconnect } =
    useWallet();
  const t = useTranslations("wallet");

  if (!isFreighterAvailable) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
      >
        {t("installFreighter")}
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
          {t("disconnect")}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
    >
      {t("connectWallet")}
    </button>
  );
}
