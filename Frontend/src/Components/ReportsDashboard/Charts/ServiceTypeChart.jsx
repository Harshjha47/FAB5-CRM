import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, LabelList
} from 'recharts';

const ServiceTypeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // 1. Determine the maximum value to set a UNIFORM scale for the entire chart
  const maxValue = Math.max(...data.map(d => d.value));
  
  let divisor = 1;
  let unitLabel = "(₹)";

  if (maxValue >= 10000000) {
    divisor = 10000000;
    unitLabel = "(₹ Cr)";
  } else if (maxValue >= 100000) {
    divisor = 100000;
    unitLabel = "(₹ Lakh)";
  } else if (maxValue >= 1000) {
    divisor = 1000;
    unitLabel = "(₹ K)";
  }

  // 2. Pre-scale the data before passing it to Recharts. 
  // This prevents internal formatting crashes and axis scaling bugs.
  const chartData = data.map(d => ({
    name: d.name,
    scaledValue: Number((d.value / divisor).toFixed(1)),
    originalValue: d.value
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">
          Service-wise Sales <span className="text-slate-500 font-medium text-sm ml-1">{unitLabel}</span>
        </h3>
      </div>

      {/* FIXED: Removed flex-1 and added strict heights so ResponsiveContainer doesn't collapse to 0 */}
      <div className="w-full mt-2 h-[300px] min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="vertical" 
            // Increased right margin so the labels at the end of bars don't get cut off
            margin={{ top: 10, right: 50, left: 0, bottom: 5 }} 
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={true} stroke="#f1f5f9" />
            
            <XAxis 
              type="number" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
            />
            
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#334155', fontWeight: 500, fontSize: 13 }} 
              width={90} 
            />
            
            <RechartsTooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              // Use the original, unscaled value for the hover tooltip
              formatter={(value, name, props) => {
                const originalValue = props.payload.originalValue;
                return [`₹${Math.round(originalValue).toLocaleString('en-IN')}`, 'Revenue'];
              }}
            />

            <Bar 
              dataKey="scaledValue" 
              fill="#2563eb" 
              radius={[0, 4, 4, 0]} 
              barSize={20}
            >
              <LabelList 
                dataKey="scaledValue" 
                position="right" 
                fill="#475569" 
                fontSize={13} 
                fontWeight={600} 
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServiceTypeChart;