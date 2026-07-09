import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ReferenceLine, ResponsiveContainer
} from 'recharts';

const ChurnAcquisitionChart = ({ data }) => {
  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-[400px]">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ArrowRightLeft size={20} className="text-indigo-600" />
            Activation vs Churn
          </h3>
          <p className="text-sm text-slate-500 mt-1">Monthly comparison of new circuit activations against disconnections.</p>
        </div>

        <div className="flex-1 w-full mt-2">
          {data && data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                
                <RechartsTooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value, name) => [`${value} Circuits`, name]}
                />
                
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} />

                <Bar dataKey="Activated" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Churned" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              <p>No historical activation or churn data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChurnAcquisitionChart;