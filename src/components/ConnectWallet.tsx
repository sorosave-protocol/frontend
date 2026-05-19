"use client";

import { useState } from "react";
import { useWallet } from "@/app/providers";
import { shortenAddress } from "@sorosave/sdk";
import { WALLET_META, WalletType } from "@/lib/wallet";

const WalletIcon = ({ type }: { type: WalletType }) => {
  const icons: Record<WalletType, JSX.Element> = {
    freighter: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#4A5568" />
        <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    xbull: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#FF6B35" />
        <path d="M16 9l-4 3-4-3M8 15l4-3 4 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    albedo: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#6B46C1" />
        <circle cx="12" cy="12" r="4" fill="white" />
      </svg>
    ),
  };
  return icons[type];
};

export function ConnectWallet() {
  const { address, isConnected, selectedWallet, getWalletStatus, selectWallet, connect, disconnect } = useWallet();
  const [showSelector, setShowSelector] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!selectedWallet) {
      setShowSelector(true);
      return;
    }
    setIsConnecting(true);
    await connect();
    setIsConnecting(false);
    setShowSelector(false);
  };

  const handleWalletSelect = (wallet: WalletType) => {
    selectWallet(wallet);
  };

  const handleConnectSelected = async () => {
    setIsConnecting(true);
    await connect();
    setIsConnecting(false);
    setShowSelector(false);
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        {/* Wallet Selector Button */}
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <WalletIcon type={selectedWallet || "freighter"} />
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            {WALLET_META[selectedWallet || "freighter"].name}
          </span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Address Display */}
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {shortenAddress(address)}
        </span>

        {/* Disconnect Button */}
        <button
          onClick={disconnect}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Disconnect
        </button>

        {/* Wallet Selection Dropdown */}
        {showSelector && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Switch Wallet
            </div>
            {(Object.keys(WALLET_META) as WalletType[]).map((wallet) => {
              const status = getWalletStatus(wallet);
              return (
                <button
                  key={wallet}
                  onClick={() => handleWalletSelect(wallet)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                    selectedWallet === wallet ? "bg-primary-50" : ""
                  }`}
                >
                  <WalletIcon type={wallet} />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900">{WALLET_META[wallet].name}</div>
                    <div className="text-xs text-gray-500">{WALLET_META[wallet].description}</div>
                  </div>
                  {status === "connected" && (
                    <span className="text-xs text-primary-600 font-medium">Connected</span>
                  )}
                  {status === "installed" && selectedWallet !== wallet && (
                    <span className="text-xs text-green-600 font-medium">Available</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Connect Button */}
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        {isConnecting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <WalletIcon type={selectedWallet || "freighter"} />
            <span>Connect {selectedWallet ? WALLET_META[selectedWallet].name : "Wallet"}</span>
          </>
        )}
      </button>

      {/* Wallet Selector Modal/Dropdown */}
      {showSelector && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Select Wallet</h3>
            <p className="text-xs text-gray-500 mt-1">Choose your preferred Stellar wallet</p>
          </div>

          {(Object.keys(WALLET_META) as WalletType[]).map((wallet) => {
            const status = getWalletStatus(wallet);
            const isInstalled = status !== "not_installed";

            return (
              <div
                key={wallet}
                className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                  selectedWallet === wallet ? "bg-primary-50 border-l-4 border-primary-600" : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <WalletIcon type={wallet} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{WALLET_META[wallet].name}</div>
                    <div className="text-xs text-gray-500">{WALLET_META[wallet].description}</div>
                  </div>
                  {isInstalled ? (
                    <button
                      onClick={() => {
                        handleWalletSelect(wallet);
                        handleConnectSelected();
                      }}
                      className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full hover:bg-primary-200 transition-colors"
                    >
                      {selectedWallet === wallet ? "Connected" : "Connect"}
                    </button>
                  ) : (
                    <a
                      href={WALLET_META[wallet].installUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      Install
                    </a>
                  )}
                </div>
                {selectedWallet === wallet && isInstalled && (
                  <button
                    onClick={handleConnectSelected}
                    className="w-full mt-2 text-xs text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Click to connect →
                  </button>
                )}
              </div>
            );
          })}

          <div className="px-4 py-2 border-t border-gray-100 mt-2">
            <button
              onClick={() => setShowSelector(false)}
              className="w-full text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}