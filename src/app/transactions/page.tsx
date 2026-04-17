"use client";

import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import {
  fetchTransactions,
  ParsedTransaction,
  TransactionPage,
} from "@/lib/horizon";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function truncateAddress(addr: string, chars = 6): string {
  if (addr.length <= chars * 2 + 3) return addr;
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

function getOperationLabel(type: string): string {
  switch (type) {
    case "payment":
      return "Payment";
    case "create_account":
      return "Create Account";
    case "invoke_host_function":
      return "Contract Invoke";
    case "manage_sell_offer":
      return "Manage Offer";
    case "change_trust":
      return "Change Trust";
    default:
      return type.replace(/_/g, " ");
  }
}

function getOperationColor(type: string): string {
  switch (type) {
    case "payment":
      return "bg-green-100 text-green-800";
    case "invoke_host_function":
      return "bg-purple-100 text-purple-800";
    case "create_account":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function OperationBadge({ type }: { type: string }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOperationColor(
        type
      )}`}
    >
      {getOperationLabel(type)}
    </span>
  );
}

function TransactionRow({ tx }: { tx: ParsedTransaction }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <div className="px-4 py-4 sm:px-6">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                tx.successful ? "bg-green-500" : "bg-red-500"
              }`}
              title={tx.successful ? "Successful" : "Failed"}
            />
            <span className="text-sm font-medium text-gray-900 font-mono">
              {truncateAddress(tx.hash, 8)}
            </span>
          </div>
          <span className="text-sm text-gray-500">{formatDate(tx.createdAt)}</span>
        </div>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span>
            Source:{" "}
            <span className="font-mono">{truncateAddress(tx.sourceAccount)}</span>
          </span>
          <span>Ledger #{tx.ledger}</span>
          {tx.memo && <span>Memo: {tx.memo}</span>}
        </div>

        {/* Operations */}
        {tx.operations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tx.operations.map((op) => (
              <div
                key={op.id}
                className="flex items-center space-x-2 text-sm"
              >
                <OperationBadge type={op.type} />
                {op.type === "payment" && (
                  <span className="text-gray-600">
                    {op.amount}{" "}
                    {op.asset_type === "native" ? "XLM" : op.asset_code}
                    {" → "}
                    <span className="font-mono">
                      {truncateAddress(op.to ?? "", 4)}
                    </span>
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TransactionsPage() {
  const [page, setPage] = useState<TransactionPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);

  const loadPage = useCallback(async (cursorVal: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactions(cursorVal, 10, "desc");
      setPage(data);
      setCursor(cursorVal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(null);
  }, [loadPage]);

  const handleNext = () => {
    if (page?.nextCursor) {
      setCursorStack((prev) => [...prev, page.nextCursor]);
      loadPage(page.nextCursor);
    }
  };

  const handlePrev = () => {
    if (cursorStack.length > 1) {
      const stack = [...cursorStack];
      stack.pop();
      const prevCursor = stack[stack.length - 1];
      setCursorStack(stack);
      loadPage(prevCursor);
    }
  };

  const handleRefresh = () => {
    setCursorStack([null]);
    loadPage(null);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Transaction History
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              On-chain transactions from Stellar Horizon
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <svg
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !page && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="px-4 py-4 border-b border-gray-100 last:border-0 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    <div className="h-4 w-40 bg-gray-200 rounded" />
                  </div>
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </div>
                <div className="mt-2 flex gap-3">
                  <div className="h-3 w-28 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transaction list */}
        {page && page.transactions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {page.transactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {page && page.transactions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              No transactions found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no transactions for this account yet.
            </p>
          </div>
        )}

        {/* Pagination */}
        {page && page.transactions.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={loading || cursorStack.length <= 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <span className="text-sm text-gray-500">
              Page {cursorStack.length}
            </span>

            <button
              onClick={handleNext}
              disabled={loading || !page.nextCursor}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </main>
    </>
  );
}
