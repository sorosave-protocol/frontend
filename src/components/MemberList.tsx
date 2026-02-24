"use client";

import { shortenAddress } from "@/lib/sdk";

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
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Members</h3>
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
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">
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
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Received
                  </span>
                )}
                {payoutRound && !hasReceived && !isCurrentRecipient && (
                  <span className="text-xs text-gray-500">
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
