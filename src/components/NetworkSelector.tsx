"use client";

import { useState, useEffect } from 'react';
import { 
  getStoredNetwork, 
  setStoredNetwork, 
  getNetworkConfig, 
  clearNetworkCache,
  type Network 
} from '@/lib/networks';

interface NetworkSelectorProps {
  onNetworkChange?: (network: Network) => void;
}

export function NetworkSelector({ onNetworkChange }: NetworkSelectorProps) {
  const [network, setNetwork] = useState<Network>('testnet');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingNetwork, setPendingNetwork] = useState<Network | null>(null);

  useEffect(() => {
    setNetwork(getStoredNetwork());
  }, []);

  const handleNetworkChange = (newNetwork: Network) => {
    if (newNetwork === network) return;
    
    if (network && network !== newNetwork) {
      // Show confirmation dialog
      setPendingNetwork(newNetwork);
      setShowConfirm(true);
    } else {
      switchNetwork(newNetwork);
    }
  };

  const switchNetwork = (newNetwork: Network) => {
    setNetwork(newNetwork);
    setStoredNetwork(newNetwork);
    clearNetworkCache();
    onNetworkChange?.(newNetwork);
    setShowConfirm(false);
    setPendingNetwork(null);
  };

  const cancelSwitch = () => {
    setShowConfirm(false);
    setPendingNetwork(null);
  };

  const config = getNetworkConfig(network);

  return (
    <>
      <div className="flex items-center space-x-2">
        <label htmlFor="network-select" className="text-sm text-gray-600">
          Network:
        </label>
        <select
          id="network-select"
          value={network}
          onChange={(e) => handleNetworkChange(e.target.value as Network)}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium border
            ${network === 'mainnet' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-blue-50 border-blue-200 text-blue-700'
            }
          `}
        >
          <option value="testnet">Testnet</option>
          <option value="mainnet">Mainnet</option>
        </select>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && pendingNetwork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Switch Networks?
            </h3>
            <p className="text-gray-600 mb-4">
              You are about to switch from{' '}
              <span className="font-semibold">{config.name}</span> to{' '}
              <span className="font-semibold">
                {pendingNetwork === 'mainnet' ? 'Mainnet' : 'Testnet'}
              </span>
              .
            </p>
            <p className="text-sm text-amber-600 mb-4">
              ⚠️ Cached data will be cleared. Make sure any pending transactions 
              are completed first.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelSwitch}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => switchNetwork(pendingNetwork)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Switch Network
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
