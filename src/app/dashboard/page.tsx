"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GroupCard } from "@/components/GroupCard";
import { useWallet } from "@/app/providers";
import { SavingsGroup, GroupStatus, formatAmount } from "@sorosave/sdk";

// Placeholder data - will be replaced with contract queries filtered by connected wallet
const PLACEHOLDER_GROUPS: SavingsGroup[] = [
  {
    id: 1,
    name: "Lagos Savings Circle",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 1000000000n,
    cycleLength: 604800,
    maxMembers: 5,
    members: ["GABCD...", "GEFGH...", "GIJKL..."],
    payoutOrder: [],
    currentRound: 0,
    totalRounds: 0,
    status: GroupStatus.Forming,
    createdAt: 1700000000,
  },
  {
    id: 2,
    name: "DeFi Builders Fund",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 5000000000n,
    cycleLength: 2592000,
    maxMembers: 10,
    members: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP...", "GQRST..."],
    payoutOrder: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP...", "GQRST..."],
    currentRound: 2,
    totalRounds: 5,
    status: GroupStatus.Active,
    createdAt: 1699000000,
  },
];

function needsContribution(group: SavingsGroup): boolean {
  return group.status === GroupStatus.Active && group.currentRound < group.totalRounds;
}

function StatCard({ label, value, sub, color = "text-gray-900" }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { address, isConnected } = useWallet();
  const [groups, setGroups] = useState<SavingsGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with sorosaveClient.getGroupsByMember(address)
    const timer = setTimeout(() => {
      setGroups(PLACEHOLDER_GROUPS);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [address]);

  const activeGroups = groups.filter((g) => g.status === GroupStatus.Active);
  const actionGroups = groups.filter(needsContribution);

  const totalContributed = groups.reduce((sum, g) => {
    const rounds = BigInt(Math.min(g.currentRound, g.totalRounds));
    return sum + g.contributionAmount * rounds;
  }, 0n);

  const totalReceived = groups.reduce((sum, g) => {
    if (g.payoutOrder.length === 0 || g.currentRound === 0) return sum;
    // User receives pot once when it's their turn; simplified as 1 payout per active/completed group
    const pot = g.contributionAmount * BigInt(g.members.length);
    return g.currentRound > 0 ? sum + pot : sum;
  }, 0n);

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Connect your Freighter wallet to view your savings groups, contributions, and upcoming payouts.
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : ""}
            </p>
          </div>
          <Link
            href="/groups"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Browse Groups
          </Link>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="My Groups" value={String(groups.length)}
            sub={`${activeGroups.length} active`} />
          <StatCard label="Total Contributed" value={formatAmount(totalContributed)}
            sub="tokens" color="text-primary-700" />
          <StatCard label="Total Received" value={formatAmount(totalReceived)}
            sub="tokens" color="text-green-600" />
          <StatCard label="Needs Contribution" value={String(actionGroups.length)}
            sub={actionGroups.length > 0 ? "action required" : "all caught up"}
            color="text-amber-600" />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            <p className="text-gray-500 mt-4">Loading your groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
            <p className="text-gray-500 mb-6">Join or create a savings group to get started.</p>
            <div className="flex justify-center space-x-4">
              <Link href="/groups" className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700">
                Browse Groups
              </Link>
              <Link href="/groups/new" className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                Create Group
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Groups needing contribution */}
            {actionGroups.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
                  Needs Your Contribution
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {actionGroups.map((g) => (
                    <div key={g.id} className="ring-2 ring-amber-300 rounded-xl">
                      <GroupCard group={g} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All groups */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">All My Groups</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((g) => (
                  <GroupCard key={g.id} group={g} />
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
