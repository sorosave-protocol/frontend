"use client";

import { Navbar } from "@/components/Navbar";
import { MemberList } from "@/components/MemberList";
import { RoundProgress } from "@/components/RoundProgress";
import { ContributeModal } from "@/components/ContributeModal";
import { GroupAnalytics } from "@/components/GroupAnalytics";
import { useState } from "react";
import { formatAmount, GroupStatus } from "@/lib/sdk";

// TODO: Fetch real data from contract
const MOCK_GROUP = {
  id: 1,
  name: "Lagos Savings Circle",
  admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
  token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
  contributionAmount: 1000000000n,
  cycleLength: 604800,
  maxMembers: 5,
  members: [
    "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
    "GEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJ",
    "GIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMN",
  ],
  payoutOrder: [
    "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
    "GEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJ",
    "GIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMN",
  ],
  currentRound: 1,
  totalRounds: 3,
  status: GroupStatus.Active,
  createdAt: 1700000000,
};

export default function GroupDetailPage() {
  const [showContributeModal, setShowContributeModal] = useState(false);
  const group = MOCK_GROUP;

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
          <p className="text-gray-600 mt-1">
            {formatAmount(group.contributionAmount)} tokens per cycle
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RoundProgress
              currentRound={group.currentRound}
              totalRounds={group.totalRounds}
              contributionsReceived={1}
              totalMembers={group.members.length}
            />

            <MemberList
              members={group.members}
              admin={group.admin}
              payoutOrder={group.payoutOrder}
              currentRound={group.currentRound}
            />
            <GroupAnalytics />
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
