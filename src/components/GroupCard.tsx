"use client";

import Link from "next/link";
import { SavingsGroup, formatAmount, getStatusLabel } from "@sorosave/sdk";

interface GroupCardProps {
  group: SavingsGroup;
  compareSelected?: boolean;
  compareDisabled?: boolean;
  onCompareToggle?: (group: SavingsGroup) => void;
}

const statusColors: Record<string, string> = {
  Forming: "bg-blue-100 text-blue-800",
  Active: "bg-green-100 text-green-800",
  Completed: "bg-gray-100 text-gray-800",
  Disputed: "bg-red-100 text-red-800",
  Paused: "bg-yellow-100 text-yellow-800",
};

export function GroupCard({
  group,
  compareSelected = false,
  compareDisabled = false,
  onCompareToggle,
}: GroupCardProps) {
  return (
    <div className="relative">
      {onCompareToggle && (
        <label
          className="absolute top-3 right-3 z-10 flex items-center gap-1 cursor-pointer select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={compareSelected}
            disabled={compareDisabled && !compareSelected}
            onChange={() => onCompareToggle(group)}
            className="h-4 w-4 accent-primary-600 cursor-pointer disabled:cursor-not-allowed"
            aria-label={`Select ${group.name} for comparison`}
          />
          <span className="text-xs text-gray-500">Compare</span>
        </label>
      )}

      <Link href={`/groups/${group.id}`}>
        <div
          className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer ${
            compareSelected ? "ring-2 ring-primary-400" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-4 pr-20">
            <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[group.status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {getStatusLabel(group.status)}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Contribution</span>
              <span className="font-medium text-gray-900">
                {formatAmount(group.contributionAmount)} tokens
              </span>
            </div>
            <div className="flex justify-between">
              <span>Members</span>
              <span className="font-medium text-gray-900">
                {group.members.length} / {group.maxMembers}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Round</span>
              <span className="font-medium text-gray-900">
                {group.currentRound} / {group.totalRounds || group.maxMembers}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
