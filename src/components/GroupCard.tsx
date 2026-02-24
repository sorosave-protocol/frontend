"use client";

import Link from "next/link";
import { SavingsGroup, formatAmount, getStatusLabel } from "@/lib/sdk";

interface GroupCardProps {
  group: SavingsGroup;
  isCompared?: boolean;
  onToggleCompare?: (group: SavingsGroup) => void;
}

const statusColors: Record<string, string> = {
  Forming: "bg-blue-100 text-blue-800",
  Active: "bg-green-100 text-green-800",
  Completed: "bg-gray-100 text-gray-800",
  Disputed: "bg-red-100 text-red-800",
  Paused: "bg-yellow-100 text-yellow-800",
};

export function GroupCard({ group, isCompared = false, onToggleCompare }: GroupCardProps) {
  return (
    <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 hover:shadow-md transition-shadow ${isCompared ? "ring-2 ring-primary-500" : ""}`}>
      {/* Compare checkbox */}
      {onToggleCompare && (
        <label
          className="absolute top-3 left-3 flex items-center space-x-1 cursor-pointer z-10"
          onClick={e => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isCompared}
            onChange={() => onToggleCompare(group)}
            className="w-4 h-4 accent-primary-600 cursor-pointer"
          />
          <span className="text-xs text-gray-400 dark:text-gray-500 select-none">Compare</span>
        </label>
      )}

      <Link href={`/groups/${group.id}`}>
        <div className={onToggleCompare ? "mt-5" : ""}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{group.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[group.status] || "bg-gray-100 text-gray-800"}`}>
              {getStatusLabel(group.status)}
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Contribution</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{formatAmount(group.contributionAmount)} tokens</span>
            </div>
            <div className="flex justify-between">
              <span>Members</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{group.members.length} / {group.maxMembers}</span>
            </div>
            <div className="flex justify-between">
              <span>Round</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{group.currentRound} / {group.totalRounds || group.maxMembers}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
