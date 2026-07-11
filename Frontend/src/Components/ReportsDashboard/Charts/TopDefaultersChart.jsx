import React from 'react';
import { AlertOctagon } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, LabelList
} from 'recharts';
import { formatCurrency } from '../../Utils/formatters';

// Shortens a company name for the axis tick without losing recognizability
const shortLabel = (name = '') => (name.length > 12 ? `${name.slice(0, 10)}…` : name);

const TopDefaultersChart = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-[340px]">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <AlertOctagon size={18} className="text-violet-500" />
          Top 5 Debtors
        </h3>
        <p className="text-sm text-slate-500 mt-1">Customers with the highest outstanding balance.</p>
      </div>

      <div className="flex-1 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="companyName"
                tickFormatter={shortLabel}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <YAxis hide />
              <RechartsTooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [formatCurrency(value), 'Outstanding']}
                labelFormatter={(label) => label}
              />
              <Bar dataKey="outstanding" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={32}>
                <LabelList
                  dataKey="outstanding"
                  position="top"
                  fill="#64748b"
                  fontSize={11}
                  fontWeight={700}
                  formatter={(val) => formatCurrency(val)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            <p>No defaulters right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopDefaultersChart;
