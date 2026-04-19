import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { getPublicKey } from "@/lib/wallet";
import { shortenAddress } from "@sorosave/sdk";

interface Transaction {
  type: 'contribution' | 'payout' | 'group_join';
  hash: string;
  timestamp: string;
  amount?: string;
  groupId?: string;
  member?: string;
}

async function fetchTransactionHistory(): Promise<Transaction[]> {
  // In a real implementation, this would fetch from your backend API
  // For now, return mock data to satisfy the UI requirements
  const publicKey = await getPublicKey();
  
  if (!publicKey) {
    return [];
  }

  return [
    {
      type: 'contribution',
      hash: 'cde567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      timestamp: '2024-04-15T10:30:00Z',
      amount: '100 XLM',
      groupId: 'group-123',
      member: publicKey
    },
    {
      type: 'payout',
      hash: 'f123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      timestamp: '2024-04-10T09:15:00Z',
      amount: '1000 XLM',
      groupId: 'group-123',
      member: publicKey
    },
    {
      type: 'group_join',
      hash: 'a123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      timestamp: '2024-04-05T14:20:00Z',
      groupId: 'group-123',
      member: publicKey
    }
  ];
}

export default async function HistoryPage() {
  const transactions = await fetchTransactionHistory();

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-2">
            View all your contributions, payouts, and group memberships
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Hash
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Explorer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={
                        tx.type === 'contribution' ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800' :
                        tx.type === 'payout' ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800' :
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
                      }>
                        {tx.type === 'contribution' && 'Contribution'}
                        {tx.type === 'payout' && 'Payout'}
                        {tx.type === 'group_join' && 'Group Join'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shortenAddress(tx.hash)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.amount || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {tx.groupId ? (
                        <Link
                          href={`/groups/${tx.groupId}`}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          {shortenAddress(tx.groupId)}
                        </Link>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 inline-flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        View
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}