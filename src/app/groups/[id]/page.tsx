"use client";

import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { MemberList } from "@/components/MemberList";
import { RoundProgress } from "@/components/RoundProgress";
import { ContributeModal } from "@/components/ContributeModal";
import { useGroupPolling } from "@/hooks/useGroupPolling";
import { useState } from "react";
import { formatAmount, GroupStatus } from "@sorosave/sdk";

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.id as string;
  const { group, isLoading, error, lastUpdated, isPolling, refresh } =
    useGroupPolling(groupId);
  const [showContributeModal, setShowContributeModal] = useState(false);

  if (isLoading && !group) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6 h-40" />
                <div className="bg-white rounded-xl shadow-sm border p-6 h-60" />
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6 h-60" />
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error && !group) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-700 font-medium">Failed to load group</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
            <button
              onClick={refresh}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
      </>
    );
  }

  if (!group) return null;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
            <p className="text-gray-600 mt-1">
              {formatAmount(group.contributionAmount)} tokens per cycle
            </p>
          </div>
          {error && (
            <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Using cached data — reconnecting...</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RoundProgress
              currentRound={group.currentRound}
              totalRounds={group.totalRounds}
              contributionsReceived={group.contributionsReceived}
              totalMembers={group.members.length}
              isPolling={isPolling}
              lastUpdated={lastUpdated}
            />

            <MemberList
              members={group.members}
              admin={group.admin}
              payoutOrder={group.payoutOrder}
              currentRound={group.currentRound}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-3">
                {group.status === GroupStatus.Active && (
                  <button
                    onClick={() => setShowContributeModal(true)}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Contribute
                  </button>
                )}
                {group.status === GroupStatus.Forming && (
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Join Group
                  </button>
                )}
                <button
                  onClick={refresh}
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Refresh Now
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Group Info
              </h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Status</dt>
                  <dd className="font-medium text-gray-900">{group.status}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Members</dt>
                  <dd className="font-medium text-gray-900">
                    {group.members.length}/{group.maxMembers}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Cycle</dt>
                  <dd className="font-medium text-gray-900">
                    {group.cycleLength / 86400} days
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Pot Size</dt>
                  <dd className="font-medium text-gray-900">
                    {formatAmount(
                      group.contributionAmount * BigInt(group.members.length)
                    )}{" "}
                    tokens
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>

      <ContributeModal
        groupId={group.id}
        contributionAmount={group.contributionAmount}
        isOpen={showContributeModal}
        onClose={() => setShowContributeModal(false)}
      />
    </>
  );
}
