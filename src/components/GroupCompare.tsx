"use client";

import { useState } from 'react';

interface GroupData {
  id: number;
  name: string;
  contributionAmount: string;
  cycleLength: string;
  currentMembers: number;
  maxMembers: number;
  status: string;
  description: string;
}

interface GroupCompareProps {
  groups: GroupData[];
}

export function GroupCompare({ groups }: GroupCompareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleGroup = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedGroups = groups.filter(g => selectedIds.includes(g.id));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Forming': return 'bg-yellow-100 text-yellow-700';
      case 'Completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <>
      {/* Compare Button */}
      {selectedIds.length >= 2 && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-primary-700 z-40 flex items-center gap-2"
        >
          Compare ({selectedIds.length})
        </button>
      )}

      {/* Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Compare Groups</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            {/* Comparison Table */}
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-500 font-medium">Feature</th>
                    {selectedGroups.map(g => (
                      <th key={g.id} className="text-left py-3 px-4 font-semibold">{g.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-3 px-4 text-gray-600">Status</td>
                    {selectedGroups.map(g => (
                      <td key={g.id} className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(g.status)}`}>
                          {g.status}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-4 text-gray-600">Contribution</td>
                    {selectedGroups.map(g => (
                      <td key={g.id} className="py-3 px-4 font-medium">{g.contributionAmount}</td>
                    ))}
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-4 text-gray-600">Cycle Length</td>
                    {selectedGroups.map(g => (
                      <td key={g.id} className="py-3 px-4">{g.cycleLength}</td>
                    ))}
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-4 text-gray-600">Members</td>
                    {selectedGroups.map(g => (
                      <td key={g.id} className="py-3 px-4">{g.currentMembers}/{g.maxMembers}</td>
                    ))}
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-4 text-gray-600">Description</td>
                    {selectedGroups.map(g => (
                      <td key={g.id} className="py-3 px-4 text-sm">{g.description}</td>
                    ))}
                  </tr>
                </tbody>
              </table>

              {/* Differences Highlight */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Recommendation</h3>
                <p className="text-sm text-blue-800">
                  {selectedGroups.length > 0 && (
                    <>
                      {selectedGroups.sort((a, b) => {
                        const aVal = parseInt(a.contributionAmount.replace(/[^0-9]/g, ''));
                        const bVal = parseInt(b.contributionAmount.replace(/[^0-9]/g, ''));
                        return bVal - aVal;
                      })[0]?.name} has the highest contribution amount.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Checkbox component for GroupCard
export function CompareCheckbox({ groupId, checked, onChange }: { 
  groupId: number; 
  checked: boolean; 
  onChange: (id: number) => void;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onChange(groupId)}
      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
      title="Select to compare (max 3)"
    />
  );
}
