"use client";

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Mock analytics data — replace with contract/Horizon queries
const CONTRIBUTION_HISTORY = [
  { round: "Round 1", amount: 5000, cumulative: 5000 },
  { round: "Round 2", amount: 5000, cumulative: 10000 },
  { round: "Round 3", amount: 4500, cumulative: 14500 },
  { round: "Round 4", amount: 5000, cumulative: 19500 },
  { round: "Round 5", amount: 5000, cumulative: 24500 },
];

const PAYOUT_DISTRIBUTION = [
  { member: "GABC…", received: 25000, contributed: 5000 },
  { member: "GDEF…", received: 0, contributed: 10000 },
  { member: "GHIJ…", received: 0, contributed: 7500 },
  { member: "GKLM…", received: 0, contributed: 5000 },
  { member: "GNOP…", received: 0, contributed: 2500 },
];

const PARTICIPATION_DATA = [
  { name: "On Time", value: 18, color: "#16a34a" },
  { name: "Late (1-3 days)", value: 4, color: "#eab308" },
  { name: "Missed", value: 2, color: "#ef4444" },
];

const CHART_COLORS = ["#16a34a", "#86efac", "#bbf7d0", "#dcfce7", "#f0fdf4"];

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</p>
      ))}
    </div>
  );
}

export function GroupAnalytics() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">📊 Group Analytics</h3>

      {/* Contributions over time */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Contributions Over Time</h4>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={CONTRIBUTION_HISTORY} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="round" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="amount" name="Round Amount" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="cumulative" name="Cumulative" stroke="#86efac" strokeWidth={2} strokeDasharray="5 5" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Payout distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Payout vs Contribution by Member</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={PAYOUT_DISTRIBUTION} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="member" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="contributed" name="Contributed" fill="#86efac" radius={[4, 4, 0, 0]} />
            <Bar dataKey="received" name="Received" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Participation pie */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Member Participation</h4>
        <div className="flex flex-col sm:flex-row items-center">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={PARTICIPATION_DATA}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {PARTICIPATION_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value ?? 0} contributions`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="sm:pl-4 space-y-2 mt-2 sm:mt-0 flex-shrink-0">
            {PARTICIPATION_DATA.map((item, i) => (
              <div key={i} className="flex items-center space-x-2 text-sm">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
