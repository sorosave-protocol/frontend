import { useState, useEffect } from 'react';
import { RoundProgress } from '@/components/RoundProgress';
import { Contract } from '@stellar/stellar-sdk';
import { SorobanRpc } from '@stellar/stellar-sdk';

interface GroupPageProps {
  params: { id: string }
}

export default function GroupPage({ params }: GroupPageProps) {
  const [roundData, setRoundData] = useState({
    currentRound: 0,
    totalRounds: 0,
    contributionsReceived: 0,
    totalMembers: 0,
    isComplete: false
  });

  useEffect(() => {
    const fetchRoundData = async () => {
      try {
        const server = new SorobanRpc.Server(process.env.NEXT_PUBLIC_RPC_URL!);
        const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ID!);

        // Poll for round data every 10 seconds
        const interval = setInterval(async () => {
          const roundInfo = await server.getContractState(contract, 'round_info');
          const members = await server.getContractState(contract, 'members');

          setRoundData({
            currentRound: roundInfo.current_round,
            totalRounds: roundInfo.total_rounds,
            contributionsReceived: roundInfo.contributions_received,
            totalMembers: members.length,
            isComplete: roundInfo.is_complete
          });

          if (roundInfo.is_complete) {
            clearInterval(interval);
          }
        }, 10000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error('Error fetching round data:', error);
      }
    };

    fetchRoundData();
  }, [params.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Group Details</h1>
      <RoundProgress
        currentRound={roundData.currentRound}
        totalRounds={roundData.totalRounds}
        contributionsReceived={roundData.contributionsReceived}
        totalMembers={roundData.totalMembers}
      />
    </div>
  );
}