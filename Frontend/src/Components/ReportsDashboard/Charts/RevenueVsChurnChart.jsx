import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const getScaleProps = (maxValue) => {
  if (maxValue >= 10000000) return { divisor: 10000000, label: "Cr" };
  if (maxValue >= 100000) return { divisor: 100000, label: "Lakh" };
  if (maxValue >= 1000) return { divisor: 1000, label: "K" };
  return { divisor: 1, label: "" };
};

const RevenueVsChurnChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // 1. Find the absolute highest value between BOTH Revenue and Churn
  const maxRev = Math.max(...data.map(d => d.Revenue));
  const maxChurn = Math.max(...data.map(d => d.ChurnMRR));
  const globalMax = Math.max(maxRev, maxChurn);

  // 2. Determine ONE unified scale for the entire chart
  const unifiedScale = getScaleProps(globalMax);

  // 3. Apply the exact same divisor to both metrics
  const chartData = data.map(d => ({
    ...d,
    scaledRev: Number((d.Revenue / unifiedScale.divisor).toFixed(2)),
    scaledChurn: Number((d.ChurnMRR / unifiedScale.divisor).toFixed(2))
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full w-full mb-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          Delivery vs Churn
        </h3>
      </div>

      <div className="w-full mt-2 h-[350px] min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10} 
            />
            
            {/* Single Unified Y-Axis */}
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              width={60}
              tickFormatter={(value) => `${value} ${unifiedScale.label}`}
            />
            
            <RechartsTooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value, name, props) => {
                const isRev = name.includes('Revenue');
                const originalValue = isRev ? props.payload.Revenue : props.payload.ChurnMRR;
                return [`₹${Math.round(originalValue).toLocaleString('en-IN')}`, isRev ? 'Revenue' : 'Lost MRR'];
              }}
            />
            
            <Legend 
              iconType="circle" 
              wrapperStyle={{ paddingTop: '20px' }} 
            />

            {/* Revenue Line */}
            <Line 
              type="monotone" 
              dataKey="scaledRev" 
              name={`Revenue (₹ ${unifiedScale.label})`.trim()}
              stroke="#2563eb" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: '#2563eb' }} 
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
            />
            
            {/* Churn Line - Now on the exact same scale */}
            <Line 
              type="monotone" 
              dataKey="scaledChurn" 
              name={`Churn (₹ ${unifiedScale.label})`.trim()}
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: '#ef4444' }} 
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueVsChurnChart;