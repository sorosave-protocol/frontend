"use client";

import { SavingsGroup, formatAmount, getStatusLabel } from "@sorosave/sdk";
import { useState } from "react";

interface GroupCompareProps {
  groups: SavingsGroup[];
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  Forming: "bg-blue-100 text-blue-800",
  Active: "bg-green-100 text-green-800",
  Completed: "bg-gray-100 text-gray-800",
  Disputed: "bg-red-100 text-red-800",
  Paused: "bg-yellow-100 text-yellow-800",
};

const getDifferenceClass = (value1: any, value2: any): string => {
  if (value1 === value2) return "text-green-600";
  return "text-red-600 font-semibold";
};

export function GroupCompare({ groups, onClose }: GroupCompareProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (groups.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Compare Groups</h3>
          <p className="text-gray-600">No groups selected for comparison.</p>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Compare Groups</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="flex border-b mb-6">
            {groups.map((group, index) => (
              <button
                key={group.id}
                onClick={() => setActiveTab(index)}
                className={`flex-1 py-2 px-4 text-center font-medium border-b-2 transition-colors ${
                  activeTab === index
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Group Details */}
            {groups.map((group, index) => (
              <div key={group.id} className={index !== activeTab ? "hidden" : ""}>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">{group.name}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[group.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {getStatusLabel(group.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contribution Amount</span>
                      <span className="font-medium">
                        {formatAmount(group.contributionAmount)} tokens
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cycle Length</span>
                      <span className="font-medium">
                        {group.cycleLength || "N/A"} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Members</span>
                      <span className="font-medium">
                        {group.members.length} / {group.maxMembers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Round</span>
                      <span className="font-medium">{group.currentRound}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Rounds</span>
                      <span className="font-medium">
                        {group.totalRounds || group.maxMembers}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Comparison</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Attribute
                    </th>
                    {groups.map((group) => (
                      <th key={group.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {group.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      Status
                    </td>
                    {groups.map((group) => (
                      <td key={group.id} className="px-4 py-2 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[group.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {getStatusLabel(group.status)}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      Contribution Amount
                    </td>
                    {groups.map((group) => (
                      <td key={group.id} className="px-4 py-2 whitespace-nowrap text-sm">
                        {formatAmount(group.contributionAmount)} tokens
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      Cycle Length
                    </td>
                    {groups.map((group) => (
                      <td key={group.id} className="px-4 py-2 whitespace-nowrap text-sm">
                        {group.cycleLength || "N/A"} days
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      Members
                    </td>
                    {groups.map((group) => (
                      <td key={group.id} className="px-4 py-2 whitespace-nowrap text-sm">
                        {group.members.length} / {group.maxMembers}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}