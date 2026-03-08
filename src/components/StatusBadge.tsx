"use client";

import { GroupStatus, getStatusLabel } from "@sorosave/sdk";

interface StatusBadgeProps {
  status: GroupStatus;
  showIcon?: boolean;
}

const statusConfig: Record<
  GroupStatus,
  { bgClass: string; textClass: string; icon: string }
> = {
  [GroupStatus.Forming]: {
    bgClass: "bg-blue-100",
    textClass: "text-blue-800",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  },
  [GroupStatus.Active]: {
    bgClass: "bg-green-100",
    textClass: "text-green-800",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  [GroupStatus.Completed]: {
    bgClass: "bg-gray-100",
    textClass: "text-gray-800",
    icon: "M5 13l4 4L19 7",
  },
  [GroupStatus.Paused]: {
    bgClass: "bg-yellow-100",
    textClass: "text-yellow-800",
    icon: "M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  [GroupStatus.Disputed]: {
    bgClass: "bg-red-100",
    textClass: "text-red-800",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  },
};

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig[GroupStatus.Forming];
  const label = getStatusLabel(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgClass} ${config.textClass}`}
      aria-label={`Status: ${label}`}
    >
      {showIcon && (
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={config.icon} />
        </svg>
      )}
      {label}
    </span>
  );
}
