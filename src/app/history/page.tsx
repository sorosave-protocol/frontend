"use client";

import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/app/providers";
import { useState, useEffect } from "react";

// Transaction types
interface Transaction {
  hash: string;
  type: "contribution" | "payout" | "group_join";
  amount: string;
  timestamp: number;
  memo?: string;
  explorerUrl: string;
}

export default function HistoryPage() {
  const { isConnected, address } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        // Fetch transactions from Stellar testnet
        const resp = await fetch(
          `https://soroban-testnet.stellar.org/events?address=${address}&types=operation&cursor=&limit=50`
        );

        if (!resp.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await resp.json();

        // Transform Soroban events into our Transaction type
        const txns: Transaction[] = data.items
          .filter((item: any) => item.type === "operation")
          .slice(0, 30)
          .map((item: any) => ({
            hash: item.id || "unknown",
            type: mapTransactionType(item),
            amount: formatAmount(item),
            timestamp: extractTimestamp(item),
            memo: item.body?.value || "",
            explorerUrl: getExplorerUrl(item),
          }));

        setTransactions(txns);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isConnected, address]);

  if (!isConnected || !address) {
    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Connect Wallet to View History</h1>
            <p className="text-gray-400">
              You need to connect your Stellar wallet to view your transaction history.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          <span className="ml-4 text-gray-400">Loading transactions...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-900/30 border border-red-800 rounded-lg p-4">
            <p className="text-red-400">Error loading transactions: {error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
        <p className="text-gray-400 mb-8">
          Wallet: <span className="font-mono text-sm">{truncateAddress(address)}</span>
        </p>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No transactions found for this wallet.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <TransactionCard key={tx.hash} tx={tx} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// Helper: map Soroban event type to our transaction type
function mapTransactionType(item: any): Transaction["type"] {
  const body = item.body?.value || "";
  if (typeof body === "string" && body.includes("contribute")) return "contribution";
  if (typeof body === "string" && body.includes("payout")) return "payout";
  return "group_join";
}

// Helper: format amount
function formatAmount(item: any): string {
  const body = item.body?.value || "";
  if (typeof body === "string") {
    const match = body.match(/\d+/);
    if (match) {
      const amount = parseInt(match[0]);
      return `${(amount / 10000000).toFixed(7)} XLM`;
    }
  }
  return "0 XLM";
}

// Helper: extract timestamp
function extractTimestamp(item: any): number {
  return Math.floor((item.id || "").match(/(\d+)/)?.[0] || Date.now() / 1000);
}

// Helper: get Stellar explorer URL
function getExplorerUrl(item: any): string {
  return `https://stellar.expert/explorer/testnet/tx/${item.id || ""}`;
}

// Helper: truncate address
function truncateAddress(address: string): string {
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}

// Transaction card component
function TransactionCard({ tx }: { tx: Transaction }) {
  const icon = getTransactionIcon(tx.type);
  const timeAgo = getTimeAgo(tx.timestamp);

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750 transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <div className="font-medium capitalize">{tx.type.replace("_", " ")}</div>
          <div className="text-sm text-gray-400 font-mono">{truncateAddress(tx.hash)}</div>
          <div className="text-xs text-gray-500">{timeAgo}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-green-400">{tx.amount}</div>
        <a
          href={tx.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300"
        >
          View on Explorer →
        </a>
      </div>
    </div>
  );
}

function getTransactionIcon(type: Transaction["type"]): string {
  switch (type) {
    case "contribution":
      return "📥";
    case "payout":
      return "📤";
    case "group_join":
      return "👥";
    default:
      return "🔄";
  }
}

function getTimeAgo(timestamp: number): string {
  if (!timestamp || timestamp === 0) return "Recently";
  const seconds = Math.floor((Date.now() / 1000 - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
