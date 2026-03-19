"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GroupCard } from "@/components/GroupCard";
import { GroupCompare } from "@/components/GroupCompare";
import { SavingsGroup, GroupStatus } from "@sorosave/sdk";

// Placeholder data for development — will be replaced with contract queries
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

const MAX_COMPARE = 3;

export default function GroupsPage() {
  // TODO: Replace with actual contract queries
  const groups = PLACEHOLDER_GROUPS;

  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  function handleCompareToggle(group: SavingsGroup) {
    setCompareIds((prev) =>
      prev.includes(group.id)
        ? prev.filter((id) => id !== group.id)
        : prev.length < MAX_COMPARE
        ? [...prev, group.id]
        : prev
    );
  }

  function handleRemoveFromCompare(id: number) {
    setCompareIds((prev) => {
      const next = prev.filter((x) => x !== id);
      if (next.length === 0) setShowCompare(false);
      return next;
    });
  }

  const compareGroups = groups.filter((g) => compareIds.includes(g.id));

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Savings Groups</h1>
          {compareIds.length >= 2 && (
            <button
              onClick={() => setShowCompare(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Compare {compareIds.length} Groups
            </button>
          )}
        </div>

        {compareIds.length > 0 && compareIds.length < 2 && (
          <p className="mb-4 text-sm text-gray-500">
            Select at least 2 groups to compare (max {MAX_COMPARE}).
          </p>
        )}

        {groups.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No groups found. Create the first one!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                compareSelected={compareIds.includes(group.id)}
                compareDisabled={compareIds.length >= MAX_COMPARE}
                onCompareToggle={handleCompareToggle}
              />
            ))}
          </div>
        )}
      </main>

      {showCompare && (
        <GroupCompare
          groups={compareGroups}
          onClose={() => setShowCompare(false)}
          onRemove={handleRemoveFromCompare}
        />
      )}
    </>
  );
}
