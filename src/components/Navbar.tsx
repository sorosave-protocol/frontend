"use client";

import Link from "next/link";
import { useState } from "react";
import { ConnectWallet } from "./ConnectWallet";

type Network = "testnet" | "mainnet";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  targetNetwork: Network;
}

function ConfirmationDialog({ isOpen, onConfirm, onCancel, targetNetwork }: ConfirmationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Switch Network</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to switch to {targetNetwork === "testnet" ? "Testnet" : "Mainnet"}? 
          This will disconnect your current wallet session.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Switch Network
          </button>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [currentNetwork, setCurrentNetwork] = useState<Network>("testnet");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [targetNetwork, setTargetNetwork] = useState<Network>("testnet");
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  const handleNetworkSelect = (network: Network) => {
    if (network !== currentNetwork) {
      setTargetNetwork(network);
      setShowConfirmation(true);
    }
    setShowNetworkDropdown(false);
  };

  const handleConfirmNetworkSwitch = () => {
    setCurrentNetwork(targetNetwork);
    setShowConfirmation(false);
    // Add network switching logic here
    console.log(`Switched to ${targetNetwork}`);
  };

  const handleCancelNetworkSwitch = () => {
    setShowConfirmation(false);
  };

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
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <div className={`w-2 h-2 rounded-full ${currentNetwork === "testnet" ? "bg-yellow-500" : "bg-green-500"}`}></div>
                <span>{currentNetwork === "testnet" ? "Testnet" : "Mainnet"}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showNetworkDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => handleNetworkSelect("testnet")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                      currentNetwork === "testnet" ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>Testnet</span>
                  </button>
                  <button
                    onClick={() => handleNetworkSelect("mainnet")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                      currentNetwork === "mainnet" ? "bg-gray-100" : ""
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Mainnet</span>
                  </button>
                </div>
              )}
            </div>
            <ConnectWallet />
          </div>
        </div>
      </div>
      
      <ConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={handleConfirmNetworkSwitch}
        onCancel={handleCancelNetworkSwitch}
        targetNetwork={targetNetwork}
      />
    </nav>
  );
}