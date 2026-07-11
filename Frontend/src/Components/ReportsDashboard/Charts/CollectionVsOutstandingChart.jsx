import React from 'react';
import { Wallet } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '../../Utils/formatters';

const CollectionVsOutstandingChart = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-[340px]">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Wallet size={18} className="text-indigo-600" />
          Collection vs Outstanding
        </h3>
        <p className="text-sm text-slate-500 mt-1">Monthly billed amount collected vs still due.</p>
      </div>

      <div className="flex-1 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={60} />
              <RechartsTooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value, name) => [formatCurrency(value), name]}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '12px' }} />
              <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} stackId="a" />
              <Bar dataKey="outstanding" name="Outstanding" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={16} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            <p>No collections data for this period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionVsOutstandingChart;
