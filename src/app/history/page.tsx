"use client";

import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/app/providers";

// Placeholder transaction data - will be replaced with contract queries
type TransactionType = "contribution" | "payout" | "group_join";

interface Transaction {
  id: string;
  type: TransactionType;
  hash: string;
  timestamp: number;
  amount: number;
  groupName?: string;
}

const PLACEHOLDER_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "contribution",
    hash: "abc123def456",
    timestamp: 1700000000,
    amount: 1000000000,
    groupName: "Lagos Savings Circle",
  },
  {
    id: "2",
    type: "group_join",
    hash: "xyz789uvw012",
    timestamp: 1699000000,
    amount: 0,
    groupName: "DeFi Builders Fund",
  },
  {
    id: "3",
    type: "payout",
    hash: "pqr345stu678",
    timestamp: 1698000000,
    amount: 5000000000,
    groupName: "Lagos Savings Circle",
  },
];

export default function HistoryPage() {
  const { address, isConnected } = useWallet();

  // TODO: Replace with actual contract queries when backend is ready
  const transactions = PLACEHOLDER_TRANSACTIONS;

  const formatAmount = (amount: number) => {
    return (amount / 10000000).toFixed(2);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getTypeLabel = (type: TransactionType) => {
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
  };

  const getTypeColor = (type: TransactionType) => {
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
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        </div>

        {!isConnected ? (
          <div className="text-center py-12 text-gray-500">
            Please connect your wallet to view transaction history.
          </div>
        ) : transactions.length === 0 ? (
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
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                            tx.type
                          )}`}
                        >
                          {getTypeLabel(tx.type)}
                        </span>
                        {tx.groupName && (
                          <span className="text-sm text-gray-500">
                            {tx.groupName}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <span className="truncate">
                          Hash: {tx.hash}
                        </span>
                        <span className="ml-2">•</span>
                        <span className="ml-2">
                          {formatDate(tx.timestamp)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {tx.amount > 0 && (
                        <span className="text-lg font-medium text-gray-900">
                          {formatAmount(tx.amount)} XLM
                        </span>
                      )}
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 text-primary-600 hover:text-primary-900 text-sm"
                      >
                        View in Explorer →
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
