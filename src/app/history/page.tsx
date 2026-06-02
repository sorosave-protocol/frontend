"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/app/providers";

interface Transaction {
  id: string;
  hash: string;
  timestamp: string;
  type: "Contribution" | "Payout" | "Group Join" | "Stellar Payment" | "Contract Invocation" | "Unknown";
  amount?: string;
  successful: boolean;
  memo?: string;
}

export default function HistoryPage() {
  const { address, isConnected } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useDemoData, setUseDemoData] = useState(false);

  // SoroSave specific mock/demo transactions
  const demoTransactions: Transaction[] = [
    {
      id: "1",
      hash: "7f7112ea1bc8328131e5fb5958619d854e4889c1682390a1e5cb5958619d854e",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      type: "Contribution",
      amount: "50 XLM",
      successful: true,
      memo: "SoroSave Contribution - Cycle 2",
    },
    {
      id: "2",
      hash: "82ea1bc8328131e5fb5958619d854e4889c1682390a1e5cb5958619d854e7f711",
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      type: "Group Join",
      amount: "10 XLM",
      successful: true,
      memo: "SoroSave Join - Chit Fund Alpha",
    },
    {
      id: "3",
      hash: "31e5fb5958619d854e4889c1682390a1e5cb5958619d854e7f71182ea1bc8328",
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
      type: "Payout",
      amount: "300 XLM",
      successful: true,
      memo: "SoroSave Payout - Cycle 1 Winner",
    },
  ];

  useEffect(() => {
    if (!isConnected || !address || useDemoData) {
      if (useDemoData) {
        setTransactions(demoTransactions);
      } else {
        setTransactions([]);
      }
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://horizon-testnet.stellar.org/accounts/${address}/transactions?order=desc&limit=20`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transaction history from Horizon.");
        }
        const data = await response.json();
        const records = data._embedded.records;

        const parsedTxs: Transaction[] = records.map((record: any) => {
          let type: Transaction["type"] = "Contract Invocation";
          let amount = undefined;

          // Parse transaction details
          if (record.memo) {
            if (record.memo.toLowerCase().includes("contribution")) {
              type = "Contribution";
            } else if (record.memo.toLowerCase().includes("payout")) {
              type = "Payout";
            } else if (record.memo.toLowerCase().includes("join")) {
              type = "Group Join";
            }
          }

          // Format timestamp
          const timestamp = record.created_at;

          return {
            id: record.id,
            hash: record.hash,
            timestamp,
            type,
            amount,
            successful: record.successful,
            memo: record.memo,
          };
        });

        setTransactions(parsedTxs);
      } catch (err: any) {
        console.error("Error fetching transactions:", err);
        setError("Could not retrieve live on-chain history. Showing demo transactions instead.");
        setTransactions(demoTransactions);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [address, isConnected, useDemoData]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
              Transaction History
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Review your on-chain interactions, contributions, and SoroSave payouts.
            </p>
          </div>
          {isConnected && (
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                type="button"
                onClick={() => setUseDemoData(!useDemoData)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                {useDemoData ? "Show Live History" : "Show Demo SoroSave Data"}
              </button>
            </div>
          )}
        </div>

        {!isConnected ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Wallet not connected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Please connect your Freighter wallet in the navigation bar to view your transaction history.
            </p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : error && transactions.length === 0 ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              This account does not have any transactions on Stellar Testnet yet. You can toggled the "Show Demo SoroSave Data" button above to view sample transactions.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <li key={tx.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.type === "Payout"
                              ? "bg-green-100 text-green-800"
                              : tx.type === "Contribution"
                              ? "bg-blue-100 text-blue-800"
                              : tx.type === "Group Join"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tx.type}
                        </span>
                        <p className="text-sm font-semibold text-gray-900">
                          {tx.memo || "Transaction"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {tx.amount && (
                          <span className="text-sm font-bold text-gray-900">
                            {tx.amount}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            tx.successful
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {tx.successful ? "Success" : "Failed"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between items-center">
                      <div className="sm:flex">
                        <p className="flex items-center text-xs text-gray-500 font-mono">
                          Hash:{" "}
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-800 underline ml-1"
                          >
                            {tx.hash.substring(0, 16)}...{tx.hash.substring(tx.hash.length - 16)}
                          </a>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-xs text-gray-500 sm:mt-0">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p>{new Date(tx.timestamp).toLocaleString()}</p>
                      </div>
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
