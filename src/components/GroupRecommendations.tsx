"use client";

import { useState, useEffect } from 'react';
import { SavingsGroup } from '@sorosave/sdk';

interface Recommendation {
  id: number;
  name: string;
  reason: 'popular' | 'new' | 'similar';
  memberCount: number;
  status: string;
}

export function GroupRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'popular' | 'new' | 'similar'>('all');

  useEffect(() => {
    // Fetch recommendations from API
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      // Mock data - in production, this would call your recommendation API
      const mockRecommendations: Recommendation[] = [
        { id: 1, name: 'Weekly Savings Circle', reason: 'popular', memberCount: 8, status: 'Active' },
        { id: 2, name: 'Vacation Fund 2026', reason: 'new', memberCount: 2, status: 'Forming' },
        { id: 3, name: 'Emergency Fund', reason: 'similar', memberCount: 5, status: 'Active' },
        { id: 4, name: 'Tech Gadget Pool', reason: 'popular', memberCount: 6, status: 'Active' },
        { id: 5, name: 'Holiday Shopping', reason: 'new', memberCount: 1, status: 'Forming' },
      ];
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = filter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.reason === filter);

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'popular': return '🔥 Popular';
      case 'new': return '✨ New';
      case 'similar': return '👤 Similar';
      default: return reason;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'popular', 'new', 'similar'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-40 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecommendations.map((group) => (
            <div
              key={group.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{group.name}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  group.status === 'Active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {group.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{group.memberCount} members</span>
                <span className="text-primary-600">{getReasonLabel(group.reason)}</span>
              </div>
              <button className="mt-3 w-full py-2 bg-primary-50 text-primary-600 rounded-md hover:bg-primary-100 text-sm font-medium">
                View Group
              </button>
            </div>
          ))}
        </div>
      )}

      {filteredRecommendations.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No recommendations found. Try a different filter!
        </div>
      )}
    </div>
  );
}
