import React from 'react';
import { MapPin } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, LabelList
} from 'recharts';
import { formatCurrency } from '../../Utils/formatters';

const GeoPenetrationChart = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-[400px]">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <MapPin size={20} className="text-rose-500" />
          Geographical Penetration
        </h3>
        <p className="text-sm text-slate-500 mt-1">Active MRR distributed by state.</p>
      </div>

      <div className="flex-1 w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 90, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />

              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="state"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                width={120}
              />

              <RechartsTooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [formatCurrency(value), 'Live Revenue']}
              />

              <Bar dataKey="revenue" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={28}>
                <LabelList
                  dataKey="revenue"
                  position="right"
                  fill="#64748b"
                  fontSize={13}
                  fontWeight={700}
                  formatter={(val) => formatCurrency(val)}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400">
            <p>No active revenue found for geographic data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeoPenetrationChart;