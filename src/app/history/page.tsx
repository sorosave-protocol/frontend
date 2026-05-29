"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/app/providers";

type HorizonOperation = {
  id: string;
  type: string;
  created_at: string;
  transaction_hash: string;
  from?: string;
  to?: string;
  funder?: string;
  account?: string;
  amount?: string;
  asset_type?: string;
  asset_code?: string;
};

type HorizonOperationsResponse = {
  _embedded?: {
    records?: HorizonOperation[];
  };
};

type HistoryItem = {
  id: string;
  kind: "Contribution" | "Payout" | "Group Join";
  timestamp: string;
  hash: string;
  amount: string;
  asset: string;
};

const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ?? "https://horizon-testnet.stellar.org";
const STELLAR_EXPERT_NETWORK =
  process.env.NEXT_PUBLIC_STELLAR_EXPERT_NETWORK ?? "testnet";

function getExplorerUrl(hash: string) {
  return `https://stellar.expert/explorer/${STELLAR_EXPERT_NETWORK}/tx/${hash}`;
}

function getHistoryKind(operation: HorizonOperation, address: string) {
  if (operation.from === address || operation.funder === address) {
    return "Contribution" as const;
  }

  if (operation.to === address) {
    return "Payout" as const;
  }

  return "Group Join" as const;
}

function formatAmount(operation: HorizonOperation) {
  if (!operation.amount) return "N/A";
  return operation.amount;
}

function formatAsset(operation: HorizonOperation) {
  if (!operation.amount) return "N/A";
  if (operation.asset_type === "native") return "XLM";
  return operation.asset_code ?? "Token";
}

function mapOperationToHistoryItem(
  operation: HorizonOperation,
  address: string
): HistoryItem {
  return {
    id: operation.id,
    kind: getHistoryKind(operation, address),
    timestamp: operation.created_at,
    hash: operation.transaction_hash,
    amount: formatAmount(operation),
    asset: formatAsset(operation),
  };
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

function shortenHash(hash: string) {
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
}

export default function HistoryPage() {
  const { address, isConnected, connect, isFreighterAvailable } = useWallet();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const historyUrl = useMemo(() => {
    if (!address) return null;

    const url = new URL(`${HORIZON_URL}/accounts/${address}/operations`);
    url.searchParams.set("order", "desc");
    url.searchParams.set("limit", "50");
    url.searchParams.set("include_failed", "false");
    return url.toString();
  }, [address]);

  const loadHistory = useCallback(async () => {
    if (!historyUrl || !address) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(historyUrl);

      if (response.status === 404) {
        setItems([]);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to load transaction history.");
      }

      const data = (await response.json()) as HorizonOperationsResponse;
      const records = data._embedded?.records ?? [];

      setItems(
        records.map((record) => mapOperationToHistoryItem(record, address))
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load transaction history."
      );
    } finally {
      setIsLoading(false);
    }
  }, [address, historyUrl]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Transaction History
            </h1>
            <p className="text-gray-600 mt-1">
              Contributions, payouts, and group join activity from your Stellar
              wallet.
            </p>
          </div>

          {isConnected && (
            <button
              onClick={loadHistory}
              disabled={isLoading}
              className="self-start sm:self-auto bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-gray-300 transition-colors"
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          )}
        </div>

        {!isConnected ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Connect your wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect Freighter to load your recent SoroSave-related Stellar
              activity.
            </p>
            {isFreighterAvailable ? (
              <button
                onClick={connect}
                className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Connect Wallet
              </button>
            ) : (
              <a
                href="https://www.freighter.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
              >
                Install Freighter
              </a>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {error && (
              <div className="border-b bg-red-50 px-6 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {isLoading && items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Loading transaction history...
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No transactions found for this wallet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                        Transaction Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                            {item.kind}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                          {formatTimestamp(item.timestamp)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {item.amount} {item.asset}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <a
                            href={getExplorerUrl(item.hash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-primary-700 hover:text-primary-900"
                          >
                            {shortenHash(item.hash)}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
