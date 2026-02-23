"use client";

import { useState } from "react";
import { useWallet } from "@/app/providers";

// Mock functions - would be imported from SDK/lib in production
function formatAmount(amount: bigint): string {
  return (Number(amount) / 10000000).toFixed(2);
}

interface ContributeModalProps {
  groupId: number;
  contributionAmount: bigint;
  isOpen: boolean;
  onClose: () => void;
}

export function ContributeModal({
  groupId,
  contributionAmount,
  isOpen,
  onClose,
}: ContributeModalProps) {
  const { address } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleContribute = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      // TODO: Implement actual contribution via SDK
      console.log("Contributing to group:", groupId);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to contribute");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Confirm Contribution
        </h3>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Amount to contribute</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatAmount(contributionAmount)} tokens
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleContribute}
            disabled={loading}
            className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Confirming..." : "Contribute"}
          </button>
        </div>
      </div>
    </div>
  );
}
