import Link from 'next/link';

interface InviteButtonProps {
  groupId: string;
}

export function InviteButton({ groupId }: InviteButtonProps) {
  return (
    <Link
      href={`/invite/${groupId}`}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      Generate Invite Link
    </Link>
  );
}