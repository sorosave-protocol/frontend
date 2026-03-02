"use client";

import { useState, useEffect } from 'react';

interface AnalyticsData {
  contributions: { date: string; amount: number }[];
  payouts: { recipient: string; amount: number }[];
  memberParticipation: { name: string; percentage: number }[];
}

export function GroupAnalytics({ groupId }: { groupId: number }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'contributions' | 'payouts' | 'members'>('contributions');

  useEffect(() => {
    loadAnalytics();
  }, [groupId]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual API calls
      const mockData: AnalyticsData = {
        contributions: [
          { date: '2026-01', amount: 100 },
          { date: '2026-02', amount: 150 },
          { date: '2026-03', amount: 200 },
        ],
        payouts: [
          { recipient: 'Alice', amount: 450 },
          { recipient: 'Bob', amount: 450 },
          { recipient: 'Charlie', amount: 450 },
        ],
        memberParticipation: [
          { name: 'Alice', percentage: 100 },
          { name: 'Bob', percentage: 85 },
          { name: 'Charlie', percentage: 70 },
        ],
      };
      setData(mockData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxContribution = data ? Math.max(...data.contributions.map(c => c.amount)) : 0;
  const maxPayout = data ? Math.max(...data.payouts.map(p => p.amount)) : 0;

  return (
    <div className="space-y-6">
      {/* Chart Tabs */}
      <div className="flex gap-2">
        {(['contributions', 'payouts', 'members'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveChart(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeChart === tab
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab === 'contributions' ? '📈 Contributions' : 
             tab === 'payouts' ? '💰 Payouts' : '👥 Members'}
          </button>
        ))}
      </div>

      {/* Charts */}
      {loading ? (
        <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          {/* Contributions Line Chart (ASCII fallback) */}
          {activeChart === 'contributions' && data && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Contribution History</h3>
              <div className="space-y-3">
                {data.contributions.map((c, i) => (
                  <div key={c.date} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-16">{c.date}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-primary-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(c.amount / maxContribution) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">${c.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payouts Bar Chart */}
          {activeChart === 'payouts' && data && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Payout Distribution</h3>
              <div className="space-y-3">
                {data.payouts.map((p) => (
                  <div key={p.recipient} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-20">{p.recipient}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(p.amount / maxPayout) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-16 text-right">${p.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member Participation Pie (as bars) */}
          {activeChart === 'members' && data && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Member Participation</h3>
              <div className="space-y-3">
                {data.memberParticipation.map((m) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-20">{m.name}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${m.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{m.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
