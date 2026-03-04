"use client";

import { Navbar } from "@/components/Navbar";
import Link from "next/link";

// Placeholder user data — will be replaced with contract queries
const PLACEHOLDER_USER_DASHBOARD = {
  address: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
  groups: [
    {
      id: 1,
      name: "Lagos Savings Circle",
      role: "member",
      contributionAmount: 1000000000,
      nextPayoutRound: 3,
      currentRound: 1,
      totalRounds: 5,
      status: "active",
      pendingContribution: true,
    },
    {
      id: 2,
      name: "DeFi Builders Fund",
      role: "admin",
      contributionAmount: 5000000000,
      nextPayoutRound: 1,
      currentRound: 2,
      totalRounds: 5,
      status: "active",
      pendingContribution: false,
    },
  ],
  stats: {
    totalContributed: 6000000000,
    totalReceived: 0,
    groupsJoined: 2,
    pendingActions: 1,
  },
};

function formatAmount(amount: number): string {
  return `$${(amount / 10000000).toFixed(2)}`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function DashboardPage() {
  // TODO: Replace with actual contract queries
  const dashboard = PLACEHOLDER_USER_DASHBOARD;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {dashboard.address.slice(0, 8)}...{dashboard.address.slice(-4)}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Contributed
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {formatAmount(dashboard.stats.totalContributed)}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Total Received
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {formatAmount(dashboard.stats.totalReceived)}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Groups Joined
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {dashboard.stats.groupsJoined}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Pending Actions
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-yellow-600">
                {dashboard.stats.pendingActions}
              </dd>
            </div>
          </div>
        </div>

        {/* Groups Section */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Groups</h2>
        {dashboard.groups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">You haven&apos;t joined any groups yet.</p>
            <Link
              href="/groups"
              className="text-primary-600 hover:text-primary-900 font-medium"
            >
              Browse Groups →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboard.groups.map((group) => (
              <div
                key={group.id}
                className="bg-white shadow rounded-lg p-6 border-l-4 border-primary-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {group.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      group.status
                    )}`}
                  >
                    {group.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Role:</span>
                    <span className="font-medium capitalize">{group.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contribution:</span>
                    <span className="font-medium">
                      {formatAmount(group.contributionAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Progress:</span>
                    <span className="font-medium">
                      Round {group.currentRound} / {group.totalRounds}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Next Payout:</span>
                    <span className="font-medium">
                      Round {group.nextPayoutRound}
                    </span>
                  </div>
                </div>

                {group.pendingContribution && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⚠️ Contribution Due
                    </span>
                  </div>
                )}

                <div className="mt-4">
                  <Link
                    href={`/groups/${group.id}`}
                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                  >
                    View Group →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
