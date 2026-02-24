"use client";

import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/app/providers";
import Link from "next/link";
import { SavingsGroup, GroupStatus, formatAmount, shortenAddress } from "@/lib/sdk";

// Mock data — replace with contract queries once SDK is wired
const MOCK_MY_GROUPS: SavingsGroup[] = [
  {
    id: 1,
    name: "Lagos Savings Circle",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 1000000000n,
    cycleLength: 604800,
    maxMembers: 5,
    members: ["GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG", "GEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJ"],
    payoutOrder: ["GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG", "GEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJ"],
    currentRound: 1,
    totalRounds: 5,
    status: GroupStatus.Active,
    createdAt: 1700000000,
  },
  {
    id: 2,
    name: "DeFi Builders Fund",
    admin: "GEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJ",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 5000000000n,
    cycleLength: 2592000,
    maxMembers: 10,
    members: ["GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG", "GEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJ", "GIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMN"],
    payoutOrder: ["GEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJ", "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG"],
    currentRound: 2,
    totalRounds: 10,
    status: GroupStatus.Active,
    createdAt: 1699000000,
  },
  {
    id: 3,
    name: "Weekend Fund",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 500000000n,
    cycleLength: 86400,
    maxMembers: 4,
    members: ["GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG"],
    payoutOrder: [],
    currentRound: 0,
    totalRounds: 0,
    status: GroupStatus.Forming,
    createdAt: 1701000000,
  },
];

const MOCK_STATS = {
  totalContributed: 15000000000n,
  totalReceived: 5000000000n,
  pendingPayout: {
    groupName: "Lagos Savings Circle",
    round: 3,
    amount: 5000000000n,
    estimatedDate: "Mar 14, 2026",
  },
};

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-6">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function GroupRow({ group }: { group: SavingsGroup }) {
  const needsContribution = group.status === GroupStatus.Active;
  const isNextPayout = group.payoutOrder[group.currentRound] === group.members[0];

  return (
    <Link href={`/groups/${group.id}`}>
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center space-x-4">
          <div className={`w-2 h-10 rounded-full ${
            group.status === GroupStatus.Active ? "bg-green-500" :
            group.status === GroupStatus.Forming ? "bg-blue-500" :
            group.status === GroupStatus.Completed ? "bg-gray-400" : "bg-red-500"
          }`} />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">{group.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Round {group.currentRound}/{group.totalRounds || group.maxMembers} · {group.members.length}/{group.maxMembers} members
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isNextPayout && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full font-medium">
              🎉 Your turn next
            </span>
          )}
          {needsContribution && (
            <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded-full font-medium">
              Contribute due
            </span>
          )}
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {formatAmount(group.contributionAmount)} <span className="text-gray-400">tokens</span>
            </p>
            <p className="text-xs text-gray-400">{group.cycleLength >= 2592000 ? "monthly" : group.cycleLength >= 604800 ? "weekly" : "daily"}</p>
          </div>
          <span className="text-gray-400">›</span>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { address, isConnected } = useWallet();

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Connect your wallet</h1>
          <p className="text-gray-500 dark:text-gray-400">Connect a Stellar wallet to view your dashboard.</p>
        </main>
      </>
    );
  }

  const activeGroups = MOCK_MY_GROUPS.filter(g => g.status === GroupStatus.Active);
  const formingGroups = MOCK_MY_GROUPS.filter(g => g.status === GroupStatus.Forming);
  const completedGroups = MOCK_MY_GROUPS.filter(g => g.status === GroupStatus.Completed);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">{address && shortenAddress(address, 8)}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Contributed"
            value={`${formatAmount(MOCK_STATS.totalContributed)} tokens`}
            sub="across all groups"
          />
          <StatCard
            label="Total Received"
            value={`${formatAmount(MOCK_STATS.totalReceived)} tokens`}
            sub="from payouts"
          />
          <StatCard
            label="Active Groups"
            value={String(activeGroups.length)}
            sub={`${formingGroups.length} forming`}
          />
          <StatCard
            label="Next Payout"
            value={MOCK_STATS.pendingPayout.estimatedDate}
            sub={`${MOCK_STATS.pendingPayout.groupName} · Round ${MOCK_STATS.pendingPayout.round}`}
          />
        </div>

        {/* Needs Action */}
        {activeGroups.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">⚡ Needs Contribution</h2>
              <span className="text-xs text-gray-400">{activeGroups.length} active</span>
            </div>
            <div className="space-y-3">
              {activeGroups.map(g => <GroupRow key={g.id} group={g} />)}
            </div>
          </section>
        )}

        {/* Forming */}
        {formingGroups.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">🕐 Forming</h2>
              <span className="text-xs text-gray-400">waiting for members</span>
            </div>
            <div className="space-y-3">
              {formingGroups.map(g => <GroupRow key={g.id} group={g} />)}
            </div>
          </section>
        )}

        {/* Completed */}
        {completedGroups.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">✅ Completed</h2>
            <div className="space-y-3">
              {completedGroups.map(g => <GroupRow key={g.id} group={g} />)}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-10 flex space-x-4">
          <Link href="/groups" className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors text-sm">
            Browse Groups
          </Link>
          <Link href="/groups/new" className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm">
            Create Group
          </Link>
        </div>
      </main>
    </>
  );
}
