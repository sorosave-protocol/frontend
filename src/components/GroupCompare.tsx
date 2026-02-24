"use client";

import { SavingsGroup, formatAmount } from "@/lib/sdk";

interface GroupCompareProps {
  groups: SavingsGroup[];
  onClose: () => void;
}

const ROWS: { key: keyof SavingsGroup | "spotsLeft" | "cycleLabel"; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
  { key: "contributionAmount", label: "Contribution" },
  { key: "cycleLabel", label: "Cycle" },
  { key: "maxMembers", label: "Max Members" },
  { key: "spotsLeft", label: "Spots Left" },
];

function cycleLabel(seconds: number) {
  if (seconds >= 2592000) return "Monthly";
  if (seconds >= 604800) return "Weekly";
  if (seconds >= 86400) return "Daily";
  return `${seconds}s`;
}

function getValue(group: SavingsGroup, key: string): string {
  switch (key) {
    case "contributionAmount": return `${formatAmount(group.contributionAmount)} tokens`;
    case "cycleLabel": return cycleLabel(group.cycleLength);
    case "spotsLeft": return String(group.maxMembers - group.members.length);
    default: return String((group as any)[key] ?? "—");
  }
}

// Find keys where values differ across groups
function isDifferent(groups: SavingsGroup[], key: string): boolean {
  const values = groups.map(g => getValue(g, key));
  return new Set(values).size > 1;
}

export function GroupCompare({ groups, onClose }: GroupCompareProps) {
  if (groups.length < 2) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Compare Groups</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none">&times;</button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left px-5 py-3 text-gray-500 dark:text-gray-400 font-medium w-32">Feature</th>
                {groups.map(g => (
                  <th key={g.id} className="px-5 py-3 text-center font-semibold text-gray-900 dark:text-gray-100">{g.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(row => {
                const diff = isDifferent(groups, row.key);
                return (
                  <tr key={row.key} className={`border-b dark:border-gray-800 ${diff ? "bg-yellow-50 dark:bg-yellow-900/10" : ""}`}>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400 font-medium">
                      {row.label}
                      {diff && <span className="ml-1 text-yellow-500 text-xs">≠</span>}
                    </td>
                    {groups.map(g => (
                      <td key={g.id} className="px-5 py-3 text-center text-gray-900 dark:text-gray-100 font-medium">
                        {getValue(g, row.key)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="px-5 py-3 border-t dark:border-gray-700 flex items-center space-x-2 text-xs text-gray-400">
          <span className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded" />
          <span>Highlighted rows indicate differences between groups</span>
        </div>
      </div>
    </div>
  );
}
