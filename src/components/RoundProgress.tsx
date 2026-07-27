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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm dark:shadow-gray-900/50 border dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Progress</h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Round {currentRound} of {totalRounds}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${roundProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Current Round Contributions</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {contributionsReceived} / {totalMembers}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
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
