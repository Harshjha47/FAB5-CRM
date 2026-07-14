import React, { useState } from 'react';
import { TrendingUp, Calendar, Users } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../../Context/AuthContext';

// Inline currency formatter to prevent missing import errors
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const CHART_COLORS = [
  '#4f46e5', '#0ea5e9', '#f59e0b', '#10b981', '#f43f5e',
  '#8b5cf6', '#64748b', '#d946ef', '#14b8a6', '#f97316'
];
const SystemGrowthChart = ({ chartInfo, timeRange, setTimeRange }) => {
  const { data = [], salesPersons = [] } = chartInfo || {};
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';


  // Extra safety filter to remove the administrator from the legend/lines if it slipped through
  const filteredSalesPersons = salesPersons.filter(sp => sp !== 'administrator@fab5network.com');

  const [viewMode, setViewMode] = useState('global');

  return (
    <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={24} className="text-indigo-600" />
            Revenue Trend
          </h3>
          <p className="text-sm text-slate-500 mt-1">Track the volume of new revenue over time.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {isAdmin && <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('global')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${viewMode === 'global' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <TrendingUp size={14} /> Global
            </button>
            <button
              onClick={() => setViewMode('breakout')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${viewMode === 'breakout' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Users size={14} /> Team Breakout
            </button>
          </div>}


          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            {[ 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${timeRange === range ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full mt-4">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={60} />

              <RechartsTooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '3 3' }}
                formatter={(value, name) => [formatCurrency(value), name === 'Global' ? 'Total MRR' : name]}
              />

              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

              {viewMode === 'global' && (
                <Line
                  type="monotone"
                  dataKey="Global"
                  name="Global Revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3 }}
                />
              )}

              {viewMode === 'breakout' && filteredSalesPersons.map((spName, index) => (
                <Line
                  key={String(spName)}
                  type="monotone"
                  dataKey={String(spName)}
                  name={String(spName)}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 1 }}
                  activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Calendar size={48} className="mb-4 opacity-50" />
            <p>No timeline data available for the selected range.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemGrowthChart;