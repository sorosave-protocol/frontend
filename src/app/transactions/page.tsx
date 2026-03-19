"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/app/providers";
import {
  fetchAccountTransactions,
  ParsedTransaction,
  Network,
} from "@/lib/horizon";

const OPERATION_ICONS: Record<string, string> = {
  payment: "💸",
  invoke_host_function: "📜",
  create_account: "🆕",
  path_payment_strict_send: "🔀",
  path_payment_strict_receive: "🔀",
  change_trust: "🔗",
  account_merge: "🔄",
};

function operationIcon(type: string): string {
  return OPERATION_ICONS[type] ?? "⚡";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(amount?: string, assetCode?: string): string | null {
  if (!amount) return null;
  const num = parseFloat(amount);
  return `${num.toLocaleString(undefined, { maximumFractionDigits: 7 })} ${assetCode ?? "XLM"}`;
}

function shortenHash(hash: string): string {
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

function TransactionRow({ tx }: { tx: ParsedTransaction }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-lg" aria-hidden="true">
            {operationIcon(tx.type)}
          </span>
          <span className="font-medium text-gray-800">{tx.label}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDate(tx.createdAt)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatAmount(tx.amount, tx.assetCode) ?? (
          <span className="text-gray-400">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        <a
          href={tx.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-primary-600 hover:text-primary-800 hover:underline"
          title={tx.hash}
        >
          {shortenHash(tx.hash)}
        </a>
      </td>
    </tr>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 text-gray-500">
      <p className="text-4xl mb-4">📭</p>
      <p className="text-lg">{message}</p>
    </div>
  );
}

export default function TransactionsPage() {
  const { address, isConnected } = useWallet();
  const [network, setNetwork] = useState<Network>("testnet");
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursors, setCursors] = useState<string[]>([]); // stack of prev cursors
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const loadTransactions = useCallback(
    async (cursor?: string) => {
      if (!address) return;
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAccountTransactions(address, network, cursor);
        setTransactions(result.records);
        setNextCursor(result.nextCursor);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load transactions"
        );
      } finally {
        setLoading(false);
      }
    },
    [address, network]
  );

  // Reload when address or network changes
  useEffect(() => {
    setCursors([]);
    setNextCursor(null);
    setTransactions([]);
    if (address) loadTransactions();
  }, [address, network]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleNextPage() {
    if (!nextCursor) return;
    // Push current "first" marker onto stack so we can go back
    setCursors((prev) => [...prev, nextCursor]);
    loadTransactions(nextCursor);
  }

  function handlePrevPage() {
    if (cursors.length === 0) return;
    const newStack = cursors.slice(0, -1);
    const prevCursor = newStack[newStack.length - 1];
    setCursors(newStack);
    loadTransactions(prevCursor);
  }

  const isFirstPage = cursors.length === 0;
  const currentPage = cursors.length + 1;

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Transaction History
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              On-chain operations fetched from Stellar Horizon
            </p>
          </div>

          {/* Network selector */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="network-select"
              className="text-sm font-medium text-gray-700"
            >
              Network:
            </label>
            <select
              id="network-select"
              value={network}
              onChange={(e) => setNetwork(e.target.value as Network)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="testnet">Testnet</option>
              <option value="mainnet">Mainnet</option>
            </select>
          </div>
        </div>

        {/* Not connected */}
        {!isConnected && (
          <EmptyState message="Connect your Freighter wallet to view transaction history." />
        )}

        {/* Loading */}
        {isConnected && loading && (
          <div className="flex items-center justify-center py-16 text-gray-500 space-x-3">
            <svg
              className="animate-spin h-6 w-6 text-primary-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>Loading transactions…</span>
          </div>
        )}

        {/* Error */}
        {isConnected && !loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-medium">Error loading transactions</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => loadTransactions()}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {isConnected && !loading && !error && transactions.length === 0 && (
          <EmptyState message="No transactions found for this account." />
        )}

        {/* Table */}
        {isConnected && !loading && !error && transactions.length > 0 && (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">Page {currentPage}</p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrevPage}
                  disabled={isFirstPage}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={!nextCursor}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
