"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  TrendingUp,
  Sparkles,
  Clock,
  Users,
  Wallet,
  Filter,
  ChevronRight,
  Star,
  Activity,
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  totalSaved: number;
  contributionAmount: number;
  contributionPeriod: number;
  memberCount: number;
  maxMembers: number;
  token: string;
  createdAt: string;
  status: "forming" | "active" | "completed";
  activity: {
    contributions24h: number;
    membersJoined7d: number;
    totalTransactions: number;
  };
}

interface WalletBalance {
  token: string;
  balance: number;
}

interface GroupRecommendationsProps {
  userGroups?: Group[];
  walletBalances?: WalletBalance[];
  allGroups?: Group[];
  onJoinGroup?: (groupId: string) => void;
  onViewGroup?: (groupId: string) => void;
}

// Mock data generator for demonstration
const generateMockGroups = (): Group[] => [
  {
    id: "group-1",
    name: "BTC Saver Circle",
    description: "Weekly Bitcoin savings with like-minded enthusiasts",
    targetAmount: 50000,
    totalSaved: 32450,
    contributionAmount: 100,
    contributionPeriod: 7,
    memberCount: 12,
    maxMembers: 20,
    token: "BTC",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    activity: {
      contributions24h: 8,
      membersJoined7d: 3,
      totalTransactions: 156,
    },
  },
  {
    id: "group-2",
    name: "Stellar Stars",
    description: "Monthly XLM savings for Stellar believers",
    targetAmount: 10000,
    totalSaved: 8900,
    contributionAmount: 50,
    contributionPeriod: 30,
    memberCount: 8,
    maxMembers: 15,
    token: "XLM",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "forming",
    activity: {
      contributions24h: 2,
      membersJoined7d: 5,
      totalTransactions: 23,
    },
  },
  {
    id: "group-3",
    name: "USDC Stable Savers",
    description: "Stablecoin savings for conservative investors",
    targetAmount: 25000,
    totalSaved: 18750,
    contributionAmount: 200,
    contributionPeriod: 14,
    memberCount: 18,
    maxMembers: 25,
    token: "USDC",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    activity: {
      contributions24h: 15,
      membersJoined7d: 2,
      totalTransactions: 342,
    },
  },
  {
    id: "group-4",
    name: "ETH Moon Club",
    description: "Ethereum enthusiasts saving for the next bull run",
    targetAmount: 75000,
    totalSaved: 45600,
    contributionAmount: 150,
    contributionPeriod: 7,
    memberCount: 15,
    maxMembers: 30,
    token: "ETH",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "forming",
    activity: {
      contributions24h: 12,
      membersJoined7d: 8,
      totalTransactions: 89,
    },
  },
  {
    id: "group-5",
    name: "Family Emergency Fund",
    description: "Saving together for unexpected expenses",
    targetAmount: 5000,
    totalSaved: 3200,
    contributionAmount: 25,
    contributionPeriod: 7,
    memberCount: 6,
    maxMembers: 10,
    token: "USDC",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    activity: {
      contributions24h: 3,
      membersJoined7d: 0,
      totalTransactions: 156,
    },
  },
  {
    id: "group-6",
    name: "Crypto Newbies",
    description: "Beginner-friendly group with low contribution amounts",
    targetAmount: 1000,
    totalSaved: 450,
    contributionAmount: 10,
    contributionPeriod: 7,
    memberCount: 4,
    maxMembers: 12,
    token: "XLM",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "forming",
    activity: {
      contributions24h: 1,
      membersJoined7d: 4,
      totalTransactions: 5,
    },
  },
];

// Recommendation algorithm
const calculateRecommendationScore = (
  group: Group,
  userGroups: Group[],
  walletBalances: WalletBalance[]
): number => {
  let score = 0;

  // Token preference match (30 points)
  const userTokens = new Set(userGroups.map((g) => g.token));
  const walletTokens = new Set(walletBalances.map((w) => w.token));
  if (userTokens.has(group.token)) score += 20;
  if (walletTokens.has(group.token)) score += 10;

  // Activity score (25 points)
  const activityScore = Math.min(
    group.activity.contributions24h * 2 +
      group.activity.membersJoined7d * 3 +
      group.activity.totalTransactions * 0.1,
    25
  );
  score += activityScore;

  // Group health (20 points)
  const memberRatio = group.memberCount / group.maxMembers;
  const progressRatio = group.totalSaved / group.targetAmount;
  score += memberRatio * 10 + progressRatio * 10;

  // New group bonus (15 points) - decay over time
  const daysSinceCreated =
    (Date.now() - new Date(group.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  const newnessBonus = Math.max(0, 15 - daysSinceCreated * 0.5);
  score += newnessBonus;

  // Status bonus (10 points)
  if (group.status === "forming") score += 5;
  if (group.status === "active") score += 5;

  return Math.round(score);
};

// Group Card Component
const GroupCard: React.FC<{
  group: Group;
  score?: number;
  onJoin: (id: string) => void;
  onView: (id: string) => void;
}> = ({ group, score, onJoin, onView }) => {
  const progress = (group.totalSaved / group.targetAmount) * 100;
  const memberRatio = group.memberCount / group.maxMembers;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-shadow cursor-pointer">
      onClick={() => onView(group.id)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{group.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{group.description}</p>
        </div>
        {score && (
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            <Star className="w-3 h-3" />
            {score}%
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{progress.toFixed(0)}% of goal</span>
          <span>
            {group.totalSaved.toLocaleString()} /{" "}
            {group.targetAmount.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {group.memberCount}/{group.maxMembers} members
        </div>
        <div className="flex items-center gap-1">
          <Wallet className="w-3 h-3" />
          {group.contributionAmount} {group.token}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Every {group.contributionPeriod}d
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            group.status === "forming"
              ? "bg-blue-50 text-blue-600"
              : "bg-green-50 text-green-600"
          }`}
        >
          {group.status === "forming" ? "🆕 Forming" : "🟢 Active"}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onJoin(group.id);
          }}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Join
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}> = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
      {icon}
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

// Filter Component
const TokenFilter: React.FC<{
  balances: WalletBalance[];
  selected: string[];
  onChange: (tokens: string[]) => void;
}> = ({ balances, selected, onChange }) => {
  const allTokens = [...new Set(balances.map((b) => b.token))];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Filter className="w-4 h-4" />
        Filter by token:
      </div>
      {allTokens.map((token) => (
        <button
          key={token}
          onClick={() => {
            if (selected.includes(token)) {
              onChange(selected.filter((t) => t !== token));
            } else {
              onChange([...selected, token]);
            }
          }}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            selected.includes(token)
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {token}
        </button>
      ))}
      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Clear
        </button>
      )}
    </div>
  );
};

// Main Component
export const GroupRecommendations: React.FC<GroupRecommendationsProps> = ({
  userGroups = [],
  walletBalances = [],
  allGroups,
  onJoinGroup,
  onViewGroup,
}) => {
  const [tokenFilter, setTokenFilter] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use mock data if allGroups not provided
  const groups = allGroups || generateMockGroups();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Calculate recommendations
  const recommendations = useMemo(() => {
    const scored = groups
      .filter((g) => !userGroups.find((ug) => ug.id === g.id))
      .filter(
        (g) => tokenFilter.length === 0 || tokenFilter.includes(g.token)
      )
      .map((group) => ({
        group,
        score: calculateRecommendationScore(group, userGroups, walletBalances),
      }))
      .sort((a, b) => b.score - a.score);

    return scored;
  }, [groups, userGroups, walletBalances, tokenFilter]);

  // Popular groups (by activity)
  const popularGroups = useMemo(() => {
    return groups
      .filter(
        (g) => tokenFilter.length === 0 || tokenFilter.includes(g.token)
      )
      .sort(
        (a, b) =>
          b.activity.contributions24h +
          b.activity.membersJoined7d * 2 -
          (a.activity.contributions24h + a.activity.membersJoined7d * 2)
      )
      .slice(0, 4);
  }, [groups, tokenFilter]);

  // New groups (forming status, sorted by creation date)
  const newGroups = useMemo(() => {
    return groups
      .filter((g) => g.status === "forming")
      .filter(
        (g) => tokenFilter.length === 0 || tokenFilter.includes(g.token)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 4);
  }, [groups, tokenFilter]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-8 bg-gray-100 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-48 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Filter Section */}
      {walletBalances.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <TokenFilter
            balances={walletBalances}
            selected={tokenFilter}
            onChange={setTokenFilter}
          />
        </div>
      )}

      {/* Personalized Recommendations */}
      <section>
        <SectionHeader
          icon={<Sparkles className="w-5 h-5" />}
          title="Recommended for You"
          subtitle="Based on your preferences and wallet tokens"
        />
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recommendations.slice(0, 4).map(({ group, score }) => (
              <GroupCard
                key={group.id}
                group={group}
                score={score}
                onJoin={onJoinGroup || (() => {})}
                onView={onViewGroup || (() => {})}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recommendations match your filters. Try adjusting your
            preferences.
          </div>
        )}
      </section>

      {/* Popular Groups */}
      <section>
        <SectionHeader
          icon={<TrendingUp className="w-5 h-5" />}
          title="Popular Groups"
          subtitle="Most active groups this week"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onJoin={onJoinGroup || (() => {})}
              onView={onViewGroup || (() => {})}
            />
          ))}
        </div>
      </section>

      {/* New Groups */}
      <section>
        <SectionHeader
          icon={<Clock className="w-5 h-5" />}
          title="New Groups"
          subtitle="Recently created groups still forming"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {newGroups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onJoin={onJoinGroup || (() => {})}
              onView={onViewGroup || (() => {})}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default GroupRecommendations;
