import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { RoundProgress } from "@/components/RoundProgress";
import { GroupCard } from "@/components/GroupCard";
import { exportGroupData } from "@/lib/export";

interface Group {
  id: string;
  name: string;
  description: string;
  contributionAmount: string;
  currentRound: number;
  totalRounds: number;
  members: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  contributions: Array<{
    date: string;
    amount: string;
    member: string;
    round: number;
  }>;
  status: string;
}

async function fetchGroup(id: string): Promise<Group | null> {
  // Mock data - replace with actual API call
  const mockGroups: Group[] = [
    {
      id: "1",
      name: "Test Group",
      description: "A test rotating savings group",
      contributionAmount: "100",
      currentRound: 2,
      totalRounds: 5,
      members: [
        { id: "m1", name: "Alice", address: "GAABC..." },
        { id: "m2", name: "Bob", address: "GBBCD..." },
      ],
      contributions: [
        { date: "2024-01-01", amount: "100", member: "Alice", round: 1 },
        { date: "2024-01-02", amount: "100", member: "Bob", round: 1 },
        { date: "2024-01-03", amount: "100", member: "Alice", round: 2 },
      ],
      status: "active",
    },
  ];
  
  return mockGroups.find((g) => g.id === id) || null;
}

export default async function GroupDetail({ params }: { params: { id: string } }) {
  const group = await fetchGroup(params.id);
  
  if (!group) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => exportGroupData(group, "csv")}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={() => exportGroupData(group, "pdf")}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Export PDF
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-8">{group.description}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GroupCard group={group} />
          </div>
          <div>
            <RoundProgress
              currentRound={group.currentRound}
              totalRounds={group.totalRounds}
              contributionsReceived={group.contributions.length}
              totalMembers={group.members.length}
            />
          </div>
        </div>
      </main>
    </>
  );
}