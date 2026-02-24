"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GroupCard } from "@/components/GroupCard";
import { GroupCompare } from "@/components/GroupCompare";
import { SavingsGroup, GroupStatus } from "@/lib/sdk";

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
    name: "Weekend Fund",
    admin: "GEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJ",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 500000000n,
    cycleLength: 86400,
    maxMembers: 4,
    members: ["GEFGH..."],
    payoutOrder: [],
    currentRound: 0,
    totalRounds: 0,
    status: GroupStatus.Forming,
    createdAt: 1701000000,
  },
];

export default function GroupsPage() {
  const groups = PLACEHOLDER_GROUPS;
  const [compared, setCompared] = useState<SavingsGroup[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = (group: SavingsGroup) => {
    setCompared(prev => {
      const exists = prev.find(g => g.id === group.id);
      if (exists) return prev.filter(g => g.id !== group.id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, group];
    });
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Savings Groups</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">Select up to 3 groups to compare</p>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No groups found. Create the first one!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                isCompared={!!compared.find(g => g.id === group.id)}
                onToggleCompare={compared.length < 3 || compared.find(g => g.id === group.id) ? toggleCompare : undefined}
              />
            ))}
          </div>
        )}

        {/* Compare sticky bar */}
        {compared.length >= 2 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
            <div className="flex items-center space-x-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-5 py-3 rounded-full shadow-xl">
              <span className="text-sm font-medium">{compared.length} groups selected</span>
              <button
                onClick={() => setShowCompare(true)}
                className="bg-primary-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Compare →
              </button>
              <button
                onClick={() => setCompared([])}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-200 dark:hover:text-gray-700 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </main>

      {showCompare && (
        <GroupCompare groups={compared} onClose={() => setShowCompare(false)} />
      )}
    </>
  );
}
