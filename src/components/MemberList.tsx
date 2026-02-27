"use client";

import { shortenAddress } from "@sorosave/sdk";

interface MemberListProps {
  members: string[];
  admin: string;
  payoutOrder: string[];
  currentRound: number;
}

export function MemberList({
  members,
  admin,
  payoutOrder,
  currentRound,
}: MemberListProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Members</h3>
      <div className="space-y-3">
        {members.map((member, index) => {
          const payoutRound =
            payoutOrder.indexOf(member) + 1 || null;
          const hasReceived =
            payoutRound !== null && payoutRound < currentRound;
          const isCurrentRecipient =
            payoutRound !== null && payoutRound === currentRound;

          return (
            <div
              key={member}
              className="flex items-center justify-between border-b border-gray-200 py-2 last:border-0 dark:border-gray-800"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {shortenAddress(member, 6)}
                  </span>
                  {member === admin && (
                    <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <div>
                {isCurrentRecipient && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Current Recipient
                  </span>
                )}
                {hasReceived && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full dark:bg-gray-800 dark:text-gray-300">
                    Received
                  </span>
                )}
                {payoutRound && !hasReceived && !isCurrentRecipient && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Round {payoutRound}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
