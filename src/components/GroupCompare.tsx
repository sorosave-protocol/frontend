"use client";

import { SavingsGroup, formatAmount, getStatusLabel } from "@sorosave/sdk";
import Link from "next/link";

interface GroupCompareProps {
  groups: SavingsGroup[];
  onClose: () => void;
  onRemove: (id: number) => void;
}

function cycleLabel(seconds: number): string {
  const days = Math.round(seconds / 86400);
  if (days >= 28) return `${Math.round(days / 7)} weeks`;
  return `${days} day${days !== 1 ? "s" : ""}`;
}

const FIELDS = [
  {
    label: "Contribution",
    render: (g: SavingsGroup) => `${formatAmount(g.contributionAmount)} tokens`,
  },
  {
    label: "Cycle Length",
    render: (g: SavingsGroup) => cycleLabel(g.cycleLength),
  },
  {
    label: "Members",
    render: (g: SavingsGroup) => `${g.members.length} / ${g.maxMembers}`,
  },
  {
    label: "Status",
    render: (g: SavingsGroup) => getStatusLabel(g.status),
  },
  {
    label: "Current Round",
    render: (g: SavingsGroup) =>
      `${g.currentRound} / ${g.totalRounds || g.maxMembers}`,
  },
];

export function GroupCompare({ groups, onClose, onRemove }: GroupCompareProps) {
  if (groups.length === 0) return null;

  // For each field, find min/max across groups to highlight differences
  const contributionAmounts = groups.map((g) => Number(g.contributionAmount));
  const minContribution = Math.min(...contributionAmounts);
  const maxContribution = Math.max(...contributionAmounts);
  const hasDiffContribution = minContribution !== maxContribution;

  const cycleLengths = groups.map((g) => g.cycleLength);
  const minCycle = Math.min(...cycleLengths);
  const maxCycle = Math.max(...cycleLengths);
  const hasDiffCycle = minCycle !== maxCycle;

  const memberCounts = groups.map((g) => g.members.length);
  const minMembers = Math.min(...memberCounts);
  const maxMembers = Math.max(...memberCounts);
  const hasDiffMembers = minMembers !== maxMembers;

  const statuses = groups.map((g) => g.status);
  const hasDiffStatus = new Set(statuses).size > 1;

  const rounds = groups.map((g) => g.currentRound);
  const minRound = Math.min(...rounds);
  const maxRound = Math.max(...rounds);
  const hasDiffRound = minRound !== maxRound;

  const diffs = [hasDiffContribution, hasDiffCycle, hasDiffMembers, hasDiffStatus, hasDiffRound];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Compare Groups ({groups.length}/3)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-gray-500 font-medium w-32">Field</th>
                {groups.map((g) => (
                  <th key={g.id} className="px-4 py-3 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/groups/${g.id}`}
                        className="font-semibold text-gray-900 hover:text-primary-700 hover:underline"
                      >
                        {g.name}
                      </Link>
                      <button
                        onClick={() => onRemove(g.id)}
                        className="text-gray-300 hover:text-red-400 text-xs flex-shrink-0"
                        aria-label={`Remove ${g.name} from comparison`}
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FIELDS.map((field, i) => (
                <tr key={field.label} className="border-b last:border-0">
                  <td className="px-4 py-3 text-gray-500 font-medium">{field.label}</td>
                  {groups.map((g) => (
                    <td
                      key={g.id}
                      className={`px-4 py-3 font-medium ${
                        diffs[i] ? "text-primary-700" : "text-gray-900"
                      }`}
                    >
                      {field.render(g)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {diffs.some(Boolean) && (
          <p className="px-6 py-3 text-xs text-primary-600 border-t bg-primary-50">
            Highlighted values differ between groups
          </p>
        )}
      </div>
    </div>
  );
}
