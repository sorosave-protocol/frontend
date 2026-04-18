"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Mock data - will be replaced with real contract data
interface ContributionData {
  round: number;
  amount: number;
  date: string;
}

interface PayoutData {
  member: string;
  amount: number;
}

interface ParticipationData {
  name: string;
  value: number;
  color: string;
}

interface GroupAnalyticsProps {
  groupId: number;
  contributionAmount: bigint;
  members: string[];
  payoutOrder: string[];
  currentRound: number;
  totalRounds: number;
}

export function GroupAnalytics({
  groupId,
  contributionAmount,
  members,
  payoutOrder,
  currentRound,
  totalRounds,
}: GroupAnalyticsProps) {
  // Generate mock contribution data (line chart)
  const contributionData: ContributionData[] = Array.from(
    { length: currentRound },
    (_, i) => ({
      round: i + 1,
      amount: Number(contributionAmount) * members.length,
      date: `Round ${i + 1}`,
    })
  );

  // Generate payout distribution data (bar chart)
  const payoutData: PayoutData[] = payoutOrder.slice(0, currentRound).map(
    (member, i) => ({
      member: `Member ${i + 1}`,
      amount: Number(contributionAmount) * members.length,
    })
  );

  // Generate member participation data (pie chart)
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const participationData: ParticipationData[] = members.map((member, i) => ({
    name: `Member ${i + 1}`,
    value: 1,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Group Analytics</h2>

      {/* Contribution Amount Over Time - Line Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contributions Over Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={contributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value.toLocaleString()} tokens`, "Amount"]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: "#4f46e5", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payout Distribution - Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payout Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="member"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value.toLocaleString()} tokens`, "Received"]}
              />
              <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Member Participation - Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Member Participation
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={participationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name }) => name}
                labelLine={{ stroke: "#6b7280" }}
              >
                {participationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}