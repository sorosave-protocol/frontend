"use client";

import { useState } from "react";
import { useWallet } from "@/app/providers";
import { sorosaveClient, NETWORK_PASSPHRASE } from "@/lib/sorosave";
import { formatAmount } from "@sorosave/sdk";
import { signTransaction } from "@/lib/wallet";

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
      const tx = await sorosaveClient.contribute(address, groupId, address);
      const signedXdr = await signTransaction(
        tx.toXDR(),
        NETWORK_PASSPHRASE
      );

      // TODO: Submit signed transaction
      console.log("Signed contribution:", signedXdr);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to contribute");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Confirm Contribution
        </h3>

        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-center">
            <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
              Amount to contribute
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatAmount(contributionAmount)} tokens
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
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
