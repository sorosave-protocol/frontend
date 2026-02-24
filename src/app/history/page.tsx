"use client";

import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/app/providers";
import { formatAmount } from "@/lib/sdk";
import Link from "next/link";

type TxType = "contribution" | "payout" | "join";

interface Transaction {
  id: string;
  type: TxType;
  groupName: string;
  groupId: number;
  amount: bigint;
  hash: string;
  timestamp: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", type: "payout", groupName: "Lagos Savings Circle", groupId: 1, amount: 5000000000n, hash: "abc123def456abc123def456abc123def456abc123def456abc123def456ab12", timestamp: 1708700000 },
  { id: "2", type: "contribution", groupName: "DeFi Builders Fund", groupId: 2, amount: 5000000000n, hash: "fed654cba321fed654cba321fed654cba321fed654cba321fed654cba321fe34", timestamp: 1708600000 },
  { id: "3", type: "contribution", groupName: "Lagos Savings Circle", groupId: 1, amount: 1000000000n, hash: "111aaa222bbb333ccc444ddd555eee666fff777888999000aaabbbccc111222dd", timestamp: 1708000000 },
  { id: "4", type: "join", groupName: "DeFi Builders Fund", groupId: 2, amount: 0n, hash: "999zzz888yyy777xxx666www555vvv444uuu333ttt222sss111rrr000qqq9988zz", timestamp: 1707900000 },
  { id: "5", type: "contribution", groupName: "Lagos Savings Circle", groupId: 1, amount: 1000000000n, hash: "deadbeef1234567890abcdef1234567890abcdef1234567890abcdef12345678", timestamp: 1707300000 },
  { id: "6", type: "join", groupName: "Lagos Savings Circle", groupId: 1, amount: 0n, hash: "cafebabe0987654321fedcba0987654321fedcba0987654321fedcba09876543", timestamp: 1707000000 },
];

const TX_META: Record<TxType, { label: string; icon: string; color: string; amountPrefix: string }> = {
  contribution: { label: "Contribution", icon: "⬆️", color: "text-red-600 dark:text-red-400", amountPrefix: "−" },
  payout:       { label: "Payout",       icon: "⬇️", color: "text-green-600 dark:text-green-400", amountPrefix: "+" },
  join:         { label: "Joined Group", icon: "🤝", color: "text-blue-600 dark:text-blue-400",  amountPrefix: "" },
};

function formatDate(ts: number) {
  return new Date(ts * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function shortHash(hash: string) {
  return `${hash.slice(0, 6)}…${hash.slice(-6)}`;
}

export default function TransactionHistoryPage() {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Connect your wallet</h1>
          <p className="text-gray-500 dark:text-gray-400">Connect a wallet to view your transaction history.</p>
        </main>
      </>
    );
  }

  const totalIn = MOCK_TRANSACTIONS.filter(t => t.type === "payout").reduce((s, t) => s + t.amount, 0n);
  const totalOut = MOCK_TRANSACTIONS.filter(t => t.type === "contribution").reduce((s, t) => s + t.amount, 0n);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Transaction History</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">All on-chain activity for your wallet.</p>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-xs text-green-700 dark:text-green-400 mb-1">Total Received</p>
            <p className="text-xl font-bold text-green-800 dark:text-green-300">+{formatAmount(totalIn)} <span className="text-sm font-normal">tokens</span></p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-xs text-red-700 dark:text-red-400 mb-1">Total Contributed</p>
            <p className="text-xl font-bold text-red-800 dark:text-red-300">−{formatAmount(totalOut)} <span className="text-sm font-normal">tokens</span></p>
          </div>
        </div>

        {/* Transactions */}
        <div className="space-y-2">
          {MOCK_TRANSACTIONS.map(tx => {
            const meta = TX_META[tx.type];
            return (
              <div key={tx.id} className="flex items-center justify-between bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl px-4 py-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{meta.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {meta.label} &middot; <Link href={`/groups/${tx.groupId}`} className="text-primary-600 hover:underline">{tx.groupName}</Link>
                    </p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-primary-600 font-mono"
                      >
                        {shortHash(tx.hash)}↗
                      </a>
                      <span className="text-xs text-gray-400">{formatDate(tx.timestamp)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {tx.amount > 0n && (
                    <p className={`text-sm font-semibold ${meta.color}`}>
                      {meta.amountPrefix}{formatAmount(tx.amount)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">{tx.type === "join" ? "Group joined" : "tokens"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
