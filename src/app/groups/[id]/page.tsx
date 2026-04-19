import { AdminPanel } from '@/components/AdminPanel';
import { useWallet } from '@/app/providers';
import { getGroupDetails } from '@/lib/groups';

interface GroupPageProps {
  params: {
    id: string;
  };
}

export default function GroupPage({ params }: GroupPageProps) {
  const { address } = useWallet();
  const groupId = params.id;

  // Fetch group details
  const { data: group } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => getGroupDetails(groupId),
  });

  if (!group) return <div>Loading...</div>;

  const isAdmin = address === group.adminAddress;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Group details content */}
      <AdminPanel
        groupId={groupId}
        isAdmin={isAdmin}
        groupStatus={group.status}
      />
    </div>
  );
}