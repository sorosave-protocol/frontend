"use client";

import { Navbar } from "@/components/Navbar";

// Placeholder transaction data — will be replaced with contract queries
const PLACEHOLDER_TRANSACTIONS = [
  {
    id: "tx1",
    type: "contribution",
    hash: "5a7f9c3d2e1b4a6f8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
    timestamp: 1709500000,
    amount: 1000000000,
    token: "USDC",
    status: "success",
    groupName: "Lagos Savings Circle",
  },
  {
    id: "tx2",
    type: "payout",
    hash: "6b8g0h4e3f2c5b7a9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    timestamp: 1709400000,
    amount: 5000000000,
    token: "USDC",
    status: "success",
    groupName: "DeFi Builders Fund",
  },
  {
    id: "tx3",
    type: "group_join",
    hash: "7c9h1i5f4g3d6c8b0a1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
    timestamp: 1709300000,
    amount: 0,
    token: "-",
    status: "success",
    groupName: "Lagos Savings Circle",
  },
];

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: number, token: string): string {
  if (amount === 0) return "-";
  return `${(amount / 10000000).toFixed(2)} ${token}`;
}

function getTypeLabel(type: string): string {
  switch (type) {
    case "contribution":
      return "Contribution";
    case "payout":
      return "Payout";
    case "group_join":
      return "Group Join";
    default:
      return type;
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case "contribution":
      return "bg-blue-100 text-blue-800";
    case "payout":
      return "bg-green-100 text-green-800";
    case "group_join":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStellarExplorerLink(hash: string): string {
  return `https://stellar.expert/explorer/public/tx/${hash}`;
}

export default function HistoryPage() {
  // TODO: Replace with actual contract queries
  const transactions = PLACEHOLDER_TRANSACTIONS;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No transactions found.
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <li key={tx.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                            tx.type
                          )}`}
                        >
                          {getTypeLabel(tx.type)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {tx.groupName}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span>{formatTimestamp(tx.timestamp)}</span>
                        <span className="mx-2">•</span>
                        <span className="font-mono">
                          {tx.hash.slice(0, 12)}...{tx.hash.slice(-8)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatAmount(tx.amount, tx.token)}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {tx.status}
                        </p>
                      </div>
                      <a
                        href={getStellarExplorerLink(tx.hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                      >
                        View ↗
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </>
  );
}
