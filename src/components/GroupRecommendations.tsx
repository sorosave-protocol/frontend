"use client";

import Link from "next/link";
import { SavingsGroup, GroupStatus, formatAmount, getStatusLabel } from "@sorosave/sdk";

// Placeholder groups for discovery — in production these would come from contract queries
const ALL_GROUPS: SavingsGroup[] = [
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
    createdAt: Math.floor(Date.now() / 1000) - 3600,
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
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 5,
  },
  {
    id: 3,
    name: "Nairobi Chama Group",
    admin: "GHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLM",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 2000000000n,
    cycleLength: 2592000,
    maxMembers: 8,
    members: ["GABCD...", "GEFGH...", "GIJKL...", "GMNOP...", "GQRST...", "GUVWX..."],
    payoutOrder: [],
    currentRound: 0,
    totalRounds: 0,
    status: GroupStatus.Active,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 10,
  },
  {
    id: 4,
    name: "Quick Save 500",
    admin: "GHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLM",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 500000000n,
    cycleLength: 604800,
    maxMembers: 4,
    members: ["GABCD...", "GEFGH..."],
    payoutOrder: [],
    currentRound: 0,
    totalRounds: 0,
    status: GroupStatus.Forming,
    createdAt: Math.floor(Date.now() / 1000) - 7200,
  },
  {
    id: 5,
    name: "Stellar Savers Elite",
    admin: "GHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLM",
    token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    contributionAmount: 10000000000n,
    cycleLength: 2592000,
    maxMembers: 12,
    members: [
      "GABCD...", "GEFGH...", "GIJKL...", "GMNOP...", "GQRST...",
      "GUVWX...", "GABCD2...", "GEFGH2...", "GIJKL2...", "GMNOP2...",
    ],
    payoutOrder: [],
    currentRound: 0,
    totalRounds: 0,
    status: GroupStatus.Active,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 2,
  },
];

function activityScore(group: SavingsGroup): number {
  // Higher score for more members, active status, recent creation
  let score = group.members.length;
  if (group.status === GroupStatus.Active) score += 10;
  const ageHours = (Date.now() / 1000 - group.createdAt) / 3600;
  if (ageHours < 48) score += 5;
  return score;
}

function isNewGroup(group: SavingsGroup): boolean {
  const ageHours = (Date.now() / 1000 - group.createdAt) / 3600;
  return ageHours < 72 && group.status === GroupStatus.Forming;
}

interface MiniCardProps {
  group: SavingsGroup;
  badge?: string;
}

function MiniGroupCard({ group, badge }: MiniCardProps) {
  const statusColors: Record<string, string> = {
    Forming: "bg-blue-100 text-blue-800",
    Active: "bg-green-100 text-green-800",
    Completed: "bg-gray-100 text-gray-800",
    Disputed: "bg-red-100 text-red-800",
    Paused: "bg-yellow-100 text-yellow-800",
  };

  return (
    <Link href={`/groups/${group.id}`}>
      <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer relative">
        {badge && (
          <span className="absolute top-2 right-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
            {badge}
          </span>
        )}
        <h4 className="font-semibold text-gray-900 text-sm mb-2 pr-16">
          {group.name}
        </h4>
        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Status</span>
            <span
              className={`px-1.5 py-0.5 rounded-full font-medium ${
                statusColors[group.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {getStatusLabel(group.status)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Contribution</span>
            <span className="font-medium text-gray-700">
              {formatAmount(group.contributionAmount)} tkn
            </span>
          </div>
          <div className="flex justify-between">
            <span>Members</span>
            <span className="font-medium text-gray-700">
              {group.members.length}/{group.maxMembers}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface GroupRecommendationsProps {
  /** Wallet address of the connected user (optional — used for personalization) */
  walletAddress?: string;
  /** Token symbol balances the user holds (for token-preference matching) */
  userTokens?: string[];
}

export function GroupRecommendations({
  walletAddress,
  userTokens = [],
}: GroupRecommendationsProps) {
  const groups = ALL_GROUPS;

  // Popular groups: highest activity score, must be Active
  const popular = [...groups]
    .filter((g) => g.status === GroupStatus.Active)
    .sort((a, b) => activityScore(b) - activityScore(a))
    .slice(0, 3);

  // New groups: recently created and still Forming
  const newGroups = groups.filter(isNewGroup).slice(0, 3);

  // Recommended: token preference match (if no token info, fall back to contribution range)
  const recommended = [...groups]
    .filter((g) => g.status === GroupStatus.Forming || g.status === GroupStatus.Active)
    .filter((g) => !walletAddress || !g.members.includes(walletAddress)) // exclude groups user is already in
    .sort((a, b) => {
      // Prefer groups whose token matches user's holdings
      const aMatch = userTokens.includes(a.token) ? 1 : 0;
      const bMatch = userTokens.includes(b.token) ? 1 : 0;
      if (bMatch !== aMatch) return bMatch - aMatch;
      // Then by lower contribution amount (more accessible)
      return Number(a.contributionAmount - b.contributionAmount);
    })
    .slice(0, 3);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Recommended for you */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recommended for You
          </h2>
          {recommended.length === 0 ? (
            <p className="text-sm text-gray-500">No recommendations available yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.map((g) => (
                <MiniGroupCard key={g.id} group={g} />
              ))}
            </div>
          )}
        </div>

        {/* Popular Groups */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Groups</h2>
          {popular.length === 0 ? (
            <p className="text-sm text-gray-500">No active groups yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popular.map((g) => (
                <MiniGroupCard key={g.id} group={g} badge="🔥 Popular" />
              ))}
            </div>
          )}
        </div>

        {/* New Groups */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">New Groups</h2>
          {newGroups.length === 0 ? (
            <p className="text-sm text-gray-500">No newly created groups.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newGroups.map((g) => (
                <MiniGroupCard key={g.id} group={g} badge="✨ New" />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
