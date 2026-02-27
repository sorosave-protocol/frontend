"use client";

interface RoundProgressProps {
  currentRound: number;
  totalRounds: number;
  contributionsReceived: number;
  totalMembers: number;
}

export function RoundProgress({
  currentRound,
  totalRounds,
  contributionsReceived,
  totalMembers,
}: RoundProgressProps) {
  const roundProgress = totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0;
  const contributionProgress =
    totalMembers > 0 ? (contributionsReceived / totalMembers) * 100 : 0;

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Progress</h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">Overall Progress</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Round {currentRound} of {totalRounds}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${roundProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">Current Round Contributions</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {contributionsReceived} / {totalMembers}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${contributionProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
