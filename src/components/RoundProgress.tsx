"use client";

interface RoundProgressProps {
  currentRound: number;
  totalRounds: number;
  contributionsReceived: number;
  totalMembers: number;
  isLive?: boolean;
  lastUpdated?: Date | null;
}

export function RoundProgress({
  currentRound,
  totalRounds,
  contributionsReceived,
  totalMembers,
  isLive = false,
  lastUpdated = null,
}: RoundProgressProps) {
  const roundProgress = totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0;
  const contributionProgress = totalMembers > 0 ? (contributionsReceived / totalMembers) * 100 : 0;
  const isComplete = contributionsReceived >= totalMembers;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Progress</h3>
        {isLive && (
          <div className="flex items-center space-x-1.5 text-xs text-gray-400 dark:text-gray-500">
            <span className={`w-2 h-2 rounded-full ${isComplete ? "bg-gray-400" : "bg-green-500 animate-pulse"}`} />
            <span>{isComplete ? "Round complete" : "Live"}</span>
            {lastUpdated && (
              <span>· {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Round {currentRound} of {totalRounds}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${roundProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Current Round Contributions</span>
            <span className={`font-medium ${isComplete ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-gray-100"}`}>
              {contributionsReceived} / {totalMembers} {isComplete && "✓"}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${isComplete ? "bg-green-500" : "bg-blue-500"}`}
              style={{ width: `${contributionProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
