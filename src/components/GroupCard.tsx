"use client";

import Link from "next/link";
import { SavingsGroup, formatAmount, getStatusLabel } from "@sorosave/sdk";

interface GroupCardProps {
  group: SavingsGroup;
}

const statusColors: Record<string, string> = {
  Forming: "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  Active: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300",
  Completed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  Disputed: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  Paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300",
};

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link href={`/groups/${group.id}`}>
      <div className="cursor-pointer rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{group.name}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[group.status] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            {getStatusLabel(group.status)}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex justify-between">
            <span>Contribution</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatAmount(group.contributionAmount)} tokens
            </span>
          </div>
          <div className="flex justify-between">
            <span>Members</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {group.members.length} / {group.maxMembers}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Round</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {group.currentRound} / {group.totalRounds || group.maxMembers}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
