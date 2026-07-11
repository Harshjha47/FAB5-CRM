import React from 'react';
import { Target } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const CollectionEfficiencyGauge = ({ value = 0, target = 90 }) => {
  const clamped = Math.max(0, Math.min(100, value));
  const chartData = [{ name: 'efficiency', value: clamped, fill: clamped >= target ? '#10b981' : '#f59e0b' }];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center h-[340px]">
      <h3 className="text-lg font-bold text-slate-800 self-start mb-2">Collection Efficiency</h3>

      <div className="relative flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="75%"
            outerRadius="100%"
            data={chartData}
            startAngle={90}
            endAngle={-270}
            barSize={18}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              background={{ fill: '#e2e8f0' }}
              cornerRadius={9}
              clockWise
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-900">{clamped.toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
        <Target size={14} className="text-slate-400" />
        Target: {target}%
      </div>
    </div>
  );
};

export default CollectionEfficiencyGauge;
