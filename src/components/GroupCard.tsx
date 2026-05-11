"use client";

import Link from "next/link";
import { SavingsGroup, formatAmount, getStatusLabel } from "@sorosave/sdk";
import { useLocale, useTranslations } from "next-intl";

interface GroupCardProps {
  group: SavingsGroup;
}

const statusColors: Record<string, string> = {
  Forming: "bg-blue-100 text-blue-800",
  Active: "bg-green-100 text-green-800",
  Completed: "bg-gray-100 text-gray-800",
  Disputed: "bg-red-100 text-red-800",
  Paused: "bg-yellow-100 text-yellow-800",
};

const statusMessageKeys: Record<string, string> = {
  Forming: "forming",
  Active: "active",
  Completed: "completed",
  Disputed: "disputed",
  Paused: "paused",
};

export function GroupCard({ group }: GroupCardProps) {
  const locale = useLocale();
  const t = useTranslations("groupCard");
  const common = useTranslations("common");
  const status = useTranslations("status");
  const statusLabel = getStatusLabel(group.status);

  return (
    <Link href={`/${locale}/groups/${group.id}`}>
      <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[group.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {status(statusMessageKeys[statusLabel] ?? "unknown")}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>{t("contribution")}</span>
            <span className="font-medium text-gray-900">
              {formatAmount(group.contributionAmount)} {common("tokens")}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("members")}</span>
            <span className="font-medium text-gray-900">
              {group.members.length} / {group.maxMembers}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t("round")}</span>
            <span className="font-medium text-gray-900">
              {group.currentRound} / {group.totalRounds || group.maxMembers}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
