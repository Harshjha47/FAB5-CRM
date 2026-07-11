import React from 'react';
import { Hourglass } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';
import { formatCurrency } from '../../Utils/formatters';

// Color-coded by risk, matching the bucket the entry falls into
const BUCKET_COLORS = {
  '0-30 Days': '#10b981',
  '31-60 Days': '#f59e0b',
  '61-90 Days': '#f97316',
  '90+ Days': '#f43f5e'
};

const AgingAnalysisChart = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-[340px]">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Hourglass size={18} className="text-orange-500" />
          Aging Analysis
        </h3>
        <p className="text-sm text-slate-500 mt-1">Outstanding balance by how overdue it is.</p>
      </div>

      <div className="flex-1 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 70, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                width={80}
              />
              <RechartsTooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [formatCurrency(value), 'Outstanding']}
              />
              <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={26}>
                {data.map((entry) => (
                  <Cell key={entry.label} fill={BUCKET_COLORS[entry.label] || '#94a3b8'} />
                ))}
                <LabelList
                  dataKey="total"
                  position="right"
                  fill="#64748b"
                  fontSize={12}
                  fontWeight={700}
                  formatter={(val) => formatCurrency(val)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            <p>No outstanding bills — everything's collected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgingAnalysisChart;
