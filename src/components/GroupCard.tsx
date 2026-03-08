"use client";

import Link from "next/link";
import { SavingsGroup, formatAmount } from "@sorosave/sdk";
import { StatusBadge } from "./StatusBadge";

interface GroupCardProps {
  group: SavingsGroup;
}

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link href={`/groups/${group.id}`}>
      <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
          <StatusBadge status={group.status} />
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
  );
}
