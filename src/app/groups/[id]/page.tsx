"use client";

import { Navbar } from "@/components/Navbar";
import { MemberList } from "@/components/MemberList";
import { RoundProgress } from "@/components/RoundProgress";
import { ContributeModal } from "@/components/ContributeModal";
import { useState } from "react";
import { formatAmount, GroupStatus } from "@sorosave/sdk";
import { exportContributionsCSV, exportGroupSummaryPDF, ContributionRecord } from "@/lib/export";

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

// Placeholder contribution history — will be fetched from contract/indexer
const MOCK_CONTRIBUTIONS: ContributionRecord[] = [
  {
    date: "2024-01-15",
    member: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
    amount: "1000",
    round: 1,
    status: "paid",
    txHash: "abc123def456789",
  },
  {
    date: "2024-01-15",
    member: "GEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJ",
    amount: "1000",
    round: 1,
    status: "paid",
    txHash: "def789ghi012345",
  },
  {
    date: "2024-01-15",
    member: "GIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMN",
    amount: "1000",
    round: 1,
    status: "pending",
  },
];

export default function GroupDetailPage() {
  const [showContributeModal, setShowContributeModal] = useState(false);
  const group = MOCK_GROUP;
  const contributions = MOCK_CONTRIBUTIONS;

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
                  onClick={() => exportContributionsCSV(group, contributions)}
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => exportGroupSummaryPDF(group, contributions)}
                  className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Export PDF
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
