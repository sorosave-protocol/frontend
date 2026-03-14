"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/app/providers";
import { SavingsGroup, GroupStatus, formatAmount, getStatusLabel } from "@sorosave/sdk";

// Placeholder data — will be replaced with contract queries filtered by connected wallet
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
  {
    id: 3,
    name: "Community Savers",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 2000000000n,
    cycleLength: 1209600,
    maxMembers: 8,
    members: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP...", "GQRST...", "GUVWX...", "GYZA1...", "GBC23..."],
    payoutOrder: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP...", "GQRST...", "GUVWX...", "GYZA1...", "GBC23..."],
    currentRound: 6,
    totalRounds: 8,
    status: GroupStatus.Active,
    createdAt: 1695000000,
  },
];

const statusColors: Record<string, string> = {
  Forming: "bg-blue-100 text-blue-800",
  Active: "bg-green-100 text-green-800",
  Completed: "bg-gray-100 text-gray-800",
  Disputed: "bg-red-100 text-red-800",
  Paused: "bg-yellow-100 text-yellow-800",
};

function formatCycleLength(seconds: number): string {
  if (seconds >= 2592000) return `${Math.round(seconds / 2592000)} month(s)`;
  if (seconds >= 604800) return `${Math.round(seconds / 604800)} week(s)`;
  if (seconds >= 86400) return `${Math.round(seconds / 86400)} day(s)`;
  return `${seconds} seconds`;
}

function needsContribution(group: SavingsGroup): boolean {
  return group.status === GroupStatus.Active && group.currentRound < group.totalRounds;
}

function getNextPayoutInfo(group: SavingsGroup): string | null {
  if (group.status !== GroupStatus.Active || group.payoutOrder.length === 0) return null;
  const nextRecipientIndex = group.currentRound;
  if (nextRecipientIndex >= group.payoutOrder.length) return null;
  const recipient = group.payoutOrder[nextRecipientIndex];
  const truncated = `${recipient.slice(0, 6)}...${recipient.slice(-4)}`;
  return `Round ${group.currentRound + 1}: ${truncated}`;
}

export default function DashboardPage() {
  const { address, isConnected } = useWallet();
  const [groups, setGroups] = useState<SavingsGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual contract query filtered by connected wallet address
    // e.g., sorosaveClient.getGroupsByMember(address)
    const timer = setTimeout(() => {
      setGroups(PLACEHOLDER_GROUPS);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [address]);

  // Calculate summary stats
  const totalContributed = groups.reduce((sum, g) => {
    if (g.status === GroupStatus.Active || g.status === GroupStatus.Completed) {
      return sum + g.contributionAmount * BigInt(Math.min(g.currentRound, g.totalRounds));
    }
    return sum;
  }, 0n);

  const totalReceived = groups.reduce((sum, g) => {
    // Simplified: assume user received payout once if currentRound > their position
    if (g.status === GroupStatus.Active || g.status === GroupStatus.Completed) {
      const potAmount = g.contributionAmount * BigInt(g.members.length);
      // Placeholder: assume received 1 payout per completed group
      if (g.status === GroupStatus.Completed) return sum + potAmount;
    }
    return sum;
  }, 0n);

  const groupsNeedingAction = groups.filter(needsContribution);
  const activeGroups = groups.filter((g) => g.status === GroupStatus.Active);
  const formingGroups = groups.filter((g) => g.status === GroupStatus.Forming);

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-6">
              <svg
                className="w-8 h-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Connect your Freighter wallet to view your savings groups,
              contributions, and upcoming payouts.
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
        {/* Header */}
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500 mb-1">My Groups</p>
            <p className="text-3xl font-bold text-gray-900">{groups.length}</p>
            <p className="text-xs text-gray-400 mt-1">
              {activeGroups.length} active · {formingGroups.length} forming
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500 mb-1">Total Contributed</p>
            <p className="text-3xl font-bold text-primary-700">
              {formatAmount(totalContributed)}
            </p>
            <p className="text-xs text-gray-400 mt-1">tokens</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500 mb-1">Total Received</p>
            <p className="text-3xl font-bold text-green-600">
              {formatAmount(totalReceived)}
            </p>
            <p className="text-xs text-gray-400 mt-1">tokens</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-sm text-gray-500 mb-1">Needs Contribution</p>
            <p className="text-3xl font-bold text-amber-600">
              {groupsNeedingAction.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {groupsNeedingAction.length > 0 ? "action required" : "all caught up"}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            <p className="text-gray-500 mt-4">Loading your groups...</p>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No groups yet
            </h3>
            <p className="text-gray-500 mb-6">
              Join an existing savings group or create your own to get started.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/groups"
                className="bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Browse Groups
              </Link>
              <Link
                href="/groups/new"
                className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Create Group
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Groups Needing Contribution */}
            {groupsNeedingAction.length > 0 && (
              <div className="mb-10">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-2" />
                  Needs Your Contribution
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupsNeedingAction.map((group) => (
                    <Link key={group.id} href={`/groups/${group.id}`}>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {group.name}
                          </h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Action Required
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Contribution</span>
                            <span className="font-medium text-gray-900">
                              {formatAmount(group.contributionAmount)} tokens
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Round</span>
                            <span className="font-medium text-gray-900">
                              {group.currentRound} / {group.totalRounds}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Cycle</span>
                            <span className="font-medium text-gray-900">
                              {formatCycleLength(group.cycleLength)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Groups */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                All My Groups
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => {
                  const payoutInfo = getNextPayoutInfo(group);
                  return (
                    <Link key={group.id} href={`/groups/${group.id}`}>
                      <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {group.name}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              statusColors[group.status] || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {getStatusLabel(group.status)}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Contribution</span>
                            <span className="font-medium text-gray-900">
                              {formatAmount(group.contributionAmount)} tokens
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Members</span>
                            <span className="font-medium text-gray-900">
                              {group.members.length} / {group.maxMembers}
                            </span>
                          </div>
                          {group.totalRounds > 0 && (
                            <div className="flex justify-between">
                              <span>Progress</span>
                              <span className="font-medium text-gray-900">
                                {group.currentRound} / {group.totalRounds} rounds
                              </span>
                            </div>
                          )}
                          {group.totalRounds > 0 && (
                            <div className="mt-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-primary-600 h-2 rounded-full transition-all"
                                  style={{
                                    width: `${(group.currentRound / group.totalRounds) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          {payoutInfo && (
                            <div className="flex justify-between pt-2 border-t mt-2">
                              <span>Next Payout</span>
                              <span className="font-medium text-primary-700">
                                {payoutInfo}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
