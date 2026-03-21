import React from 'react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'completed' | 'pending' | 'failed';
}

const transactions: Transaction[] = [
  {
    id: '1',
    date: '2026-03-20',
    amount: 1000,
    type: 'deposit',
    status: 'completed'
  },
  {
    id: '2',
    date: '2026-03-19',
    amount: 500,
    type: 'withdrawal',
    status: 'completed'
  },
  {
    id: '3',
    date: '2026-03-18',
    amount: 200,
    type: 'transfer',
    status: 'pending'
  }
];

const HistoryPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="py-2 px-4 border-b">{transaction.id}</td>
                <td className="py-2 px-4 border-b">{transaction.date}</td>
                <td className="py-2 px-4 border-b">${transaction.amount.toFixed(2)}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded ${transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : transaction.type === 'withdrawal' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;