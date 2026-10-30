"use client";
import React from 'react';
import { SavingsGroup } from "@sorosave/sdk";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface AnalyticsProps {
  groups: SavingsGroup[];
}

const COLORS = ['#0f766e', '#14b8a6', '#0d9488', '#0f766e'];

export function GroupAnalytics({ groups }: AnalyticsProps) {
  if (!groups || groups.length === 0) return null;

  // 1. Process Bar Chart Data (Total Pot Size per group)
  // Safely convert bigint to number by stringifying first to avoid TS/Recharts crashing
  const tvlData = groups.map(g => {
    const amountStr = g.contributionAmount.toString();
    const amountNum = Number(amountStr) / 10000000; // Convert stroops to standard units
    return {
      name: g.name.length > 15 ? g.name.substring(0, 15) + '...' : g.name,
      TotalPot: amountNum * g.maxMembers
    };
  });

  // 2. Process Pie Chart Data (Group Status Distribution)
  const statusCount = groups.reduce((acc, g) => {
    // Convert enum/status to string for chart grouping
    const statusName = String(g.status);
    acc[statusName] = (acc[statusName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCount).map(key => ({
    name: `Status: ${key}`,
    value: statusCount[key]
  }));

  // 3. Summary Stats
  const totalMembers = groups.reduce((sum, g) => sum + (g.members?.length || 0), 0);

  return (
    <div className="mb-12 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Active Groups</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{groups.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Participants</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalMembers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Avg Members per Group</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {Math.round(totalMembers / groups.length)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pot Size Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tvlData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="TotalPot" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Group Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}