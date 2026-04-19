import { useState, useEffect } from 'react';
import { useWallet } from '@/app/providers';
import { sorosaveClient, NETWORK_PASSPHRASE } from '@/lib/sorosave';
import { signTransaction } from '@/lib/wallet';
import { useParams } from 'next/navigation';

interface GroupDetails {
  id: string;
  name: string;
  token: string;
  contributionAmount: string;
  cycleLength: number;
  maxMembers: number;
  currentMembers: number;
}

export default function InvitePage() {
  const { code } = useParams();
  const { address, isConnected } = useWallet();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchGroup() {
      try {
        const groupData = await sorosaveClient.getGroup(code as string);
        setGroup(groupData);
      } catch (err) {
        setError('Failed to load group details');
      } finally {
        setLoading(false);
      }
    }
    fetchGroup();
  }, [code]);

  const handleJoin = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const tx = await sorosaveClient.joinGroup({
        groupId: code as string,
        member: address
      });

      const signedXdr = await signTransaction(
        tx.toXDR(),
        NETWORK_PASSPHRASE
      );

      // TODO: Submit signed transaction to network
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        {error}
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-12 text-green-500">
        Successfully joined the group!
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Join Group</h1>

      {group && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{group.name}</h2>
            <p className="text-gray-600">
              Contribution: {group.contributionAmount} {group.token}
            </p>
            <p className="text-gray-600">
              Cycle Length: {group.cycleLength / 86400} days
            </p>
            <p className="text-gray-600">
              Members: {group.currentMembers}/{group.maxMembers}
            </p>
          </div>

          {!isConnected ? (
            <div className="text-center py-4 text-gray-500">
              Please connect your wallet to join this group.
            </div>
          ) : (
            <button
              onClick={handleJoin}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Join Group
            </button>
          )}
        </div>
      )}
    </div>
  );
}