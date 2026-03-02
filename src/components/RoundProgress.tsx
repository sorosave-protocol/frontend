"use client";

import { useState, useEffect, useCallback } from 'react';

interface RoundProgressProps {
  groupId: number;
  initialRound?: number;
  initialTotalRounds?: number;
  initialContributions?: number;
  initialMembers?: number;
}

export function RoundProgress({
  groupId,
  initialRound = 1,
  initialTotalRounds = 12,
  initialContributions = 0,
  initialMembers = 5,
}: RoundProgressProps) {
  const [currentRound, setCurrentRound] = useState(initialRound);
  const [totalRounds] = useState(initialTotalRounds);
  const [contributionsReceived, setContributionsReceived] = useState(initialContributions);
  const [totalMembers] = useState(initialMembers);
  const [isPolling, setIsPolling] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Poll for updates every 10 seconds
  useEffect(() => {
    if (!isPolling) return;

    const pollInterval = setInterval(async () => {
      try {
        // Poll contract for updates - replace with actual SDK call
        // const group = await sorosaveClient.getGroup(groupId);
        
        // For demo, simulate random contribution
        if (contributionsReceived < totalMembers && Math.random() > 0.7) {
          setContributionsReceived(prev => {
            const newCount = prev + 1;
            // Stop polling if round is complete
            if (newCount >= totalMembers) {
              setIsPolling(false);
            }
            return newCount;
          });
        }
        
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Poll error:', error);
      }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [groupId, isPolling, contributionsReceived, totalMembers]);

  const roundProgress = totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0;
  const contributionProgress = totalMembers > 0 ? (contributionsReceived / totalMembers) * 100 : 0;
  const isRoundComplete = contributionsReceived >= totalMembers;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
        <div className="flex items-center gap-2">
          {isPolling ? (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live
            </span>
          ) : (
            <span className="text-xs text-gray-500">Paused</span>
          )}
          <span className="text-xs text-gray-400">
            Updated: {formatTime(lastUpdated)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Round Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium text-gray-900">
              Round {currentRound} of {totalRounds}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${roundProgress}%` }}
            />
          </div>
        </div>

        {/* Contribution Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Current Round Contributions</span>
            <span className="font-medium text-gray-900">
              {contributionsReceived} / {totalMembers}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isRoundComplete ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${contributionProgress}%` }}
            />
          </div>
        </div>

        {/* Round Complete Message */}
        {isRoundComplete && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-800 font-medium">
              🎉 Round {currentRound} Complete! Payout being processed...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
