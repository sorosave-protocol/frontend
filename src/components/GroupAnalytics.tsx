"use client";

import React from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

const COLORS = ['#16a34a', '#22c55e', '#86efac', '#e5e7eb'];

export function GroupAnalytics({ group }: { group: any }) {
  // Mock data for analytics - in real app this would come from an API/Contract
  const contributionData = [
    { round: 'Round 1', total: 5000, participation: 100 },
    { round: 'Round 2', total: 4500, participation: 90 },
    { round: 'Round 3', total: 5000, participation: 100 },
    { round: 'Round 4', total: 3000, participation: 60 },
  ];

  const participationData = [
    { name: 'Paid', value: group.members.length * 0.8 },
    { name: 'Pending', value: group.members.length * 0.2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-green-600 mb-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">Growth</span>
          </div>
          <div className="text-2xl font-bold">+12.5%</div>
          <div className="text-gray-500 text-xs mt-1">Vs last cycle</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-blue-600 mb-2">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">Active Members</span>
          </div>
          <div className="text-2xl font-bold">{group.members.length}</div>
          <div className="text-gray-500 text-xs mt-1">100% participation</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center text-orange-600 mb-2">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pot</span>
          </div>
          <div className="text-2xl font-bold">15,400</div>
          <div className="text-gray-500 text-xs mt-1">XLM Vol.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center">
            Contribution History
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={contributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="round" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#16a34a" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center">
            Participation Breakdown
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={participationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {participationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
