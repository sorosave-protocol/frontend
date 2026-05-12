"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/app/providers";
import { WalletAdapter, walletList } from "@/lib/wallets";

interface WalletSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletSelectModal({ isOpen, onClose }: WalletSelectModalProps) {
  const { connect, connecting, error } = useWallet();
  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    Promise.all(
      walletList.map(async (w) => [w.id, await w.isAvailable()] as const),
    ).then((entries) => {
      if (cancelled) return;
      setAvailability(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = async (wallet: WalletAdapter) => {
    if (availability[wallet.id] === false) return;
    await connect(wallet.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Connect a wallet
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          {walletList.map((wallet) => {
            const available = availability[wallet.id];
            const checking = available === undefined;
            return (
              <div
                key={wallet.id}
                className="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={wallet.iconUrl}
                    alt=""
                    className="w-8 h-8 rounded"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {wallet.name}
                    </div>
                    {checking && (
                      <div className="text-xs text-gray-400">Checking…</div>
                    )}
                    {!checking && !available && (
                      <div className="text-xs text-gray-500">Not installed</div>
                    )}
                  </div>
                </div>
                {available ? (
                  <button
                    onClick={() => handleSelect(wallet)}
                    disabled={connecting}
                    className="bg-primary-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                  >
                    {connecting ? "Connecting…" : "Connect"}
                  </button>
                ) : (
                  <a
                    href={wallet.installUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    Install
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
