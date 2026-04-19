"use client";

import { GroupCard } from "@/components/GroupCard";
import { Navbar } from "@/components/Navbar";
import { SavingsGroup } from "@sorosave/sdk";
import { useState } from "react";
import { GroupCompare } from "@/components/GroupCompare";

export default function GroupsPage() {
  const [selectedGroups, setSelectedGroups] = useState<SavingsGroup[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Mock data - replace with actual data fetching
  const groups: SavingsGroup[] = [
    {
      id: "1",
      name: "Community Savings Group",
      status: "Active",
      contributionAmount: 100,
      cycleLength: 30,
      members: Array(8).fill({}),
      maxMembers: 10,
      currentRound: 3,
      totalRounds: 10,
    },
    {
      id: "2",
      name: "Tech Professionals Group",
      status: "Forming",
      contributionAmount: 200,
      cycleLength: 15,
      members: Array(5).fill({}),
      maxMembers: 12,
      currentRound: 0,
      totalRounds: 12,
    },
    {
      id: "3",
      name: "Students Savings Club",
      status: "Active",
      contributionAmount: 50,
      cycleLength: 45,
      members: Array(15).fill({}),
      maxMembers: 20,
      currentRound: 2,
      totalRounds: 20,
    },
    {
      id: "4",
      name: "Investors Network",
      status: "Completed",
      contributionAmount: 500,
      cycleLength: 7,
      members: Array(10).fill({}),
      maxMembers: 10,
      currentRound: 10,
      totalRounds: 10,
    },
  ];

  const handleGroupSelect = (group: SavingsGroup) => {
    setSelectedGroups((prev) => {
      const isAlreadySelected = prev.some((g) => g.id === group.id);
      if (isAlreadySelected) {
        return prev.filter((g) => g.id !== group.id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, group];
    });
  };

  const handleCompareClick = () => {
    if (selectedGroups.length > 0) {
      setShowCompareModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          {selectedGroups.length > 0 && (
            <button
              onClick={handleCompareClick}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Compare ({selectedGroups.length})</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} onClick={() => handleGroupSelect(group)}>
              <GroupCard group={group} />
            </div>
          ))}
        </div>
      </main>

      {showCompareModal && (
        <GroupCompare
          groups={selectedGroups}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  );
}