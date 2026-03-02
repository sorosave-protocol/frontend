"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface GroupDetails {
  id: number;
  name: string;
  description: string;
  admin: string;
  maxMembers: number;
  currentMembers: number;
  contributionAmount: string;
  status: 'Forming' | 'Active' | 'Completed';
}

export default function InvitePage() {
  const { code } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    if (code) {
      loadGroupDetails();
    }
  }, [code]);

  const loadGroupDetails = async () => {
    setLoading(true);
    try {
      // Decode the invite code (base64 encoded group ID)
      const groupId = atob(code as string);
      
      // Mock API call - replace with actual SDK call
      const mockGroup: GroupDetails = {
        id: parseInt(groupId),
        name: 'Weekly Savings Circle',
        description: 'A group for weekly savings with friends and family',
        admin: 'GABC123...',
        maxMembers: 10,
        currentMembers: 4,
        contributionAmount: '50 USDC',
        status: 'Forming',
      };
      
      setGroup(mockGroup);
    } catch (err) {
      setError('Invalid invitation link');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!walletConnected) {
      // Trigger wallet connection
      alert('Please connect your wallet first');
      return;
    }

    setJoining(true);
    try {
      // Mock join API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setJoinSuccess(true);
    } catch (err) {
      setError('Failed to join group. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (joinSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You're In!</h1>
          <p className="text-gray-600 mb-6">
            You've successfully joined <strong>{group?.name}</strong>. 
            Head to the group page to start contributing.
          </p>
          <button
            onClick={() => router.push(`/groups/${group?.id}`)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
          >
            Go to Group
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Group Header */}
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🤝</div>
            <h1 className="text-2xl font-bold text-gray-900">{group?.name}</h1>
            <p className="text-gray-600 mt-2">{group?.description}</p>
          </div>

          {/* Group Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Contribution</p>
                <p className="font-semibold">{group?.contributionAmount}</p>
              </div>
              <div>
                <p className="text-gray-500">Members</p>
                <p className="font-semibold">{group?.currentMembers}/{group?.maxMembers}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className={`font-semibold ${
                  group?.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {group?.status}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Admin</p>
                <p className="font-semibold">{group?.admin}</p>
              </div>
            </div>
          </div>

          {/* Wallet Warning */}
          {!walletConnected && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                ⚠️ Please connect your wallet before joining
              </p>
            </div>
          )}

          {/* Join Button */}
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {joining ? 'Joining...' : walletConnected ? 'Join Group' : 'Connect Wallet to Join'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By joining, you agree to the group terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}
