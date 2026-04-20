"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Mock data for demonstration
const mockContributionOverTime = [
  { name: "Week 1", amount: 4000 },
  { name: "Week 2", amount: 3000 },
  { name: "Week 3", amount: 5000 },
  { name: "Week 4", amount: 4500 },
  { name: "Week 5", amount: 6000 },
  { name: "Week 6", amount: 5500 },
];

const mockPayoutDistribution = [
  { name: "Member A", payout: 8000 },
  { name: "Member B", payout: 5000 },
  { name: "Member C", payout: 2000 },
  { name: "Member D", payout: 1500 },
];

const mockMemberParticipation = [
  { name: "Active", value: 400 },
  { name: "Occasional", value: 300 },
  { name: "Inactive", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export const GroupAnalytics = () => {
  return (
    <div className="w-full flex flex-col space-y-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Group Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contribution Amount Over Time */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
            Contributions Over Time
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockContributionOverTime}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#0f766e"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payout Distribution Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
            Payout Distribution
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockPayoutDistribution}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="payout" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Participation Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
            Member Participation
          </h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockMemberParticipation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockMemberParticipation.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
