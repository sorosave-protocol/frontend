"use client";

// Helper function to shorten address
function shortenAddress(address: string, chars: number = 6): string {
  if (!address || address.length < chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Members</h3>
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
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-700 dark:text-primary-300 text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {shortenAddress(member)}
                  </span>
                  {member === admin && (
                    <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <div>
                {isCurrentRecipient && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                    Current Recipient
                  </span>
                )}
                {hasReceived && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
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
