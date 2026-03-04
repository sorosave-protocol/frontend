"use client";

import { useState, useMemo } from "react";
import { GroupCard } from "./GroupCard";
import { SavingsGroup, GroupStatus } from "@sorosave/sdk";

interface GroupRecommendationsProps {
  userWalletAddress?: string;
  userTokenBalances?: Map<string, bigint>;
}

// Sample data for different recommendation categories
const SAMPLE_RECOMMENDED_GROUPS: SavingsGroup[] = [
  {
    id: 101,
    name: "Family Savings 2024",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 1000000000n,
    cycleLength: 604800,
    maxMembers: 6,
    members: ["GABCD...", "GEFGH...", "GIJKL..."],
    payoutOrder: [],
    currentRound: 0,
    totalRounds: 0,
    status: GroupStatus.Forming,
    createdAt: Date.now() / 1000 - 86400, // 1 day ago
  },
  {
    id: 102,
    name: "Crypto Enthusiasts Pool",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567BBBBBB",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 2000000000n,
    cycleLength: 604800,
    maxMembers: 8,
    members: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP..."],
    payoutOrder: [],
    currentRound: 0,
    totalRounds: 0,
    status: GroupStatus.Forming,
    createdAt: Date.now() / 1000 - 172800, // 2 days ago
  },
];

const SAMPLE_POPULAR_GROUPS: SavingsGroup[] = [
  {
    id: 201,
    name: "Tech Professionals Fund",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567CCCCCC",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 5000000000n,
    cycleLength: 2592000,
    maxMembers: 10,
    members: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP...", "GQRST...", "GUVWXY..."],
    payoutOrder: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP...", "GQRST...", "GUVWXY..."],
    currentRound: 3,
    totalRounds: 10,
    status: GroupStatus.Active,
    createdAt: Date.now() / 1000 - 604800, // 1 week ago
  },
  {
    id: 202,
    name: "Small Business Circle",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567DDDDDD",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 3000000000n,
    cycleLength: 1209600,
    maxMembers: 5,
    members: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP..."],
    payoutOrder: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP..."],
    currentRound: 2,
    totalRounds: 5,
    status: GroupStatus.Active,
    createdAt: Date.now() / 1000 - 1209600, // 2 weeks ago
  },
  {
    id: 203,
    name: "Emergency Fund Group",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567EEEEEE",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 1000000000n,
    cycleLength: 604800,
    maxMembers: 12,
    members: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP...", "GQRST...", "GUVWXY...", "GZABCD...", "GEFGHI..."],
    payoutOrder: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP...", "GQRST...", "GUVWXY...", "GZABCD...", "GEFGHI..."],
    currentRound: 5,
    totalRounds: 12,
    status: GroupStatus.Active,
    createdAt: Date.now() / 1000 - 2592000, // 1 month ago
  },
];

const SAMPLE_NEW_GROUPS: SavingsGroup[] = [
  {
    id: 301,
    name: "Weekend Warriors Savings",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567FFFFFF",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 500000000n,
    cycleLength: 604800,
    maxMembers: 4,
    members: ["GABCD..."],
    payoutOrder: [],
    currentRound: 0,
    totalRounds: 0,
    status: GroupStatus.Forming,
    createdAt: Date.now() / 1000 - 3600, // 1 hour ago
  },
  {
    id: 302,
    name: "Vacation Fund 2025",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567GGGGGG",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 2000000000n,
    cycleLength: 1814400,
    maxMembers: 6,
    members: ["GABCD...", "GEFGH..."],
    payoutOrder: [],
    currentRound: 0,
    totalRounds: 0,
    status: GroupStatus.Forming,
    createdAt: Date.now() / 1000 - 7200, // 2 hours ago
  },
  {
    id: 303,
    name: "Freelancers United",
    admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567HHHHHH",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 1500000000n,
    cycleLength: 1209600,
    maxMembers: 8,
    members: ["GABCD...", "GEFGH...", "GIJKL..."],
    payoutOrder: [],
    currentRound: 0,
    totalRounds: 0,
    status: GroupStatus.Forming,
    createdAt: Date.now() / 1000 - 14400, // 4 hours ago
  },
];

export function GroupRecommendations({
  userWalletAddress,
  userTokenBalances,
}: GroupRecommendationsProps) {
  const [activeTab, setActiveTab] = useState<
    "recommended" | "popular" | "new"
  >("recommended");
  const [selectedToken, setSelectedToken] = useState<string>("all");

  // Filter groups based on selected token
  const filteredRecommended = useMemo(() => {
    if (selectedToken === "all") return SAMPLE_RECOMMENDED_GROUPS;
    return SAMPLE_RECOMMENDED_GROUPS.filter(
      (g) => g.token === selectedToken
    );
  }, [selectedToken]);

  const tabs = [
    { id: "recommended", label: "Recommended for You" },
    { id: "popular", label: "Popular Groups" },
    { id: "new", label: "New Groups" },
  ] as const;

  const getGroupsForTab = () => {
    switch (activeTab) {
      case "recommended":
        return filteredRecommended;
      case "popular":
        return SAMPLE_POPULAR_GROUPS;
      case "new":
        return SAMPLE_NEW_GROUPS;
      default:
        return [];
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case "recommended":
        return "Groups matched to your wallet balance and preferences";
      case "popular":
        return "Most active groups with high member participation";
      case "new":
        return "Recently created groups still forming";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Token Filter */}
      <div className="flex items-center space-x-4">
        <label htmlFor="token-filter" className="text-sm font-medium text-gray-700">
          Filter by Token:
        </label>
        <select
          id="token-filter"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Tokens</option>
          <option value="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC">
            USDC
          </option>
          <option value="other">Other Tokens</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600">{getTabDescription()}</p>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getGroupsForTab().map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      {/* Empty State */}
      {getGroupsForTab().length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No groups found in this category.
        </div>
      )}
    </div>
  );
}
