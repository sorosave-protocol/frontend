"use client";

interface RoundProgressProps {
  currentRound: number;
  totalRounds: number;
  contributionsReceived: number;
  totalMembers: number;
  isPolling?: boolean;
  lastUpdated?: Date | null;
}

export function RoundProgress({
  currentRound,
  totalRounds,
  contributionsReceived,
  totalMembers,
  isPolling = false,
  lastUpdated = null,
}: RoundProgressProps) {
  const roundProgress = totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0;
  const contributionProgress =
    totalMembers > 0 ? (contributionsReceived / totalMembers) * 100 : 0;
  const roundComplete = contributionsReceived >= totalMembers;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
        {isPolling && (
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-xs text-gray-500">Live</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium text-gray-900">
              Round {currentRound} of {totalRounds}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${roundProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Current Round Contributions</span>
            <span className="font-medium text-gray-900">
              {contributionsReceived} / {totalMembers}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ease-out ${
                roundComplete ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${contributionProgress}%` }}
            />
          </div>
          {roundComplete && (
            <p className="text-xs text-green-600 mt-1 font-medium">
              All contributions received — payout ready
            </p>
          )}
        </div>
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-400 mt-3 text-right">
          Updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
