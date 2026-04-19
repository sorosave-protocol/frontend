import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { getUserGroups, getPendingActions } from '@/services/api';

interface Group {
  id: string;
  name: string;
  needsContribution: boolean;
  nextPayout: string;
  totalContributed: number;
  totalReceived: number;
}

interface PendingAction {
  groupId: string;
  type: 'contribution' | 'approval';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      try {
        setLoading(true);
        const [userGroups, actions] = await Promise.all([
          getUserGroups(user.address),
          getPendingActions(user.address)
        ]);

        setGroups(userGroups);
        setPendingActions(actions);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Dashboard</h1>

        {/* Pending Actions */}
        {pendingActions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingActions.map((action) => (
                <div key={action.groupId} className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="font-medium">
                    {action.type === 'contribution' ? 'Contribution needed' : 'Approval pending'}
                  </p>
                  <p className="text-sm text-gray-600">Group ID: {action.groupId}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Groups Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Groups</h2>
          {groups.length === 0 ? (
            <p className="text-gray-500">You don't belong to any groups yet.</p>
          ) : (
            <div className="space-y-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`bg-white rounded-lg shadow-sm border p-6 ${group.needsContribution ? 'border-red-200' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-500">Group ID: {group.id}</p>
                    </div>
                    {group.needsContribution && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Needs Contribution</span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Next Payout</p>
                      <p className="text-lg font-semibold text-gray-900">{group.nextPayout}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Contributed</p>
                      <p className="text-lg font-semibold text-gray-900">{group.totalContributed.toFixed(2)} XLM</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Received</p>
                      <p className="text-lg font-semibold text-gray-900">{group.totalReceived.toFixed(2)} XLM</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}